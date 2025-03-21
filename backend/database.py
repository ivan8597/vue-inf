from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import DeclarativeBase
from dotenv import load_dotenv
import os

# Загружаем переменные окружения
load_dotenv()

# Получаем URL базы данных из переменных окружения 
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/client_manager")

# Создаем движок SQLAlchemy
engine = create_engine(DATABASE_URL)

# Создаем базовый класс для моделей
class Base(DeclarativeBase):
    pass

# Создаем сессию
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Модели данных
class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    phone = Column(String)
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"))

class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    country = Column(String)
    street = Column(String)
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"))

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    balance = Column(Float, default=0.0)
    archived = Column(Boolean, default=False)
    
    # Связи
    contact = relationship("Contact", uselist=False, cascade="all, delete-orphan")
    address = relationship("Address", uselist=False, cascade="all, delete-orphan")

# Функция для получения сессии базы данных
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 