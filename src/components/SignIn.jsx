import React from "react";
import { useNavigate} from "react-router-dom";
import { useState} from 'react';
import { Container, Form, Row,Col, Button} from "react-bootstrap";
import Home from "./Home";
import axios from 'axios';
 
import NavBar from '../utils/NavBar';



function SignIn(props) {
  const navigate = useNavigate();
  
  const [ warning ,setWarning] =useState("");
  const [submitbtn,setbtn] = useState("login");
  const [ form ,setForm] =useState({username:'',password:''});
  const handleForm = (e)=>{setForm({...form,[e.target.name] :e.target.value})}

  //Sending Data to node-server
  const handleSubmit = async (e)=>{
    e.preventDefault();
    if (form.username!=="" && form.password!==''){
    if (submitbtn==='login'){
      const response= await axios.post('http://localhost:8080/login',form);
      if (response.data==="fail")
        setWarning("Invalid UserName or Password")
      else {
        setWarning("Login Success")
        localStorage.setItem(form.username,true)
        setTimeout(()=>{navigate('/chat/' + form.username)},1000);
      }
    }
  }
}
     
  return (
    <div>
      
      <NavBar sign='Register' />
      <div >
        <Row className="no-gutters">
        <Col xs= {8} >
          <Home  btnHidden={true}/>
        </Col>
        <Col xs={4}  className="sign-in">
        <Form style={{marginTop:'5%',marginLeft:'6%'}} onSubmit={handleSubmit}>
          <h1 className="sign-in-headline">Sign-in to Chat-App</h1>
          <Form.Group style={{marginTop:'10%'}} className = "sign-in-username">
            <Form.Label><h5>User Name</h5></Form.Label>
            <Form.Control style={{width:'80%'}} type="text" name = "username" onChange = {handleForm} placeholder="Enter Username"/>
          </Form.Group>
          <Form.Group style={{marginTop:'8%'}} className = "sign-in-username">
            <Form.Label><h5>Password</h5></Form.Label>
            <Form.Control style={{width:'80%'}} type="password" name = "password" onChange = {handleForm} placeholder="Enter Password"/>
          </Form.Group>
          <Form.Group style={{marginTop:'8%'}}>
          <Button variant="dark" type="submit" size='lg' onClick ={()=>setbtn("login")} >Login</Button>          
          
          </Form.Group>
        </Form>
        <p className="warningSignin">{warning}</p>
        </Col>
        </Row>
            
        </div>
      </div>    
  )
}
export default SignIn;
