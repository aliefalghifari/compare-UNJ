from fastapi import FastAPI
from contextlib import asynccontextmanager
from backend.app.models.model_loader import IntentModelLoader
from backend.services.intent_inference import IntentInference
from backend.app.router.intent import router as intent_router
from backend.services.entity_inference import EntityInference
from backend.app.models.entity_loader import EntityModelLoader


@asynccontextmanager
async def lifespan(app: FastAPI):
    intent_loader = IntentModelLoader()
    model, tokenizer = intent_loader.load_intent_model()
    inference = IntentInference(model=model, tokenizer=tokenizer, device=intent_loader.device)
    app.state.intent_inference = inference
    entity_loader = EntityModelLoader()
    entity_model, entity_tokenizer = entity_loader.load_entity_model()
    entity_inference = EntityInference(model=entity_model, tokenizer=entity_tokenizer, device=entity_loader.device)
    app.state.entity_inference = entity_inference


    yield
    app.state.entity_inference = None
    app.state.intent_inference = None


app = FastAPI(lifespan=lifespan)
app.include_router(intent_router)
