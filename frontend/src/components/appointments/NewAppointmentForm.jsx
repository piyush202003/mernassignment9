import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';

const initialState = {
  host: '',
  appointmentTime: '',
  purpose: '',
};

const NewAppointmentForm = ({ onAppointmentRequested }) => {
  const [formData, setFormData] = useState(initialState);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await appointmentService.getAllEmployees();
        setEmployees(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, host: data[0]._id }));
        }
      } catch (err) {
        setError('Failed to fetch employee list. Please try again later.');
      }
    };
    fetchEmployees();
  }, []);

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const newAppointment = await appointmentService.createAppointment(formData);
      setSuccess(
        `Appointment requested successfully for ${newAppointment.appointmentTime}. Status: Pending.`
      );
      setFormData(initialState);
      onAppointmentRequested();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border bg-light">
      <h4 className="mb-4 text-primary fw-semibold">Request a New Appointment</h4>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="mb-3">
          <label htmlFor="host" className="form-label fw-semibold">
            Host (Employee to Visit)
          </label>
          <select
            name="host"
            id="host"
            value={formData.host}
            onChange={handleChange}
            required
            className="form-select"
            disabled={employees.length === 0}
          >
            {employees.length === 0 && <option value="">Loading hosts...</option>}
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="appointmentTime" className="form-label fw-semibold">
            Appointment Time
          </label>
          <input
            type="datetime-local"
            name="appointmentTime"
            id="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
            className="form-control"
            min={getMinDateTime()}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="purpose" className="form-label fw-semibold">
            Purpose of Visit
          </label>
          <textarea
            name="purpose"
            id="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
            rows={3}
            className="form-control"
            placeholder="Briefly describe your purpose..."
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading || employees.length === 0}
        >
          {loading ? (
            <>
              <span
                className="spinner-b spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Submitting...
            </>
          ) : (
            'Request Appointment'
          )}
        </button>
      </form>
    </div>
  );
};

export default NewAppointmentForm;
