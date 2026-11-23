from fastapi import APIRouter,Request
from app.schema.message import MessageRequest,MessageResponse

router = APIRouter(prefix="/intent",tags=["Intent"])

@router.post("/predict",response_model=MessageResponse)
async def predict_intent(payload:MessageRequest,request:Request):
    inference_services = request.app.state.inference_services
    base_handler = request.app.state.base_handler
    response_builder = request.app.state.response_builder
    inference_result = await inference_services.predict(payload.message)
    intent_result = inference_result["intent"]
    entity_result = inference_result["entity"]
    intents = intent_result["intents"]
    entities = entity_result["entities"]
    handler_result = base_handler.process(intent_result=intent_result,entities=entities)
    response_result = response_builder.build(handler_result)
    return {
    "intents": intents,
    "session_id": payload.session_id,
    "entities": entities,
    "handler_results":handler_result,
    "draft_response":response_result["draft_response"]
}
