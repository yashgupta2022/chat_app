import {Container,Row,Col} from 'react-bootstrap';
import { useEffect, useRef, useState} from 'react';
import { useParams } from 'react-router-dom';


import socket from './io';
import { getLastMessage , fetchDP } from './API';

import ShowImage from './ShowImage';



const FriendInfo = ({item})=>{
    const {userid} =useParams();
    const [detail,setDetail] =useState()
    const [dp,setDP] =useState('/alt-dp.jpg');
    const itemRef = useRef(item)
    useEffect(()=>{itemRef.current=item },[item])


    const getlastmsg = async () => {
        const response = await getLastMessage(item, userid);
        setDetail(response);
    };

    const getDP =async ()=>{
        const dpPath = await fetchDP(itemRef.current);
        setDP(dpPath);
    }

    useEffect(()=>{       
        getlastmsg();
        getDP();
    }
    ,[item])   
    
    useEffect(() => {
        socket.on('receiveDP',()=>{getDP()})
      }, []);
      
    if (item.username!=='No Friends Added'){
    return  <Container className='px-0' >
                <Row className='no-gutters' style={{height:60}}>
                    <Col xs={4} sm={3} lg={2}    >
                        <ShowImage dp={dp} />
                    </Col>
                    <Col xs={8} sm={9} lg={10} style={{paddingLeft:10}}>
                        <Row className = "no-gutters detail"  >
                            <Col className='footer-left'> <b>{item.username}</b></Col>
                                                           
                        </Row>

                        <Row className = "no-gutters detail" >
                            <Col  className='footer-left'>{detail?.status === 'Received'? '' : detail?.status === 'Delivered'? 
                            <img style={{height:15,marginBottom:3, width:15}} src='/blue-tick.png' /> :''} 
                            {item.type==='group' && detail?.status === 'Received'? detail?.sendername.substring(0,6) + ' : ':''}{detail?.body} </Col>
                            <Col className='footer-right' >
                                <Row className = "no-gutters"><Col>{detail?.timestamp?.substring(0,detail?.timestamp?.length-8)} </Col></Row>
                                <Row className = "no-gutters"><Col>{detail?.timestamp?.substring(detail?.timestamp?.length-8)} </Col></Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        }
        else {return  <Row className='no-gutters' style={{height:60 ,fontSize:'large'}}><Col > <b>{item.username}</b></Col></Row>
}}

export default FriendInfo;






