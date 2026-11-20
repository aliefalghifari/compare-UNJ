
import json
import os
from typing import Any

import httpx


class InferenceServiceError(Exception):
    """Raised when the Hugging Face inference request fails."""


class InferenceService:
    def __init__(self) -> None:
        self.base_url = os.getenv(
            "HF_SPACE_URL",
            "https://penakluknaga-compare-inference.hf.space",
        ).rstrip("/")

        self.token = os.getenv("HF_TOKEN")

        self.timeout = httpx.Timeout(
            timeout=120.0,
            connect=15.0,
        )

    def _get_headers(self) -> dict[str, str]:
        headers = {
            "Content-Type": "application/json",
        }

        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"

        return headers

    async def predict(self, message: str) -> dict[str, Any]:
        """
        Send a customer message to the Hugging Face Space.

        Returns:
            Dictionary containing intent classification
            and entity extraction results.
        """
        if not message or not message.strip():
            raise ValueError("Message cannot be empty.")

        headers = self._get_headers()

        async with httpx.AsyncClient(
            timeout=self.timeout,
            headers=headers,
        ) as client:

            try:
                # Step 1: Submit inference request.
                submit_response = await client.post(
                    f"{self.base_url}/gradio_api/call/predict",
                    json={
                        "data": [message],
                    },
                )

                submit_response.raise_for_status()

                submit_data = submit_response.json()
                event_id = submit_data.get("event_id")

                if not event_id:
                    raise InferenceServiceError(
                        "Hugging Face did not return an event_id."
                    )

                # Step 2: Retrieve inference result through SSE.
                result = await self._get_result(
                    client=client,
                    event_id=event_id,
                )

                return self._normalize_result(result)

            except httpx.TimeoutException as exc:
                raise InferenceServiceError(
                    "Hugging Face inference request timed out."
                ) from exc

            except httpx.HTTPStatusError as exc:
                raise InferenceServiceError(
                    f"Hugging Face returned HTTP "
                    f"{exc.response.status_code}."
                ) from exc

            except httpx.RequestError as exc:
                raise InferenceServiceError(
                    "Could not connect to Hugging Face Space."
                ) from exc

    async def _get_result(
        self,
        client: httpx.AsyncClient,
        event_id: str,
    ) -> Any:
        """Read the Gradio SSE stream until inference completes."""

        url = (
            f"{self.base_url}/gradio_api/call/predict/"
            f"{event_id}"
        )

        event_type = None

        async with client.stream("GET", url) as response:
            response.raise_for_status()

            async for line in response.aiter_lines():
                if line.startswith("event:"):
                    event_type = line.removeprefix("event:").strip()

                elif line.startswith("data:"):
                    raw_data = line.removeprefix("data:").strip()

                    if event_type == "error":
                        raise InferenceServiceError(
                            f"Hugging Face inference failed: {raw_data}"
                        )

                    if event_type == "complete":
                        try:
                            return json.loads(raw_data)
                        except json.JSONDecodeError as exc:
                            raise InferenceServiceError(
                                "Invalid JSON returned by Hugging Face."
                            ) from exc

        raise InferenceServiceError(
            "Hugging Face stream ended without a completed result."
        )

    @staticmethod
    def _normalize_result(result: Any) -> dict[str, Any]:
        """
        Gradio commonly wraps a single output in a list.
        Unwrap it while preserving the returned JSON structure.
        """

        if isinstance(result, list) and len(result) == 1:
            result = result[0]

        if not isinstance(result, dict):
            raise InferenceServiceError(
                "Expected a JSON object from the inference endpoint, "
                f"received {type(result).__name__}."
            )

        return result
