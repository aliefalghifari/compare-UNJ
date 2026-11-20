from fastapi import APIRouter,Request
from backend.app.schema.message import MessageRequest,MessageResponse

router = APIRouter(prefix="/intent",tags=["Intent"])

@router.post("/predict",response_model=MessageResponse)
async def predict_intent(payload:MessageRequest,request:Request):
    intent = request.app.state.intent_inference
    entity = request.app.state.entity_inference
    base_handler = request.app.state.base_handler
    response_builder = request.app.state.response_builder
    intent_result = intent.predict(payload.message)
    entity_result = entity.predict(payload.message)
    handler_result = base_handler.process(intent_result=intent_result,entities=entity_result["entities"])
    response_result = response_builder.build(handler_result)
    return {
    **intent_result,
    "session_id": payload.session_id,
    "entities": entity_result["entities"],
    "handler_results":handler_result,
    "draft_response":response_result["draft_response"]
}