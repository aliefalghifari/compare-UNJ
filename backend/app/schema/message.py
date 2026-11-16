from pydantic import BaseModel, Field


class IntentRequest(BaseModel):
    message: str = Field(min_length=1)

class IntentResponse(BaseModel):
    predicted_class : int
    intent: str
    confidence: float