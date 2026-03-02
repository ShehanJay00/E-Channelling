import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      className="bg-white border-end p-3"
      style={{ width: "230px" }}
    >
      <h5 className="mb-4 text-primary fw-bold">
        Smart eChanneling
      </h5>

      <ul className="list-unstyled">
        <li className="mb-3">
          <Link to="/" className="text-decoration-none text-dark">
            📊 Dashboard
          </Link>
        </li>

        <li className="mb-3">
          <Link to="/appointments" className="text-decoration-none text-dark">
            📅 Appointment
          </Link>
        </li>

        <li className="mb-3">
          <Link to="/doctors" className="text-decoration-none text-dark">
            👨‍⚕️ Add Doctor
          </Link>
        </li>


    <li className="mb-3">
     <Link to="/add-hospital" className="text-decoration-none text-dark">
    🏥 Add Hospital
       </Link>
      </li>

        <li className="mb-3">
          <Link to="/settings" className="text-decoration-none text-dark">
            ⚙️ Setting
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;