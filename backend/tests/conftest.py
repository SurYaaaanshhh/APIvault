import os
from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.engine import Engine
from sqlmodel import Session, SQLModel, create_engine, delete

import app.api.deps as deps_module
import app.core.db as db_module
from app.core.config import settings
from app.core.db import init_db
from app.main import app
from app.models import Item, User
from tests.utils.user import authentication_token_from_email
from tests.utils.utils import get_superuser_token_headers

TEST_DB_FILE = "./test_temp.db"


def _get_test_engine() -> Engine:
    try:
        conn = db_module.engine.connect()
        conn.close()
        return db_module.engine
    except Exception:
        if os.path.exists(TEST_DB_FILE):
            try:
                os.remove(TEST_DB_FILE)
            except Exception:
                pass
        test_engine = create_engine(
            f"sqlite:///{TEST_DB_FILE}",
            connect_args={"check_same_thread": False},
        )
        db_module.engine = test_engine
        deps_module.engine = test_engine  # type: ignore[attr-defined]
        return test_engine


test_db_engine = _get_test_engine()


@pytest.fixture(scope="session", autouse=True)
def db() -> Generator[Session]:
    SQLModel.metadata.create_all(test_db_engine)
    with Session(test_db_engine) as session:
        init_db(session)
        yield session
        statement = delete(Item)
        session.execute(statement)
        statement = delete(User)
        session.execute(statement)
        session.commit()
    if os.path.exists(TEST_DB_FILE):
        try:
            os.remove(TEST_DB_FILE)
        except Exception:
            pass


@pytest.fixture(scope="module")
def client(db: Session) -> Generator[TestClient]:
    def _override_get_db() -> Generator[Session]:
        yield db

    app.dependency_overrides[deps_module.get_db] = _override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture(scope="module")
def superuser_token_headers(client: TestClient) -> dict[str, str]:
    return get_superuser_token_headers(client)


@pytest.fixture(scope="module")
def normal_user_token_headers(client: TestClient, db: Session) -> dict[str, str]:
    return authentication_token_from_email(
        client=client, email=settings.EMAIL_TEST_USER, db=db
    )
