const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",      
  password: "",      
  database: "database_pioneer",
  port: 3306         
});

db.connect(err => {
  if (err) {
    console.error("DB connection error:", err.message);
  } else {
    console.log("Connected to MySQL");
  }
});

// ---------- PRODUCTS ----------
app.get("/api/products", (req, res) => {
  db.query(
    "SELECT product_id, product_code, product_name, unit, unit_price FROM products ORDER BY product_id DESC",
    (err, rows) => err ? res.status(500).json({ error: err.message }) : res.json(rows)
  );
});

app.post("/api/products", (req, res) => {
  const { product_code, product_name, unit, unit_price } = req.body;
  db.query(
    "INSERT INTO products (product_code, product_name, unit, unit_price) VALUES (?,?,?,?)",
    [product_code, product_name, unit, unit_price],
    (err, r) => err
      ? res.status(500).json({ error: err.message })
      : res.json({ product_id: r.insertId, product_code, product_name, unit, unit_price })
  );
});

app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const { product_code, product_name, unit, unit_price } = req.body;
  db.query(
    "UPDATE products SET product_code=?, product_name=?, unit=?, unit_price=? WHERE product_id=?",
    [product_code, product_name, unit, unit_price, id],
    (err, r) => err
      ? res.status(500).json({ error: err.message })
      : res.json({ affectedRows: r.affectedRows })
  );
});

app.delete("/api/products/:id", (req, res) => {
  db.query(
    "DELETE FROM products WHERE product_id=?",
    [req.params.id],
    (err, r) => err
      ? res.status(500).json({ error: err.message })
      : res.json({ affectedRows: r.affectedRows })
  );
});

// ---------- CUSTOMERS ----------
app.get("/api/customers", (req, res) => {
  db.query(
    "SELECT customer_id, customer_code, customer_name, address, phone FROM customers ORDER BY customer_id DESC",
    (err, rows) => err ? res.status(500).json({ error: err.message }) : res.json(rows)
  );
});

app.post("/api/customers", (req, res) => {
  const { customer_code, customer_name, address, phone } = req.body;
  db.query(
    "INSERT INTO customers (customer_code, customer_name, address, phone) VALUES (?,?,?,?)",
    [customer_code, customer_name, address ?? null, phone ?? null],
    (err, r) => err
      ? res.status(500).json({ error: err.message })
      : res.json({ customer_id: r.insertId, customer_code, customer_name, address, phone })
  );
});

app.put("/api/customers/:id", (req, res) => {
  const { id } = req.params;
  const { customer_code, customer_name, address, phone } = req.body;
  db.query(
    "UPDATE customers SET customer_code=?, customer_name=?, address=?, phone=? WHERE customer_id=?",
    [customer_code, customer_name, address ?? null, phone ?? null, id],
    (err, r) => err
      ? res.status(500).json({ error: err.message })
      : res.json({ affectedRows: r.affectedRows })
  );
});

app.delete("/api/customers/:id", (req, res) => {
  db.query(
    "DELETE FROM customers WHERE customer_id=?",
    [req.params.id],
    (err, r) => err
      ? res.status(500).json({ error: err.message })
      : res.json({ affectedRows: r.affectedRows })
  );
});

// ---------- SALES ORDERS ----------
app.get("/api/orders", (req, res) => {
  db.query("SELECT * FROM sales_orders ORDER BY order_id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/orders", (req, res) => {
  const {
    order_number, order_date,
    customer_code, customer_name, customer_address, customer_phone,
    product_code, product_name, quantity, unit, unit_price
  } = req.body;

  const total = Number(quantity) * Number(unit_price);

  db.query(
    `INSERT INTO sales_orders
     (order_number, order_date, customer_code, customer_name, customer_address, customer_phone,
      product_code, product_name, quantity, unit, unit_price, total)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [order_number, order_date, customer_code, customer_name, customer_address, customer_phone,
     product_code, product_name, quantity, unit, unit_price, total],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ order_id: result.insertId, total });
    }
  );
});

app.put("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const {
    order_number, order_date,
    customer_code, customer_name, customer_address, customer_phone,
    product_code, product_name, quantity, unit, unit_price
  } = req.body;

  const total = Number(quantity) * Number(unit_price);

  db.query(
    `UPDATE sales_orders SET
       order_number=?, order_date=?, customer_code=?, customer_name=?, customer_address=?, customer_phone=?,
       product_code=?, product_name=?, quantity=?, unit=?, unit_price=?, total=?
     WHERE order_id=?`,
    [order_number, order_date, customer_code, customer_name, customer_address, customer_phone,
     product_code, product_name, quantity, unit, unit_price, total, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, affected: result.affectedRows });
    }
  );
});

app.delete("/api/orders/:id", (req, res) => {
  db.query("DELETE FROM sales_orders WHERE order_id=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, affected: result.affectedRows });
  });
});



app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
