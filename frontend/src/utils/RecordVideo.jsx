import React, { useState } from 'react';
    import Webcam from 'react-webcam';
    import CameraPhoto, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

const CameraComponent = () => {
  const [videoSrc, setVideoSrc] = useState('');
  const [photoSrc, setPhotoSrc] = useState('');

  const webcamRef = useRef(null);

  const captureVideo = () => {
    setVideoSrc(webcamRef.current.getScreenshot());
  };

  const handleTakePhoto = (dataUri) => {
    setPhotoSrc(dataUri);
  };

  return (
    <div>
      <h2>Video Capture</h2>
      <Webcam ref={webcamRef} width={640} height={480} />
      <button onClick={captureVideo}>Capture Video</button>
      {videoSrc && <video src={videoSrc} width="640" height="480" controls />}
      
      <h2>Photo Capture</h2>
      <CameraPhoto
        idealFacingMode={FACING_MODES.ENVIRONMENT}
        isImageMirror={false}
        onTakePhoto={handleTakePhoto}
      />
      {photoSrc && <img src={photoSrc} alt="Captured" />}
    </div>
  );
};

export default CameraComponent;
