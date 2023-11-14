import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faDownload } from "@fortawesome/free-solid-svg-icons";
import { Col, Container, Row } from "react-bootstrap";
import FileViewer from 'react-file-viewer';
const FullScrImg = ({ isDoc , setDoc }) => {
    return (
        <Container onClick={()=>setDoc(false)} fluid style={{backgroundColor:'black', position: 'absolute', zIndex:'100'}}>
            <Row className="no-gutters justify-content-end align-items-center" style={{height:'8vh'}}>
                <Col xs='7' md='9'></Col>
                <Col xs ='2' md='1'> <FontAwesomeIcon
                        icon={faDownload}
                        size="2x"
                        style={{ cursor: "pointer" , color:'white' }}
                        onClick={()=>{window.open(isDoc)}}
                    /> </Col>
                <Col xs= '2' md='1' ><FontAwesomeIcon
                        icon={faTimes}
                        size="2x"
                        style={{ cursor: "pointer" , color:'white'}}
                        onClick={()=>setDoc(false)}
                    /></Col>
            </Row>
            <Row style={{height:'91vh'}}>
                <Col className="justify-content-center align-items-center"  style={{height:'90%' ,  width:'90%'}}>
                <FileViewer height='100%' width='100%'
                    fileType={isDoc.substring(isDoc.lastIndexOf('.')+1)}
                    filePath={isDoc}/>
                </Col>
                
            </Row>
        </Container>
    );
};

export default FullScrImg;
