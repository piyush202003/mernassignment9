import React from 'react';

const HomePage = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">
          Welcome to the Visitor Management System
        </h1>
        <p className="lead text-muted">
          Streamline visitor check-ins, enhance security, and simplify record management.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-person-check display-4 text-primary mb-3"></i>
              <h5 className="card-title">Easy Check-in</h5>
              <p className="card-text text-muted">
                Quick and hassle-free visitor registration process easy to access.
              </p>
              <button className="btn btn-outline-primary">Learn More</button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-shield-lock display-4 text-success mb-3"></i>
              <h5 className="card-title">Enhanced Security</h5>
              <p className="card-text text-muted">
                Keep your premises safe with real-time monitoring and logs.
              </p>
              <button className="btn btn-outline-success">View Details</button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-graph-up display-4 text-warning mb-3"></i>
              <h5 className="card-title">Analytics</h5>
              <p className="card-text text-muted">
                Gain insights from visitor trends and analytics reports.
              </p>
              <button className="btn btn-outline-warning">Explore</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
