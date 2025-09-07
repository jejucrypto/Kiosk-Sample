import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaCheckCircle, FaDownload, FaHome, FaPrint } from 'react-icons/fa';
import './TicketComplete.css';

function TicketComplete({ userData, setUserData }) {
  const navigate = useNavigate();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    // Auto-download PDF after 2 seconds
    const timer = setTimeout(() => {
      downloadTicketPDF();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = () => {
    const date = new Date();
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getValidUntil = () => {
    const date = new Date();
    date.setHours(date.getHours() + 8); // Valid for 8 hours
    return date.toLocaleString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    });
  };

  const downloadTicketPDF = async () => {
    setIsGeneratingPDF(true);
    
    const ticketElement = document.getElementById('ticket-to-print');
    
    try {
      const canvas = await html2canvas(ticketElement, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`ticket-${userData.transactionId}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
    
    setIsGeneratingPDF(false);
  };

  const startNewTransaction = () => {
    setUserData({
      hasID: null,
      name: '',
      capturedImage: null,
      selectedBuilding: null,
      ticketPrice: 0,
      transactionId: null
    });
    navigate('/');
  };

  return (
    <div className="ticket-complete fade-in">
      <div className="complete-container">
        <div className="success-header">
          <FaCheckCircle className="success-icon" />
          <h1>Payment Successful!</h1>
          <p>Your ticket has been generated and is ready for download</p>
        </div>

        <div className="final-ticket" id="ticket-to-print">
          <div className="ticket-design">
            <div className="ticket-top">
              <div className="company-logo">
                <div className="logo-circle">BA</div>
                <span>Building Access</span>
              </div>
              <div className="ticket-type">VISITOR PASS</div>
            </div>

            <div className="ticket-main">
              {userData.capturedImage && (
                <div className="visitor-photo">
                  <img src={userData.capturedImage} alt="Visitor" />
                </div>
              )}

              <div className="visitor-details">
                <h2>{userData.name}</h2>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Transaction ID</span>
                    <span className="detail-value">{userData.transactionId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date</span>
                    <span className="detail-value">{formatDate()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Time</span>
                    <span className="detail-value">{formatTime()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Valid Until</span>
                    <span className="detail-value">{getValidUntil()}</span>
                  </div>
                </div>
              </div>

              <div className="access-info">
                <div className="building-access">
                  <h3>Building Access</h3>
                  <div className="building-name">{userData.selectedBuilding?.name}</div>
                  <div className="access-level">VISITOR ACCESS</div>
                </div>
                <div className="price-info">
                  <span className="price-label">Amount Paid</span>
                  <span className="price-value">${userData.ticketPrice}.00</span>
                </div>
              </div>

              <div className="ticket-footer">
                <div className="barcode-section">
                  <div className="barcode-lines"></div>
                  <div className="barcode-text">{userData.transactionId}</div>
                </div>
                <div className="instructions">
                  <p>Please keep this ticket with you at all times</p>
                  <p>Show this ticket at the entrance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            onClick={downloadTicketPDF} 
            className="download-button"
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <>
                <div className="spinner-small"></div>
                Generating PDF...
              </>
            ) : (
              <>
                <FaDownload /> Download Ticket PDF
              </>
            )}
          </button>
          
          <button onClick={startNewTransaction} className="new-transaction-button">
            <FaHome /> Start New Transaction
          </button>
        </div>

        <div className="print-notice">
          <FaPrint className="print-icon" />
          <p>In a real kiosk, the ticket would be printed automatically</p>
        </div>
      </div>
    </div>
  );
}

export default TicketComplete;
