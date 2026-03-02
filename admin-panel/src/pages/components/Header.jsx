const Header = () => {
  return (
    <div className="d-flex justify-content-between align-items-center bg-white p-3 border-bottom">
      <span className="badge bg-light text-dark">Admin</span>

      <button
        className="btn btn-dark btn-sm"
        onClick={() => {
          localStorage.removeItem("adminToken");
          window.location.reload();
        }}
      >
        Log out
      </button>
    </div>
  );
};

export default Header;