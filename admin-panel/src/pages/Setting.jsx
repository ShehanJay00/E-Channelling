import Layout from "./components/Layout";

const Settings = () => {
  return (
    <Layout>
      <div className="card shadow-sm p-4">
        <h5 className="fw-bold mb-4">System Settings</h5>

        <div className="d-flex justify-content-between align-items-center border-bottom py-3">
          <div>
            <strong>Email Notifications</strong>
            <div className="text-muted">Send email notifications to users</div>
          </div>
          <button className="btn btn-outline-secondary btn-sm">Configure</button>
        </div>

        <div className="d-flex justify-content-between align-items-center border-bottom py-3">
          <div>
            <strong>SMS Notifications</strong>
            <div className="text-muted">Send SMS reminders for appointments</div>
          </div>
          <button className="btn btn-outline-secondary btn-sm">Configure</button>
        </div>

        <div className="d-flex justify-content-between align-items-center border-bottom py-3">
          <div>
            <strong>Payment Gateway</strong>
            <div className="text-muted">Manage payment gateway settings</div>
          </div>
          <button className="btn btn-outline-secondary btn-sm">Configure</button>
        </div>

        <div className="d-flex justify-content-between align-items-center border-bottom py-3">
          <div>
            <strong>Booking Settings</strong>
            <div className="text-muted">Configure appointment booking rules</div>
          </div>
          <button className="btn btn-outline-secondary btn-sm">Configure</button>
        </div>

        <div className="d-flex justify-content-between align-items-center py-3">
          <div>
            <strong>System Maintenance</strong>
            <div className="text-muted">Database backup and maintenance</div>
          </div>
          <button className="btn btn-outline-secondary btn-sm">Configure</button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;