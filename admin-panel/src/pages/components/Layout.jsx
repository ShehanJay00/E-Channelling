import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <div className="p-4 bg-light">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;