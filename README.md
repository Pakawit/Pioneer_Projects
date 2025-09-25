โปรเจกต์นี้เป็น **ระบบจัดการคำสั่งขาย (Sales Order)**  
ประกอบด้วย 2 ส่วนหลัก:
- **Backend** (Node.js + Express + MySQL)
- **Frontend** (React + Bootstrap)

---

## 📦 การติดตั้งและรันโปรเจกต์

1) Clone โปรเจกต์

2) สร้าง database mysql
  CREATE DATABASE database_pioneer;
  USE database_pioneer;

-สร้างตารางสินค้า (products)
CREATE TABLE products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  product_code VARCHAR(50) NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);

สร้างตารางลูกค้า (customers)
CREATE TABLE customers (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_code VARCHAR(50) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  address VARCHAR(255),
  phone VARCHAR(20)
);

สร้างตารางคำสั่งขาย (sales_orders)
CREATE TABLE sales_orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL,
  order_date DATE NOT NULL,
  customer_code VARCHAR(50) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_address VARCHAR(255),
  customer_phone VARCHAR(20),
  product_code VARCHAR(50) NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  unit VARCHAR(20) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL
);


3) ติดตั้งและรัน Backend
- cd backend
- npm install
- node server.js

3) ติดตั้งและรัน Frontend
- cd frontend
- npm install
- npm start
