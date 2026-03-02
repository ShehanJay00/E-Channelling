import Layout from "./components/Layout";

const AddHospital = () => {
  return (
    <Layout>
      <div className="card shadow-sm p-4" style={{ maxWidth: "600px" }}>
        <h5 className="mb-3 fw-bold">Add Hospital</h5>

        <div className="mb-3 text-center">
          <div
            className="rounded bg-light d-flex justify-content-center align-items-center"
            style={{ width: "100px", height: "80px", margin: "auto" }}
          >
            🏥
          </div>
          <small className="text-muted d-block mt-2">
            Upload hospital picture
          </small>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <input type="text" className="form-control" placeholder="Hospital Name" />
          </div>

          <div className="col-md-6 mb-3">
            <input type="text" className="form-control" placeholder="Address" />
          </div>

          <div className="col-md-6 mb-3">
            <input type="text" className="form-control" placeholder="City" />
          </div>

          <div className="col-md-6 mb-3">
            <input type="text" className="form-control" placeholder="Phone" />
          </div>

          <div className="col-md-6 mb-3">
            <input type="email" className="form-control" placeholder="Email" />
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-light border">Cancel</button>
          <button className="btn btn-dark">Add hospital</button>
        </div>
      </div>
    </Layout>
  );
};

export default AddHospital;