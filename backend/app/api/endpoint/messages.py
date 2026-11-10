from fastapi import APIRouter, status
from app.schema.message import (MessageCreate, MessageResponse)

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_message(payload: MessageCreate):

    return MessageResponse(
        message=payload.message
    )