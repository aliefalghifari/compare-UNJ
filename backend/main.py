from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from backend.services.inference_services import InferenceService
from backend.response.response_builder import ResponseBuilder
from backend.app.handlers.product_handler import ProductHandler
from backend.services.product_services import ProductService
from backend.app.handlers.base_handler import BaseHandler
from backend.app.router.intent import router as intent_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.inference_services = InferenceService()

    product_service = ProductService()
    product_handler = ProductHandler(product_service)

    handlers = {
        "product_inquiry": product_handler
    }

    app.state.base_handler = BaseHandler(handlers)
    app.state.response_builder = ResponseBuilder()

    yield

    app.state.inference_services = None
    app.state.base_handler = None
    app.state.response_builder = None


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://compare-unj.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(intent_router)