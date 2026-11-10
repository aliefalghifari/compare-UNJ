from pydantic import BaseModel, Field


class MessageCreate(BaseModel):
    message: str = Field(
        min_length=1,
        description="Customer message"
    )

class MessageResponse(BaseModel):
    message : str
    status: str