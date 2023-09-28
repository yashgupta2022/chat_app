import {  Col, Container, Row } from "react-bootstrap";
function NavBar(){ 
    return (<div>   
        <Container fluid  className="py-0 navbar">
        <Row >
        <Col  className="d-flex align-items-center justify-content-start">
        <a  href='/'><img className="navbar-img"  src="/logo.jpg" alt=" "/></a>
        <a style={{color:'white' ,fontSize:'larger' , paddingLeft:10 }} href='/'>CHAT-APP</a>
        </Col>
        </Row>
      </Container></div>  
    )
}
export default NavBar;
