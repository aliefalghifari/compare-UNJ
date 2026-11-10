from fastapi import APIRouter

router = APIRouter()

@router.get("/messages")
def get_messages():
    return {"messages":"the API is working"}