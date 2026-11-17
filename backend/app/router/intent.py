from fastapi import APIRouter,Request
from backend.app.schema.message import MessageRequest,MessageResponse

router = APIRouter(prefix="/intent",tags=["Intent"])

@router.post("/predict",response_model=MessageResponse)
async def predict_intent(payload:MessageRequest,request:Request):
    intent = request.app.state.intent_inference
    entity = request.app.state.entity_inference
    intent_result = intent.predict(payload.message)
    entity_result = entity.predict(payload.message)
    return {
    **intent_result,
    "entities": entity_result["entities"]
}