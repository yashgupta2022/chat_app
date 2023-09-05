import {  Col, Container, Row } from "react-bootstrap";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";  
import jwtDecode from "jwt-decode";
import { port } from "./io";
function NavBar({hide}){ 
  
  const navigate = useNavigate();
  const loginSuccess = async (res)=>{
      const decoded = jwtDecode(res.credential);  
      const response = await axios.post(port + 'loginuser',decoded);
      localStorage.setItem(response.data,true)
      setTimeout(()=>{navigate('/chat/' + response.data)},1000);
  }


  const loginError = (res)=>{
      navigate('/')
  }
    return (   <div hidden ={hide}>   
        <Container fluid  className="py-0 navbar">
        <Row >
        <Col  className="d-flex align-items-center justify-content-start">
        <a  href='/'><img className="navbar-img"  src="/logo.jpg" alt=" "/></a>
        <a style={{color:'white' ,fontSize:'larger' , paddingLeft:10 }} href='/'>CHAT-APP</a>
        </Col>
       <Col className="d-flex align-items-center justify-content-end">
       <GoogleLogin  s
                onSuccess={loginSuccess}
                onError={loginError}
            />;
        
       </Col>
        </Row>
      </Container></div>  
    )
}
export default NavBar;
