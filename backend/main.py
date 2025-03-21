from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional, Literal
import uvicorn
import logging
from database import get_db, Client as DBClient, Contact as DBContact, Address as DBAddress, Base, engine

# Создаем таблицы
Base.metadata.create_all(bind=engine)

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Включаем CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic модели
from pydantic import BaseModel

class ContactBase(BaseModel):
    email: str
    phone: str

class AddressBase(BaseModel):
    country: str
    street: str

class ClientBase(BaseModel):
    name: str
    contact: ContactBase
    balance: float
    archived: bool = False
    address: AddressBase

class Client(ClientBase):
    id: Optional[int] = None

    model_config = {
        "from_attributes": True
    }

# API endpoints
@app.get("/api/clients", response_model=List[Client])
async def get_clients(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    sort_by: Optional[Literal["name", "balance"]] = None,
    sort_order: Optional[Literal["asc", "desc"]] = "asc",
    archived: Optional[str] = None
):
    logger.info(f"Получен GET запрос на /api/clients с параметрами: search={search}, sort_by={sort_by}, sort_order={sort_order}, archived={archived}")
    
    query = db.query(DBClient)

    # Фильтрация по статусу архивации
    if archived is not None:
        is_archived = archived.lower() == 'true'
        query = query.filter(DBClient.archived == is_archived)

    # Поиск
    if search:
        search = search.lower()
        query = query.filter(
            (DBClient.name.ilike(f"%{search}%")) |
            (DBClient.contact.has(DBContact.email.ilike(f"%{search}%"))) |
            (DBClient.contact.has(DBContact.phone.ilike(f"%{search}%")))
        )

    # Сортировка
    if sort_by:
        if sort_by == "name":
            query = query.order_by(DBClient.name.desc() if sort_order == "desc" else DBClient.name)
        elif sort_by == "balance":
            query = query.order_by(DBClient.balance.desc() if sort_order == "desc" else DBClient.balance)

    return query.all()

@app.post("/api/clients", response_model=Client)
async def create_client(client: ClientBase, db: Session = Depends(get_db)):
    logger.info(f"Получен POST запрос на /api/clients с данными: {client}")
    
    db_client = DBClient(
        name=client.name,
        balance=client.balance,
        archived=client.archived
    )
    
    db_contact = DBContact(
        email=client.contact.email,
        phone=client.contact.phone
    )
    
    db_address = DBAddress(
        country=client.address.country,
        street=client.address.street
    )
    
    db_client.contact = db_contact
    db_client.address = db_address
    
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    
    return db_client

@app.put("/api/clients/{client_id}", response_model=Client)
async def update_client(client_id: int, client: ClientBase, db: Session = Depends(get_db)):
    logger.info(f"Получен PUT запрос на /api/clients/{client_id} с данными: {client}")
    
    db_client = db.query(DBClient).filter(DBClient.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Обновляем данные клиента
    db_client.name = client.name
    db_client.balance = client.balance
    db_client.archived = client.archived
    
    # Обновляем контактные данные
    db_client.contact.email = client.contact.email
    db_client.contact.phone = client.contact.phone
    
    # Обновляем адрес
    db_client.address.country = client.address.country
    db_client.address.street = client.address.street
    
    db.commit()
    db.refresh(db_client)
    
    return db_client

@app.get("/api/clients/{client_id}", response_model=Client)
async def get_client(client_id: int, db: Session = Depends(get_db)):
    logger.info(f"Получен GET запрос на /api/clients/{client_id}")
    
    db_client = db.query(DBClient).filter(DBClient.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    return db_client

@app.delete("/api/clients/{client_id}")
async def delete_client(client_id: int, db: Session = Depends(get_db)):
    logger.info(f"Получен DELETE запрос на /api/clients/{client_id}")
    
    db_client = db.query(DBClient).filter(DBClient.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    db.delete(db_client)
    db.commit()
    
    return {"message": "Client deleted"}

if __name__ == "__main__":
    logger.info("Запуск сервера на http://0.0.0.0:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info") 