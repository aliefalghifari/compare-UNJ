from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.models.model_loader import IntentModelLoader
from services.inference_service import IntentInference
from app.router.intent import router as intent_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    loader = IntentModelLoader()

    model, tokenizer = loader.load_intent_model()

    inference = IntentInference(model=model, tokenizer=tokenizer, device=loader.device)
    app.state.intent_inference = inference

    yield

    app.state.intent_inference = None


app = FastAPI(lifespan=lifespan)
app.include_router(intent_router)
