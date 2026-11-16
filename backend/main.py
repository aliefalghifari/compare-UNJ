from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.models.model_loader import IntentModelLoader

@asynccontextmanager
async def lifespan(app:FastAPI):
    loader = IntentModelLoader
    model,tokenizer=loader.load_intent_model()
    app.state.intent_model = model
    app.state.intent_tokenizer = tokenizer
    yield
    app.state.intent_model = None
    app.state.intent_tokenizer = None

app = FastAPI(lifespan=lifespan)