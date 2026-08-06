from sqlmodel import Session, create_engine, select

from app import crud
from app.core.config import settings
from app.models import User, UserCreate


def _create_db_engine():
    db_url = str(settings.SQLALCHEMY_DATABASE_URI)
    try:
        eng = create_engine(db_url)
        with eng.connect():
            pass
        return eng
    except Exception:
        # Fallback to local SQLite database if PostgreSQL server is unreachable
        return create_engine(
            "sqlite:///./local_apivault.db",
            connect_args={"check_same_thread": False},
        )


engine = _create_db_engine()


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly


def init_db(session: Session) -> None:
    from sqlmodel import SQLModel

    import app.models  # noqa

    # Create tables in PostgreSQL if they do not exist yet
    SQLModel.metadata.create_all(engine)

    user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        user = crud.create_user(session=session, user_create=user_in)
