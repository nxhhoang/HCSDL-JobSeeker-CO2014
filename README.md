# Project Setup Guide

Dự án gồm 3 thư mục chính:

- `backend/`
- `database/`
- `frontend/`

Tài liệu này hướng dẫn cách khởi chạy toàn bộ hệ thống.

---

## Yêu cầu trước khi chạy

Bạn cần cài đặt:

- Docker & Docker Compose
- Node.js (>= 18)
- Yarn  
  (nếu chưa có: `npm install -g yarn`)

---

## 1. Khởi chạy Backend và Database bằng Docker

Đi vào thư mục chứa file `docker-compose.yaml`:

Đối với database
```bash
cd database
docker compose up -d --build
```

Đối với backend
```bash
cd backend
docker compose up -d --build
``` 
## 2. Khởi chạy Frontend
Mở một terminal mới và chạy:
```bash
cd frontend
yarn
yarn dev
```
Frontend mặc định chạy tại:
````bash
http://localhost:3000
````

## 3. Kết thúc dự án
Đối với database
```bash
cd database
docker compose down -v 
```

Đối với backend
```bash
cd backend
docker compose down -v 
``` 
