import { useEffect, useState } from "react";
import axios from "axios";
const API = "http://localhost:5000/api/customers";

export default function CustomersPage() {
  const [rows, setRows] = useState([]);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ customer_code: "", customer_name: "", address: "", phone: "" });

  useEffect(() => { load(); }, []);
  async function load() {
    const r = await axios.get(API);
    setRows(r.data);
  }

  function openAdd() {
    setEditId(null);
    setForm({ customer_code: "", customer_name: "", address: "", phone: "" });
    setShow(true);
  }

  function openEdit(row) {
    setEditId(row.customer_id);
    setForm({
      customer_code: row.customer_code,
      customer_name: row.customer_name,
      address: row.address ?? "",
      phone: row.phone ?? "",
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
        <h2 className="m-0">จัดการข้อมูลลูกค้า</h2>
        <button className="btn btn-primary" onClick={openAdd}>เพิ่มลูกค้า</button>
      </div>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>รหัสลูกค้า</th>
            <th>ชื่อลูกค้า</th>
            <th>ที่อยู่</th>
            <th>เบอร์โทร</th>
            <th className="text-end">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.customer_id}>
              <td>{r.customer_code}</td>
              <td>{r.customer_name}</td>
              <td>{r.address}</td>
              <td>{r.phone}</td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEdit(r)}>แก้ไข</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => remove(r.customer_id)}>ลบ</button>
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
                      <div className="col-3">
                        <label className="form-label">รหัสลูกค้า</label>
                        <input className="form-control" value={form.customer_code}
                          onChange={e => setForm({ ...form, customer_code: e.target.value })} required />
                      </div>
                      <div className="col-5">
                        <label className="form-label">ชื่อลูกค้า</label>
                        <input className="form-control" value={form.customer_name}
                          onChange={e => setForm({ ...form, customer_name: e.target.value })} required />
                      </div>
                      <div className="col-4">
                        <label className="form-label">เบอร์โทร</label>
                        <input className="form-control" value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })} />
                      </div>
                      <div className="col-12">
                        <label className="form-label">ที่อยู่</label>
                        <input className="form-control" value={form.address}
                          onChange={e => setForm({ ...form, address: e.target.value })} />
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