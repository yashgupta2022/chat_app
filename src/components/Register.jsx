import { useNavigate} from "react-router-dom";
import { useState} from 'react';
import { Container, Form, Row,Col, Button} from "react-bootstrap";
import Home from "./Home";
import axios from 'axios';
 
import NavBar from '../utils/NavBar';


function Register() {
  const navigate = useNavigate();
  const [ warning ,setWarning] =useState("");
  const [ form ,setForm] =useState({username:'',password:'',name:'',email:'',mobile:''});
  const handleForm = (e)=>{setForm({...form,[e.target.name] :e.target.value})}

  //Sending Data to node-server
  const handleSubmit = async (e)=>{
    e.preventDefault();
    if (form.username!=="" && form.password!==''){
      const response= await axios.post('http://localhost:8080/register',form);
      if (response.data==="fail")
        setWarning("UserName already taken... ")
      else {
        setWarning("Register Success.. Redirecting to Sign In page")
        setTimeout(()=>{navigate('/signin')},3000);
      }
    }
    }
     
  return (
    <div>
        
      <NavBar sign="SignIn"/>
      <div>
        <Row className="no-gutters">
        <Col xs= {8} >
          <Home  btnHidden={true}/>
        </Col>
        <Col xs={4} className="sign-in">
        <Form style={{marginLeft:'6%', marginTop:'5%'}} onSubmit={handleSubmit}>
          <h1 className="sign-in-headline">Register to Chat-App</h1>
          <Form.Group className = "sign-in-username">
            <Form.Label><h6>User Name</h6></Form.Label>
            <Form.Control style={{width:'80%'}} type="text" name = "username" onChange = {handleForm} placeholder="Enter Username"/>
          </Form.Group>
          <Form.Group style={{marginTop:"2%"}} className = "sign-in-username">
            <Form.Label><h6>Password</h6></Form.Label>
            <Form.Control style={{width:'80%'}} type="password" name = "password" onChange = {handleForm} placeholder="Enter Password"/>
          </Form.Group>
          <Form.Group style={{marginTop:"2%"}}  className = "sign-in-username">
            <Form.Label><h6>Name</h6></Form.Label>
            <Form.Control style={{width:'80%'}} type="text" name = "name" onChange = {handleForm} placeholder="Enter Name"/>
          </Form.Group>
          <Form.Group style={{marginTop:"2%"}}  className = "sign-in-username">
            <Form.Label><h6>E-Mail</h6></Form.Label>
            <Form.Control style={{width:'80%'}} type="text" name = "email" onChange = {handleForm} placeholder="Enter E-Mail ID"/>
          </Form.Group>
          <Form.Group style={{marginTop:"2%"}} className = "sign-in-username">
            <Form.Label><h6>Mobile Number</h6></Form.Label>
            <Form.Control style={{width:'80%'}} type="text" name = "mobile" onChange = {handleForm} placeholder="Enter Mobile Number"/>
          </Form.Group>
          <Form.Group style={{marginTop:"3%"}}>
          <Button variant="dark" type="submit" size='lg' >Register</Button>
          </Form.Group>
        </Form>
        <p className="warningSignin">{warning}</p>
        </Col>
        </Row>
            
        </div>
      </div>    
  )
}
export default Register;
