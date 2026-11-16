from fastapi import APIRouter,Request

router = APIRouter(prefix="/intent",tags=["Intent"])

@router.post("/predict")
async def predict_intent(request:Request):
    model = request.app.state.intent_model
    tokenizer = request.app.state.intent_tokenizer