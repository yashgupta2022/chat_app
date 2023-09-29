import { BrowserRouter,Routes,Route, Navigate} from "react-router-dom";
import Home from "./Home"
import ChatWindow from './ChatWindow';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignIn from "./SignIn";
import Register from "./Register"
function App() {
  const CLIENT_ID =process.env.CLIENT_ID
  
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BrowserRouter forceRefresh={true}>
      <Routes> 
          <Route  path="/chat/:userid"  element={<ChatWindow />}  />   
          <Route  path="/register"  element={<Register />}  />   
          <Route path='*'  element={<SignIn />} />     
      </Routes>  
      </BrowserRouter>
      </GoogleOAuthProvider>
  )
}

export default App;