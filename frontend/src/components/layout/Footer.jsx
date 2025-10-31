import React, { PureComponent } from 'react';

export default class Footer extends PureComponent {
  render() {
    return (
      <footer className="bg-dark text-light text-center py-3 mt-auto shadow-sm">
        <div className="container">
          <p className="mb-0 small">
            © 2025 <strong>Visitor Management System</strong> — All rights reserved.
          </p>
        </div>
      </footer>
    );
  }
}
