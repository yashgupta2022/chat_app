import React, { useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { useState} from 'react';
import { Container, Form, Row,Col, Button} from "react-bootstrap";
import Home from "./Home";
import axios from 'axios';
import NavBar from '../utils/NavBar';
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { v4 as uuidv4 } from 'uuid';
import { port } from "../utils/io";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner} from '@fortawesome/free-solid-svg-icons'


function Register() {
  const navigate = useNavigate();
  
  const [ warning ,setWarning] =useState("");
  const [ form ,setForm] =useState({userid:'', username:'',password:'' , email:'' });
  const handleForm = (e)=>{setForm({...form,[e.target.name] :e.target.value})}

  //Sending Data to node-server
  const handleSubmit = async (e)=>{
    e.preventDefault();
    setWarning(<FontAwesomeIcon icon={faSpinner} spin size="xl" style={{color: "#f50000",}} />)
    if (form.username!=="" && form.password!==''){
        form.userid = uuidv4();
        const response= await axios.post(port+'register',form);
        if (response.data==="fail")
          setWarning("User already registered...")
        else {
          setWarning("Registration Successful.. Redirecting to SignIn Page.")
          setTimeout(()=>{navigate('/')},1000);
        }
    }
  }
  
  const loginSuccess = async (res)=>{
    setWarning(<FontAwesomeIcon icon={faSpinner} spin size="xl" style={{color: "#f50000",}} />)
      const decoded = jwtDecode(res.credential);  
      const response = await axios.post(port+'loginuser',decoded);
      localStorage.setItem(response.data,true)
      setWarning("Registration Successful...")
      setTimeout(()=>{navigate('/chat/' + response.data)},1000);
  }


  const loginError = (res)=>{
      navigate('/')
  }
  const [show, setShow] = useState(false);
  const [screen, setScreen] = useState(window.screen.availWidth);
  function handleResize() {
    setScreen(window.screen.availWidth);
  }

  
  useEffect(()=>{window.addEventListener('resize', handleResize);},[])

     
  return (<div >
      <NavBar/>
      {screen<450 ? 
        <Row className='no-gutters h-100 ' >
        <Col className={show ? 'd-none sign-in' : 'sign-in'} style={{ background:'url("/home-bg.jpg")',backgroundSize: 'cover'}}         >
        <Form style={{marginTop:10,marginLeft:'6%'}} onSubmit={handleSubmit}>
          <h2 className="sign-in-headline">Register to Chat-App</h2>
          <GoogleLogin onSuccess={loginSuccess} onError={loginError} />
            <h6 style={{marginTop:20 , marginLeft:50 }}>OR</h6>
          <Form.Group style={{marginTop:20}} className = "sign-in-username">
            <Form.Label><h5>Username</h5></Form.Label>
            <Form.Control style={{width:'80vw'}} type="text" name = "username" onChange = {handleForm} placeholder="Enter Username"/>
          </Form.Group>
          <Form.Group style={{marginTop:20}} className = "sign-in-username">
            <Form.Label><h5>Password</h5></Form.Label>
            <Form.Control style={{width:'80vw'}} type="password" name = "password" onChange = {handleForm} placeholder="Enter Password"/>
          </Form.Group>
          <Form.Group style={{marginTop:20}} className = "sign-in-username">
            <Form.Label><h5>Email</h5></Form.Label>
            <Form.Control style={{width:'80vw'}} type="email" name = "email" onChange = {handleForm} placeholder="Enter Email ID"/>
          </Form.Group>
          <Form.Group style={{marginTop:20}}>  
          <Button variant="dark" type="submit" size='md' >Register</Button> 
          <Button variant="secondary" size='md' style={{marginLeft:20}} onClick ={()=>navigate('/')} >Sign In</Button>  
          </Form.Group>
        </Form>
        <p className="warningSignin">{warning}</p>

        </Col>
        </Row>

        :


        <Row className="no-gutters">
        <Col xs= {7} >
        <Container fluid className="home" >
          <Home />
          </Container>
        </Col>
        <Col xs={5}  className="sign-in">
        
        <Form style={{marginTop:'5vh',marginLeft:'6%'}} onSubmit={handleSubmit}>
          <h1 className="sign-in-headline">Register to Chat-App</h1>
          <GoogleLogin style={{width:'35vh'}} onSuccess={loginSuccess} onError={loginError} />
            <h4 style={{marginTop:20 , marginLeft:50 }}>OR</h4>
          <Form.Group style={{marginTop:20}} className = "sign-in-username">
            <Form.Label><h5>Username</h5></Form.Label>
            <Form.Control style={{width:'35vw'}} type="text" name = "username" onChange = {handleForm} placeholder="Enter Username"/>
          </Form.Group>
          <Form.Group style={{marginTop:20}} className = "sign-in-username">
            <Form.Label><h5>Password</h5></Form.Label>
            <Form.Control style={{width:'35vw'}} type="password" name = "password" onChange = {handleForm} placeholder="Enter Password"/>
          </Form.Group>
          <Form.Group style={{marginTop:20}} className = "sign-in-username">
            <Form.Label><h5>Email</h5></Form.Label>
            <Form.Control style={{width:'35vw'}} type="email" name = "email" onChange = {handleForm} placeholder="Enter Email ID"/>
          </Form.Group>
          <Form.Group style={{marginTop:20}}>  
          <Button variant="dark" type="submit" size='md' >Register</Button> 
          <Button variant="secondary" size='md' style={{marginLeft:20}} onClick ={()=>navigate('/')} >Sign In</Button> 
          </Form.Group>
        </Form>
        <p className="warningSignin">{warning}</p>

        </Col>

        </Row>}
            
        </div>
  )
}
export default Register;
