import React, { useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { useState} from 'react';
import { Container, Form, Row,Col, Button} from "react-bootstrap";
import Home from "./Home";
import axios from 'axios';
import NavBar from '../utils/NavBar';
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { port } from "../utils/io";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner} from '@fortawesome/free-solid-svg-icons'

function SignIn() {
  const navigate = useNavigate();
  
  const [ warning ,setWarning] =useState("");
  const [ form ,setForm] =useState({ username:'',password:''});
  const handleForm = (e)=>{setForm({...form,[e.target.name] :e.target.value})}

  //Sending Data to node-server
  const handleSubmit = async (e)=>{
    e.preventDefault();
    setWarning(<FontAwesomeIcon icon={faSpinner} spin size="xl" style={{color: "#f50000",}} />)
    if (form.username!=="" && form.password!==''){
        const response= await axios.post(port+'login',form);
        if (response.data==="fail")
          setWarning("Invalid UserName or Password")
        else {
          setWarning("Sign In Successful")
          localStorage.setItem(response.data,true)
          setTimeout(()=>{navigate('/chat/' + response.data)},1000);
        }
    }
  }
  
  const loginSuccess = async (res)=>{
      setWarning(<FontAwesomeIcon icon={faSpinner} spin size="xl" style={{color: "#f50000",}} />)
      const decoded = jwtDecode(res.credential);  
      const response = await axios.post(port+'loginuser',decoded);
      localStorage.setItem(response.data,true)
      setWarning("Sign In Successful")
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

     
  return (       <div >
      <NavBar/>

      {screen<450 ? 
        <Row className='no-gutters h-100 ' >
        <Col className={show ? 'd-none sign-in' : 'sign-in'} style={{ background:'url("/home-bg.jpg")',backgroundSize: 'cover'}} >        
        <Form style={{marginTop:10,marginLeft:'6%'}} onSubmit={handleSubmit}>
          <h2 className="sign-in-headline">Sign-in to Chat-App</h2>
          <GoogleLogin  onSuccess={loginSuccess} onError={loginError} />
            <h6 style={{marginTop:20 , marginLeft:50 }}>OR</h6>
          <Form.Group style={{marginTop:20}} className = "sign-in-username">
            <Form.Label><h5>Username</h5></Form.Label>
            <Form.Control style={{width:'80vw'}} type="text" name = "username" onChange = {handleForm} placeholder="Enter Username"/>
          </Form.Group>
          <Form.Group style={{marginTop:20}} className = "sign-in-username">
            <Form.Label><h5>Password</h5></Form.Label>
            <Form.Control style={{width:'80vw'}} type="password" name = "password" onChange = {handleForm} placeholder="Enter Password"/>
          </Form.Group>
          <Form.Group style={{marginTop:20}}>
          <Button variant="dark" type="submit" size='md' >Login</Button>        
          <Button variant="secondary" size='md' style={{marginLeft:20}} onClick ={()=>navigate('/register')} >Register</Button>  
          </Form.Group>
        </Form>
        <p className="warningSignin">{warning}</p>

        </Col>
        </Row>

        :

        <Row className="no-gutters">
        <Col xs= {7} >
        <Container fluid className="home mx-0" >
          <Home />
          </Container>
        </Col>
        <Col xs={5}  className="sign-in">
        
        <Form style={{marginTop:'10vh',marginLeft:'6%'}} onSubmit={handleSubmit}>
          <h1 className="sign-in-headline">Sign-in to Chat-App</h1>
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
          <Form.Group style={{marginTop:20}}>
          <Button variant="dark" type="submit" size='md' >Login</Button>        
          <Button variant="secondary" type="submit" size='md' style={{marginLeft:20}} onClick ={()=>navigate('/register')} >Register</Button>  
          </Form.Group>
        </Form>
        <p className="warningSignin">{warning}</p>

        </Col>

        </Row>}
        </div>
  )
}
export default SignIn;
