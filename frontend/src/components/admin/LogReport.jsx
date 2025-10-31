import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import { CSVLink } from 'react-csv';

const csvHeaders = [
  { label: 'Visitor Name', key: 'visitorName' },
  { label: 'Status', key: 'status' },
  { label: 'Check-In Time', key: 'checkInTime' },
  { label: 'Check-Out Time', key: 'checkOutTime' },
  { label: 'Host Name', key: 'host.name' },
  { label: 'Scanned By (Security)', key: 'securityStaff.name' },
  { label: 'Host Email', key: 'host.email' },
];

const LogReport = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    visitorName: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getLogsReport(filters);
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReport();
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Check-In & Check-Out Report</h3>
      <form onSubmit={handleSearch} style={filterFormStyle}>
        <input
          type="text"
          name="visitorName"
          placeholder="Search by visitor name..."
          value={filters.visitorName}
          onChange={handleFilterChange}
          style={filterInputStyle}
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          style={filterInputStyle}
        >
          <option value="">All Statuses</option>
          <option value="CheckedIn">Checked In</option>
          <option value="CheckedOut">Checked Out</option>
        </select>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          style={filterInputStyle}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          style={filterInputStyle}
        />
        <button type="submit" style={buttonStyle}>Search</button>
        <CSVLink
          data={logs}
          headers={csvHeaders}
          filename={'visitor_logs_report.csv'}
          style={{...buttonStyle, background: '#17a2b8', textDecoration: 'none'}}
        >
          Export to CSV
        </CSVLink>
      </form>
      {loading && <p>Loading report...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
         <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={tableCellStyle}>Visitor</th>
            <th style={tableCellStyle}>Status</th>
            <th style={tableCellStyle}>Check-In</th>
            <th style={tableCellStyle}>Check-Out</th>
            <th style={tableCellStyle}>Host</th>
            <th style={tableCellStyle}>Scanned By (Security)</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td style={tableCellStyle}>{log.visitorName}</td>
              <td style={tableCellStyle}>{log.status}</td>
              <td style={tableCellStyle}>
                {new Date(log.checkInTime).toLocaleString()}
              </td>
              <td style={tableCellStyle}>
                {log.checkOutTime ? new Date(log.checkOutTime).toLocaleString() : 'N/A'}
              </td>
              <td style={tableCellStyle}>{log.host?.name || 'N/A'}</td>
              <td style={tableCellStyle}>{log.securityStaff?.name || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
const filterFormStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginBottom: '1rem',
};
const filterInputStyle = { padding: '8px' };
const buttonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};
const tableCellStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
};

export default LogReport;