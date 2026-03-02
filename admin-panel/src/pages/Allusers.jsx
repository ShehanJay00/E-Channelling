import Layout from "./components/Layout";

const Home = () => {
  return (
    <Layout>
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm text-center p-3">
              <h3>15</h3>
              <p className="text-muted">Doctors</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm text-center p-3">
              <h3>6</h3>
              <p className="text-muted">Appointments</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm text-center p-3">
              <h3>3</h3>
              <p className="text-muted">Patients</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;