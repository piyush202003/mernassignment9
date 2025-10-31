import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { logService } from '../../services/logService';

const QrScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);
  const isRunning = useRef(false);

  useEffect(() => {
    const startScanner = async () => {
      if (isRunning.current) return;

      const elementId = 'qr-scanner-region';
      scannerRef.current = new Html5Qrcode(elementId);

      const onScanSuccess = async (decodedText) => {
        if (loading) return;
        setLoading(true);
        setError(null);
        setMessage(null);
        setScanResult(decodedText);

        try {
          const response = await logService.handleScan(decodedText);
          setMessage(
            `${response.message}: ${response.visitorName} at ${new Date(
              response.checkInTime || response.checkOutTime
            ).toLocaleTimeString()}`
          );
        } catch (err) {
          setError(err.message || 'Something went wrong.');
        } finally {
          setLoading(false);
          setTimeout(() => {
            setScanResult(null);
            setMessage(null);
            setError(null);
          }, 30000);
        }
      };

      const onScanError = (errorMessage) => {
        if (errorMessage?.includes('getImageData')) return;
        console.warn('QR Scan error:', errorMessage);
      };

      try {
        await scannerRef.current.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          onScanSuccess,
          onScanError
        );
        isRunning.current = true;
      } catch (err) {
        console.error('QR Scanner Start Error:', err);
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please allow camera permission.');
        } else {
          setError('Could not start QR scanner. Please check your camera.');
        }
      }
    };
    const timeoutId = setTimeout(startScanner, 3000);

    return () => {
      clearTimeout(timeoutId);
      if (isRunning.current && scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            isRunning.current = false;
            console.log('QR Scanner stopped.');
          })
          .catch((err) => console.error('QR Scanner stop error:', err));
      }
    };
  }, []);

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h3>QR Code Scanner</h3>
      <div
        id="qr-scanner-region"
        style={{
          width: '100%',
          minHeight: '250px',
          border: '1px solid #ddd',
          borderRadius: '10px',
        }}
      ></div>
      {loading && <p>Processing scan...</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
};

export default QrScanner;
