import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import api from "../api/axios";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users — GET /user/admin/all-users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/user/admin/all-users");
        setUsers(res.data.users || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Layout>
      <h4 className="mb-3">👥 All Users</h4>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="card shadow-sm">
          <div className="card-header fw-bold">
            Registered Users ({users.length})
          </div>
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-3 text-muted">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u, i) => (
                    <tr key={u._id}>
                      <td>{i + 1}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.role === "admin"
                              ? "bg-danger"
                              : u.role === "doctor"
                              ? "bg-primary"
                              : "bg-secondary"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AllUsers;