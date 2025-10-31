import React, { useState, useEffect, useRef } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { profileService } from '../../services/profileService';
import * as htmlToImage from 'html-to-image';

const formatDateTime = (dateString) => new Date(dateString).toLocaleString();

const getStatusBadge = (status) => {
  switch (status) {
    case 'Approved': return 'success';
    case 'Rejected': return 'danger';
    case 'CheckedIn': return 'primary';
    default: return 'warning';
  }
};

const VisitorPassCard = ({ appointment, profilePhotoUrl }) => {
  const cardRef = useRef();

  const handleDownload = () => {
    if (cardRef.current) {
      htmlToImage.toPng(cardRef.current, { quality: 0.95 })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `pass_${appointment.visitorName.replace(/\s/g, '_')}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => console.error('Image download failed:', error));
    }
  };

  return (
    <div className="mt-3 text-center">
      <div ref={cardRef} className="border border-primary rounded p-3 bg-white shadow-sm d-inline-block">
        <h5 className="border-bottom pb-2 mb-3 fw-semibold text-primary text-center">
          VISITOR PASS
        </h5>
        <div className="d-flex flex-column align-items-center gap-3 mb-3">
          <div className="text-center">
            <img
              src={profilePhotoUrl || 'https://via.placeholder.com/80?text=P'}
              alt="Profile"
              className="rounded-circle border border-primary shadow-sm"
              width="80"
              height="80"
              style={{ objectFit: 'cover' }}
            />
            <p className="fw-semibold mt-2 mb-0">{appointment.visitorName}</p>
            <small className="text-muted">{appointment.visitorEmail}</small>
          </div>

          <div className="text-center">
            <img
              src={appointment.qrCodeUrl}
              alt="QR Code"
              className="border rounded p-1 bg-light shadow-sm"
              width="130"
              height="130"
            />
          </div>
        </div>

        <div className="text-start small border-top pt-2">
          <p className="mb-1"><strong>Visiting:</strong> {appointment.host?.name || 'N/A'}</p>
          <p className="mb-1"><strong>Time:</strong> {formatDateTime(appointment.appointmentTime)}</p>
          <p className={`fw-bold text-${getStatusBadge(appointment.status)} mt-2`}>
            STATUS: {appointment.status}
          </p>
        </div>
      </div>

      <button onClick={handleDownload} className="btn btn-info btn-sm mt-3">
        <i className="bi bi-download me-1"></i> Download Pass (PNG)
      </button>
    </div>
  );
};

const VisitorAppointmentList = ({ refreshKey }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const profileData = await profileService.getMyProfile();
        setProfilePhoto(profileData.photoUrl || '');
        const appts = await appointmentService.getVisitorAppointments();
        setAppointments(appts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]);

  if (loading)
    return (
      <div className="text-center mt-4">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading your appointments...</p>
      </div>
    );

  if (error)
    return <div className="alert alert-danger mt-4 text-center">Error: {error}</div>;

  if (appointments.length === 0)
    return (
      <div className="alert alert-secondary mt-4 text-center">
        You have not requested any appointments yet.
      </div>
    );

  return (
    <div className="mt-5">
      <h3 className="mb-4 text-primary fw-semibold">My Appointment Requests</h3>

      <div className="row g-4">
        {appointments.map((app) => (
          <div key={app._id} className="col-md-6 col-lg-4">
            <div className={`card border-${getStatusBadge(app.status)} shadow-sm`}>
              <div className="card-body">
                <h5 className="card-title text-truncate">
                  Visiting: {app.host?.name || 'N/A'}
                </h5>
                <span className={`badge bg-${getStatusBadge(app.status)} mb-2`}>
                  {app.status}
                </span>

                <p className="card-text small text-muted mb-2">
                  <strong>Date:</strong> {formatDateTime(app.appointmentTime)}
                </p>

                {app.status === 'Approved' && app.qrCodeUrl ? (
                  <VisitorPassCard appointment={app} profilePhotoUrl={profilePhoto} />
                ) : app.status === 'Pending' ? (
                  <p className="fst-italic text-warning">Awaiting host approval...</p>
                ) : app.status === 'Rejected' ? (
                  <p className="text-danger fst-italic">Your request was rejected.</p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitorAppointmentList;
