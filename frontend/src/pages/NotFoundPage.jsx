import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="not-found-container">
      <div className="not-found-card card">
        <div className="not-found-code">404</div>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-desc">
          Oops! The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          🏠 Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
