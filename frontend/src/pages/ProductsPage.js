import { useEffect, useState } from "react";
import axios from "axios";
const API = "http://localhost:5000/api/products";

export default function ProductsPage() {
  const [rows, setRows] = useState([]);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ product_code: "", product_name: "", unit: "", unit_price: "" });

  useEffect(() => { load(); }, []);
  async function load() {
    const r = await axios.get(API);
    setRows(r.data);
  }

  function openAdd() {
    setEditId(null);
    setForm({ product_code: "", product_name: "", unit: "", unit_price: "" });
    setShow(true);
  }

  function openEdit(row) {
    setEditId(row.product_id);
    setForm({ 
      product_code: row.product_code,
      product_name: row.product_name,
      unit: row.unit,
      unit_price: row.unit_price 
    });
    setShow(true);
  }

  async function save(e) {
    e.preventDefault();
    if (editId == null) {
      await axios.post(API, form);
    } else {
      await axios.put(`${API}/${editId}`, form);
    }
    setShow(false);
    setEditId(null);
    await load();
  }

  async function remove(id) {
    await axios.delete(`${API}/${id}`);
    await load();
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="m-0">จัดการข้อมูลสินค้า</h2>
        <button className="btn btn-primary" onClick={openAdd}>เพิ่มสินค้า</button>
      </div>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>รหัสสินค้า</th>
            <th>ชื่อสินค้า</th>
            <th>หน่วยนับ</th>
            <th className="text-end">ราคาขาย/หน่วย</th>
            <th className="text-end">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.product_id}>
              <td>{r.product_code}</td>
              <td>{r.product_name}</td>
              <td>{r.unit}</td>
              <td className="text-end">
                {Number(r.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEdit(r)}>แก้ไข</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => remove(r.product_id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {show && (
        <>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <form onSubmit={save}>
                  <div className="modal-header">
                    <button type="button" className="btn-close" onClick={() => setShow(false)} />
                  </div>
                  <div className="modal-body">
                    <div className="row g-2">
                      <div className="col-4">
                        <label className="form-label">รหัส</label>
                        <input className="form-control" value={form.product_code}
                          onChange={(e) => setForm({ ...form, product_code: e.target.value })} required />
                      </div>
                      <div className="col-8">
                        <label className="form-label">ชื่อ</label>
                        <input className="form-control" value={form.product_name}
                          onChange={(e) => setForm({ ...form, product_name: e.target.value })} required />
                      </div>
                      <div className="col-4">
                        <label className="form-label">หน่วยนับ</label>
                        <input className="form-control" value={form.unit}
                          onChange={(e) => setForm({ ...form, unit: e.target.value })} required />
                      </div>
                      <div className="col-8">
                        <label className="form-label">ราคา/หน่วย</label>
                        <input type="number" className="form-control" value={form.unit_price}
                          onChange={(e) => setForm({ ...form, unit_price: e.target.value })} required />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light" onClick={() => setShow(false)}>ยกเลิก</button>
                    <button type="submit" className="btn btn-primary">บันทึก</button>
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