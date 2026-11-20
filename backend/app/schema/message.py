
from pydantic import BaseModel, Field


class MessageRequest(BaseModel):
    message: str = Field(min_length=1)
    session_id: str | None = None


class EntitySpan(BaseModel):
    text: str
    label: str
    start: int
    end: int


class IntentPrediction(BaseModel):
    predicted_class: int
    intent: str
    confidence: float

class HandlerResponse(BaseModel):
    status: str
    result: list[dict] = Field(default_factory=list)


class MessageResponse(BaseModel):
    session_id: str | None = None
    intents: list[IntentPrediction]
    threshold: float
    entities: list[EntitySpan] = Field(default_factory=list)
    handler_results:HandlerResponse
    draft_response: str | None = None
