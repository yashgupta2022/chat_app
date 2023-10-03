import { useParams } from 'react-router-dom';
import { useState,useEffect,useRef } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios';

import socket from './io';
import Home from '../components/Home';
import SelectedFriendDetails from './SelectedFriendDetails';
import MsgTemplate from "./MsgTemplate";
import {datetime, updateFriendList} from './API';
import { port } from './io';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmile,faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const Messages =({Msgs , setMsgs ,setItem, showfriendList , showMessages ,item, screen, back , setback})=>{

    const {userid} =useParams();
    const [msginput,setmsgInput] =useState('');
    const [emojiHide,setEmoji] = useState(true)
    const [file,setFile] =useState(null)
    const messageScroll = useRef(null)

    const handleFileChange = (event) => {
      let fileObj = event.target.files[0];
      if (fileObj) {
        setmsgInput(fileObj.name)
        setFile(fileObj)
      }
    };


    const msghandleSubmit =async (e)=>{
        e.preventDefault();
        if (item.username!=='No Chat Selected' ){
          let flag=0 ,msg
          if (file && msginput===file.name ) {
            const data = new FormData();
            data.append('name',file.name)
            data.append('file',file)
            const response = await axios.post(port+'uploadFile',data, {
              headers: {
                'Content-Type': 'multipart/form-data',
              }});
            msg = {senderid : userid , room : item.room, name:item , msgType:'file', body:response.data, filename:file.name, timestamp: datetime()}
            flag=1
          } 
          else if (msginput.trim() !== ''){
            msg = {senderid : userid , room : item.room, name:item ,msgType:'text', body:msginput, timestamp: datetime()}
            flag=1        
          }
  
          if (flag===1){
            const response = await axios.post(port+'sendMsg',msg);
            updateFriendList(userid , msg.room)
            showfriendList()
            setMsgs([...Msgs,{...msg,status:'Delivered'}])
            socket.emit('send-message',response.data)
          }
        }
        setmsgInput('')   
        setEmoji(true)
    }

    useEffect(()=>{
      if (messageScroll.current) {
        messageScroll.current.scrollTop = messageScroll.current.scrollHeight;
      }
    },[Msgs])

    
    return <>
        <div  hidden={item.username!=='No Chat Selected' }>
          <Container fluid style={{paddingTop:0}} className='home'><Home hide={true}/></Container>
        </div>
        <div hidden={item.username==='No Chat Selected'}>
          
          <SelectedFriendDetails item={item} setItem={setItem} showfriendList={showfriendList} showMessages={showMessages} screen = {screen} back = {back} setback = {setback}  />

          <Row  className='no-gutters message-display ' ref = {messageScroll}>
            <Col >
              {Msgs.slice(0).map((i,index) => 
                <MsgTemplate key={index} obj = {{item:i ,type:item.type}} />
              )}
            </Col>
          </Row>
            
          <div hidden={emojiHide} className='emojiPicker'>
            <Picker  data={data}  id='emoji' onEmojiSelect={emoji => {setmsgInput( prev=> {return prev+emoji.native}) ; }} />
          </div>    
            
          <Row className ="message-input no-gutters">
            <Col xs={2}  md={1} className="icons" >
              <FontAwesomeIcon className="fontawesome"  type='button'  onClick={()=>setEmoji(!emojiHide)}   icon={faSmile} size="2xl" style={{color: "white"} }/>
            </Col>
            <Col xs={2} md={1} className="icons">
                <label htmlFor="fileInput">
                  <FontAwesomeIcon className="fontawesome" type='button' icon={faPaperclip} size="2xl" style={{color: "white", marginTop:8} } />
                </label>
                <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleFileChange}/>
            </Col>
            <Col xs ={6} md={9}>
              <Form onSubmit={msghandleSubmit}>
                <Form.Control  className="chat-input " type="text"  placeholder="Type a Message..." value = {msginput} onChange={(e)=>{setmsgInput(e.target.value);}}/>
              </Form>
            </Col>
            <Col xs={2} md={1}  className="icons">
              <FontAwesomeIcon className="fontawesome"  onClick={msghandleSubmit} type='button' icon={faPaperPlane} size="2xl" style={{color: "white"}} />
            </Col>
          </Row>
        </div>
    </>

}

export default Messages;