import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import Logo from "../assets/logo.png";
import DefaultProfile from "../assets/doctor.jpg";
// Import useAuth hook to access logged-in user from AuthContext
import { useAuth } from "../context/useAuth";

function Navbar() {

  const navigate = useNavigate();
  // Get user & logout from AuthContext (backed by real backend auth)
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  // Handle logout - clears token and user from AuthContext and localStorage
  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <div className="navbar-container">
      <div className="row">

        <div className="col-md-3">
          <NavLink to="/">
            <img src={Logo} alt="logo" className="logo" />
          </NavLink>
        </div>

        <ul className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/hospitals">Hospitals</NavLink>
          <NavLink to="/symptomchecker">Symptom Checkers</NavLink>
          <NavLink to="/telemedicine">Telemedicine</NavLink>
          <NavLink to="/charity">Charity</NavLink>
        </ul>

        <div className="nav-buttons">
          {!user ? (
            <>
              <button onClick={() => navigate("/login")} className="login-btn">
                Login
              </button>
              <button onClick={() => navigate("/register")} className="register-btn">
                Register
              </button>
            </>
          ) : (
           <div className="profile-section" onClick={() => setShowDropdown(!showDropdown)}>
  <img
    src={user.profilePic ? `http://localhost:8080/uploads/${user.profilePic}` : DefaultProfile}
    alt="profile"
    className="profile-img"
  />

  <span className="dropdown-arrow">▼</span>

  {showDropdown && (
    <div className="dropdown-menu">
      <p><strong>{user.name}</strong></p>
      <p onClick={() => navigate("/myappoinment")}>
        My Appointments
      </p>
      <p onClick={() => navigate("/profile")}>
        My Profile
      </p>
      <p onClick={handleLogout} className="logout">
        Logout
      </p>
    </div>
  )}
</div> 
          )}
        </div>

      </div>
    </div>
  );
}

export default Navbar;