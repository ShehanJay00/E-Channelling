import Layout from "./components/Layout";


const Home = () => {
  return (
    <Layout>
      <div className="container-fluid">

        {/* Cards */}
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

        {/* Latest Booking */}
        <div className="card shadow-sm">
          <div className="card-header fw-bold">
            Latest booking
          </div>

          <div className="card-body">

            {[1,2,3,4].map((item, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center border-bottom py-2"
              >
                <div>
                  <strong>Dr. Michel</strong>
                  <div className="text-muted">
                    Booking on 5 October 2024
                  </div>
                </div>

                {index === 1 ? (
                  <span className="text-danger">Cancelled</span>
                ) : (
                  <span className="text-success">Completed</span>
                )}
              </div>
            ))}

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Home;