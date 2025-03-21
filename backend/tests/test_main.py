import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from database import Base
from main import app, get_db

# Создаем тестовую базу данных в памяти
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Создаем таблицы в тестовой базе данных
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Подменяем зависимость базы данных на тестовую
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# Тестовые данные
test_client_data = {
    "name": "Test Client",
    "contact": {
        "email": "test@example.com",
        "phone": "+1234567890"
    },
    "balance": 1000.0,
    "archived": False,
    "address": {
        "country": "Test Country",
        "street": "Test Street"
    }
}

def test_create_client():
    response = client.post("/api/clients", json=test_client_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == test_client_data["name"]
    assert data["contact"]["email"] == test_client_data["contact"]["email"]
    assert data["balance"] == test_client_data["balance"]
    assert "id" in data

def test_get_clients():
    # Создаем тестового клиента
    client.post("/api/clients", json=test_client_data)
    
    response = client.get("/api/clients")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert isinstance(data, list)

def test_get_clients_with_search():
    response = client.get("/api/clients?search=test")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert all("test" in client["name"].lower() or 
              "test" in client["contact"]["email"].lower() or 
              "test" in client["contact"]["phone"].lower() 
              for client in data)

def test_get_clients_with_sort():
    # Создаем второго клиента для сортировки
    second_client = test_client_data.copy()
    second_client["name"] = "AAA Test Client"
    client.post("/api/clients", json=second_client)

    # Тестируем сортировку по имени
    response = client.get("/api/clients?sort_by=name&sort_order=asc")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    assert data[0]["name"] < data[1]["name"]

def test_get_archived_clients():
    # Создаем архивного клиента
    archived_client = test_client_data.copy()
    archived_client["archived"] = True
    client.post("/api/clients", json=archived_client)

    # Получаем только архивных клиентов
    response = client.get("/api/clients?archived=true")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert all(client["archived"] for client in data)

def test_update_client():
    # Создаем клиента
    create_response = client.post("/api/clients", json=test_client_data)
    client_id = create_response.json()["id"]

    # Обновляем данные
    updated_data = test_client_data.copy()
    updated_data["name"] = "Updated Name"
    response = client.put(f"/api/clients/{client_id}", json=updated_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"

def test_archive_client():
    # Создаем клиента
    create_response = client.post("/api/clients", json=test_client_data)
    client_id = create_response.json()["id"]

    # Архивируем клиента
    archived_data = test_client_data.copy()
    archived_data["archived"] = True
    response = client.put(f"/api/clients/{client_id}", json=archived_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["archived"] == True

def test_delete_client():
    # Создаем клиента
    create_response = client.post("/api/clients", json=test_client_data)
    client_id = create_response.json()["id"]

    # Удаляем клиента
    response = client.delete(f"/api/clients/{client_id}")
    assert response.status_code == 200

    # Проверяем, что клиент удален
    get_response = client.get(f"/api/clients/{client_id}")
    assert get_response.status_code == 404 