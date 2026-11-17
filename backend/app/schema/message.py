from pydantic import BaseModel, Field


class MessageRequest(BaseModel):
    message: str = Field(min_length=1)

class EntitySpan(BaseModel):
    text: str
    label: str
    start: int
    end: int

class MessageResponse(BaseModel):
    predicted_class : int
    intent: str
    confidence: float
    entities: list[EntitySpan] = Field(default_factory=list)
