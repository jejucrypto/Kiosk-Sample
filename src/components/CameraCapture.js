import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import { FaCamera, FaRedo, FaCheckCircle } from 'react-icons/fa';
import './CameraCapture.css';

function CameraCapture({ userData, setUserData }) {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [extractedName, setExtractedName] = useState('');
  const [manualName, setManualName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    
    if (userData.hasID) {
      // Process ID card with OCR
      setIsProcessing(true);
      Tesseract.recognize(
        imageSrc,
        'eng',
        {
          logger: m => console.log(m)
        }
      ).then(({ data: { text } }) => {
        // Simple name extraction (in real app, would be more sophisticated)
        const nameMatch = text.match(/Name[:\s]+([A-Za-z\s]+)/i);
        const extractedName = nameMatch ? nameMatch[1].trim() : '';
        setExtractedName(extractedName || 'John Doe'); // Default for demo
        setIsProcessing(false);
        setShowNameInput(true);
      }).catch(err => {
        console.error(err);
        setExtractedName('John Doe'); // Default for demo
        setIsProcessing(false);
        setShowNameInput(true);
      });
    } else {
      // For no ID, just capture face and ask for name
      setShowNameInput(true);
    }
  }, [userData.hasID]);

  const retake = () => {
    setCapturedImage(null);
    setExtractedName('');
    setManualName('');
    setShowNameInput(false);
  };

  const proceed = () => {
    const finalName = userData.hasID ? extractedName : manualName;
    if (finalName) {
      setUserData({
        ...userData,
        name: finalName,
        capturedImage: capturedImage
      });
      navigate('/building-selection');
    }
  };

  return (
    <div className="camera-capture fade-in">
      <div className="camera-container">
        <h1 className="camera-title">
          {userData.hasID ? 'Scan Your ID Card' : 'Capture Your Face'}
        </h1>
        
        <div className="camera-content">
          {!capturedImage ? (
            <div className="webcam-container">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="webcam"
                videoConstraints={{
                  width: 640,
                  height: 480,
                  facingMode: "user"
                }}
              />
              <button onClick={capture} className="capture-button">
                <FaCamera /> Capture
              </button>
            </div>
          ) : (
            <div className="captured-container">
              <img src={capturedImage} alt="Captured" className="captured-image" />
              <button onClick={retake} className="retake-button">
                <FaRedo /> Retake
              </button>
            </div>
          )}
          
          {isProcessing && (
            <div className="processing">
              <div className="spinner"></div>
              <p>Processing ID card...</p>
            </div>
          )}
          
          {showNameInput && (
            <div className="name-input-container">
              {userData.hasID ? (
                <div className="extracted-name">
                  <h3>Extracted Name:</h3>
                  <input
                    type="text"
                    value={extractedName}
                    onChange={(e) => setExtractedName(e.target.value)}
                    className="name-input"
                    placeholder="Name from ID"
                  />
                </div>
              ) : (
                <div className="manual-name">
                  <h3>Please Enter Your Name:</h3>
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="name-input"
                    placeholder="Enter your full name"
                  />
                </div>
              )}
              
              <button 
                onClick={proceed} 
                className="proceed-button"
                disabled={userData.hasID ? !extractedName : !manualName}
              >
                <FaCheckCircle /> Proceed to Building Selection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CameraCapture;
