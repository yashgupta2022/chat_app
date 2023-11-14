import { BrowserRouter,Routes,Route} from "react-router-dom";
import ChatWindow from './ChatWindow';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignIn from "./SignIn";
import Register from "./Register"
import { useReactMediaRecorder } from "react-media-recorder";
import { useEffect, useState } from "react";
import { LoadScript } from "@react-google-maps/api";
function App() {
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const [facingMode, setFacingMode] = useState('user');
  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl, pauseRecording , resumeRecording } = useReactMediaRecorder({ audio:true, video: true, facingMode: facingMode });
  
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_API_KEY}>
      <BrowserRouter forceRefresh={true}>
      <Routes> 
          <Route  path="/chat/:userid"  element={<ChatWindow status={status}  setFacingMode = {setFacingMode}  startRecording={startRecording}   stopRecording={stopRecording}  mediaBlobUrl={mediaBlobUrl}  clearBlobUrl={clearBlobUrl}  pauseRecording={pauseRecording}  resumeRecording={resumeRecording}/>}  />   
          <Route  path="/register"  element={<Register />}  />   
          <Route path='*'  element={<SignIn />} />     
      </Routes>  
      </BrowserRouter>
      </LoadScript>
      </GoogleOAuthProvider>
  )
}

export default App;