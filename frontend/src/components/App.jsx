import { BrowserRouter,Routes,Route, Navigate} from "react-router-dom";
import Home from "./Home"
import ChatWindow from './ChatWindow';
import { GoogleOAuthProvider } from '@react-oauth/google';
function App() {
  const CLIENT_ID ='490549563204-nshj789tr6vplc26rmlak743qhnqkv96.apps.googleusercontent.com'
  
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BrowserRouter forceRefresh={true}>
      <Routes> 
          <Route  path="/chat/:userid"  element={<ChatWindow />}  />   
          <Route path='*'  element={<Home />} />     
      </Routes>  
      </BrowserRouter>
      </GoogleOAuthProvider>
  )
}

export default App;