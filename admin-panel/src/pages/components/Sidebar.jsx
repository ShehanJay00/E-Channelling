import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  // Helper to highlight active link
  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `text-decoration-none d-block px-2 py-1 rounded ${
      isActive(path) ? "bg-dark text-white" : "text-dark"
    }`;

  return (
    <div
      className="bg-white border-end p-3"
      style={{ width: "230px", minHeight: "100vh" }}
    >
      <h5 className="mb-4 text-primary fw-bold">Smart eChanneling</h5>

      <ul className="list-unstyled">
        <li className="mb-3">
          <Link to="/" className={linkClass("/")}>
            📊 Dashboard
          </Link>
        </li>

        <li className="mb-3">
          <Link to="/appointments" className={linkClass("/appointments")}>
            📅 Appointments
          </Link>
        </li>

        <li className="mb-3">
          <Link to="/doctors" className={linkClass("/doctors")}>
            👨‍⚕️ Doctors
          </Link>
        </li>

        <li className="mb-3">
          <Link to="/add-hospital" className={linkClass("/add-hospital")}>
            🏥 Hospitals
          </Link>
        </li>

        <li className="mb-3">
          <Link to="/users" className={linkClass("/users")}>
            👥 Users
          </Link>
        </li>

        <li className="mb-3">
          <Link to="/settings" className={linkClass("/settings")}>
            ⚙️ Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;