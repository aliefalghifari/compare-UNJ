from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from backend.app.models.model_loader import IntentModelLoader
from backend.services.intent_inference import IntentInference
from backend.app.router.intent import router as intent_router
from backend.services.entity_inference import EntityInference
from backend.app.models.entity_loader import EntityModelLoader
from backend.services.product_services import ProductService
from backend.app.handlers.base_handler import BaseHandler
from backend.app.handlers.product_handler import ProductHandler
from backend.response.response_builder import ResponseBuilder


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
    product_service = ProductService()
    product_handler = ProductHandler(product_service)
    handlers = {
        "product_inquiry":product_handler
    }
    app.state.base_handler = BaseHandler(handlers)
    response_builder = ResponseBuilder()
    app.state.response_builder = response_builder
    yield
    app.state.base_handler = None
    app.state.entity_inference = None
    app.state.intent_inference = None
    app.state.response_builder = None


app = FastAPI(lifespan=lifespan)

# Allow frontend (Next.js dev) to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(intent_router)
