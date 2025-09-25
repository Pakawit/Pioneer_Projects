import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="container">
        <div className="collapse navbar-collapse show">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">สินค้า</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/customers">ลูกค้า</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/orders">คำสั่งขาย</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}