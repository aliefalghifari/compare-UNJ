from fastapi import APIRouter,Request
from backend.app.schema.message import IntentRequest,IntentResponse

router = APIRouter(prefix="/intent",tags=["Intent"])

@router.post("/predict",response_model=IntentResponse)
async def predict_intent(payload:IntentRequest,request:Request):
    inference = request.app.state.intent_inference
    result = inference.predict(payload.message)
    return result