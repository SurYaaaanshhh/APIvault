import logging
import time
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI
from fastapi.routing import APIRoute
from sqlmodel import Session, SQLModel
from starlette.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.core.config import settings
from app.core.db import engine, init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None]:
    for attempt in range(1, 6):
        try:
            SQLModel.metadata.create_all(engine)
            with Session(engine) as session:
                init_db(session)
            logger.info(
                "Database tables and initial data successfully verified/created."
            )
            break
        except Exception as e:
            logger.warning(f"Database connection attempt {attempt}/5 failed: {e}")
            if attempt < 5:
                time.sleep(2)
            else:
                logger.error("Failed to initialize database tables after 5 attempts.")
    yield


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
    lifespan=lifespan,
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)
