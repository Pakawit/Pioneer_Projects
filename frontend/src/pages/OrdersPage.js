import { useEffect, useState } from "react";
import axios from "axios";

const API = {
  CUS: "http://localhost:5000/api/customers",
  PRO: "http://localhost:5000/api/products",
  ORD: "http://localhost:5000/api/orders",
};

export default function OrdersPage() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);

  const emptyHead = {
    order_number: "",
    order_date: new Date().toISOString().slice(0, 10),
    customer_code: "",
    customer_name: "",
    customer_address: "",
    customer_phone: "",
  };
  const [head, setHead] = useState(emptyHead);

  const [items, setItems] = useState([{ product_code: "", quantity: 1 }]);

  useEffect(() => {
    (async () => {
      const [c, p, o] = await Promise.all([
        axios.get(API.CUS),
        axios.get(API.PRO),
        axios.get(API.ORD),
      ]);
      setCustomers(c.data);
      setProducts(p.data);
      setOrders(o.data);
    })();
  }, []);

  const findCus = (code) => customers.find((x) => x.customer_code === code);
  const findPro = (code) => products.find((x) => x.product_code === code);
  const money = (n) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const sumTotal = items.reduce((s, it) => {
    const p = findPro(it.product_code);
    return s + Number(it.quantity || 0) * Number(p?.unit_price || 0);
  }, 0);

  function pickCustomer(code) {
    const c = findCus(code);
    if (!c) return;
    setHead({
      ...head,
      customer_code: c.customer_code,
      customer_name: c.customer_name,
      customer_address: c.address || "",
      customer_phone: c.phone || "",
    });
  }

  function openAdd() {
    setEditId(null);
    setHead({ ...emptyHead });
    setItems([{ product_code: "", quantity: 1 }]);
    setShow(true);
  }

  function openEdit(row) {
    setEditId(row.order_id);
    setHead({
      order_number: row.order_number || "",
      order_date: row.order_date?.slice(0, 10) || emptyHead.order_date,
      customer_code: row.customer_code || "",
      customer_name: row.customer_name || "",
      customer_address: row.customer_address || "",
      customer_phone: row.customer_phone || "",
    });
    setItems([{ product_code: row.product_code || "", quantity: Number(row.quantity || 1) }]);
    setShow(true);
  }

  const setItemCode = (i, code) =>
    setItems((a) => {
      const b = [...a];
      b[i] = { ...b[i], product_code: code };
      return b;
    });
  const setItemQty = (i, q) =>
    setItems((a) => {
      const b = [...a];
      b[i] = { ...b[i], quantity: Number(q || 0) };
      return b;
    });
  const addRow = () => setItems((a) => [...a, { product_code: "", quantity: 1 }]);
  const removeRow = (i) => setItems((a) => a.filter((_, idx) => idx !== i));

  async function save(e) {
    e.preventDefault();
    if (!head.order_number || !head.customer_code) return;

    if (editId == null) {
      for (const it of items) {
        const p = findPro(it.product_code);
        if (!p || it.quantity <= 0) continue;
        await axios.post(API.ORD, {
          order_number: head.order_number,
          order_date: head.order_date,
          customer_code: head.customer_code,
          customer_name: head.customer_name,
          customer_address: head.customer_address,
          customer_phone: head.customer_phone,
          product_code: p.product_code,
          product_name: p.product_name,
          quantity: it.quantity,
          unit: p.unit,
          unit_price: p.unit_price,
          total: Number(it.quantity) * Number(p.unit_price),
        });
      }
    } else {
      const it = items[0];
      const p = findPro(it.product_code);
      if (p) {
        await axios.put(`${API.ORD}/${editId}`, {
          order_number: head.order_number,
          order_date: head.order_date,
          customer_code: head.customer_code,
          customer_name: head.customer_name,
          customer_address: head.customer_address,
          customer_phone: head.customer_phone,
          product_code: p.product_code,
          product_name: p.product_name,
          quantity: it.quantity,
          unit: p.unit,
          unit_price: p.unit_price,
          total: Number(it.quantity) * Number(p.unit_price),
        });
      }
      setEditId(null);
    }

    setShow(false);
    const o = await axios.get(API.ORD);
    setOrders(o.data);
  }

  async function removeOrder(id) {
    await axios.delete(`${API.ORD}/${id}`);
    const o = await axios.get(API.ORD);
    setOrders(o.data);
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="m-0">จัดการ Sales Orders</h2>
        <button className="btn btn-primary" onClick={openAdd}>เพิ่มคำสั่งขาย</button>
      </div>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>เลขที่เอกสาร</th>
            <th>วันที่เอกสาร</th>
            <th>ลูกค้า</th>
            <th>สินค้า</th>
            <th className="text-end">จำนวน</th>
            <th className="text-end">ยอดรวม</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.order_id}>
              <td>{o.order_number}</td>
              <td>{o.order_date?.slice(0, 10)}</td>
              <td>{o.customer_name}</td>
              <td>{o.product_name}</td>
              <td className="text-end">{o.quantity}</td>
              <td className="text-end">{money(o.total)}</td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEdit(o)}>แก้ไข</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => removeOrder(o.order_id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {show && (
        <>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content">
                <form onSubmit={save}>
                  <div className="modal-header">
                    <h5 className="modal-title">{editId == null ? "สร้างคำสั่งขาย" : "แก้ไขคำสั่งขาย"}</h5>
                    <button type="button" className="btn-close" onClick={() => { setShow(false); setEditId(null); }} />
                  </div>

                  <div className="modal-body">
                    <div className="row g-2">
                      <div className="col-3">
                        <label className="form-label">เลขที่เอกสาร</label>
                        <input className="form-control" value={head.order_number} onChange={(e) => setHead({ ...head, order_number: e.target.value })} />
                      </div>
                      <div className="col-3">
                        <label className="form-label">วันที่เอกสาร</label>
                        <input type="date" className="form-control" value={head.order_date} onChange={(e) => setHead({ ...head, order_date: e.target.value })} />
                      </div>
                      <div className="col-6">
                        <label className="form-label">ลูกค้า</label>
                        <select className="form-select" value={head.customer_code} onChange={(e) => pickCustomer(e.target.value)}>
                          <option value="">-- เลือกลูกค้า --</option>
                          {customers.map((c) => (
                            <option key={c.customer_id} value={c.customer_code}>
                              {c.customer_code} - {c.customer_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label">ที่อยู่ลูกค้า</label>
                        <input className="form-control" value={head.customer_address} onChange={(e) => setHead({ ...head, customer_address: e.target.value })} />
                      </div>
                      <div className="col-3">
                        <label className="form-label">เบอร์โทรติดต่อ</label>
                        <input className="form-control" value={head.customer_phone} onChange={(e) => setHead({ ...head, customer_phone: e.target.value })} />
                      </div>
                    </div>

                    <hr className="my-3" />

                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="m-0">รายการสินค้า</h5>
                      {editId == null && (
                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={addRow}>+ เพิ่มรายการ</button>
                      )}
                    </div>

                    <table className="table table-sm table-bordered mt-2">
                      <thead>
                        <tr>
                          <th style={{ width: "36%" }}>สินค้า</th>
                          <th style={{ width: 90 }}>จำนวน</th>
                          <th className="text-end" style={{ width: 140 }}>ราคาขาย/หน่วย</th>
                          <th className="text-end" style={{ width: 140 }}>ยอดเงิน</th>
                          {editId == null && <th style={{ width: 70 }}></th>}
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((it, i) => {
                          const p = findPro(it.product_code);
                          const lineTotal = Number(it.quantity || 0) * Number(p?.unit_price || 0);
                          return (
                            <tr key={i}>
                              <td>
                                <select className="form-select" value={it.product_code} onChange={(e) => setItemCode(i, e.target.value)}>
                                  <option value="">-- เลือกสินค้า --</option>
                                  {products.map((x) => (
                                    <option key={x.product_id} value={x.product_code}>
                                      {x.product_code} - {x.product_name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <input type="number" min="1" className="form-control" value={it.quantity} onChange={(e) => setItemQty(i, e.target.value)} />
                              </td>
                              <td className="text-end">{money(p?.unit_price)}</td>
                              <td className="text-end">{money(lineTotal)}</td>
                              {editId == null && (
                                <td className="text-center">
                                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeRow(i)}>ลบ</button>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div className="text-end fw-bold">ยอดเงินรวม: {money(sumTotal)}</div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-light" onClick={() => { setShow(false); setEditId(null); }}>ยกเลิก</button>
                    <button type="submit" className="btn btn-primary">{editId == null ? "บันทึก" : "บันทึกการแก้ไข"}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </>
  );
}