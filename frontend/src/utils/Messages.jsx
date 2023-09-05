  import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';

import socket from './io';
import Home from '../components/Home';
import SelectedFriendDetails from './SelectedFriendDetails';
import MsgTemplate from "./MsgTemplate";
import {datetime, updateFriendList} from './API';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmile,faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const Messages =({Msgs , setMsgs ,setItem, showfriendList , showMessages ,item})=>{

    const {userid} =useParams();
    const [msginput,setmsgInput] =useState('');
    const [emojiHide,setEmoji] = useState(true)
    const [file,setFile] =useState(null)

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
            const response = await axios.post('http://localhost:8080/uploadFile',data);
            msg = {senderid : userid , room : item.room, name:item , msgType:'file', body:response.data, filename:file.name, timestamp: datetime()}
            flag=1
          } 
          else if (msginput.trim() !== ''){
            msg = {senderid : userid , room : item.room, name:item ,msgType:'text', body:msginput, timestamp: datetime()}
            flag=1        
          }
  
          if (flag===1){
            const response = await axios.post('http://localhost:8080/sendMsg',msg);
            updateFriendList(userid , msg.room)
            showfriendList()
            setMsgs([...Msgs,{...msg,status:'Delivered'}])
            socket.emit('send-message',response.data)
          }
        }
        setmsgInput('')   
        setEmoji(true)
    }

    


    return <Col xs = {8} md={9}  className='message-area'>
        <div  hidden={item.username!=='No Chat Selected' }>
          <Home  style={{paddingTop:0}} hide={true}/>
        </div>
        <div hidden={item.username==='No Chat Selected'}>
          
          <SelectedFriendDetails item={item} setItem={setItem} showfriendList={showfriendList} showMessages={showMessages}  />

          <Row  className='no-gutters message-display '>
            <Col >
              {Msgs.slice(0).reverse().map((i,index) => 
                <MsgTemplate key={index} obj = {{item:i ,type:item.type}} />
              )}
            </Col>
          </Row>
            
          <div hidden={emojiHide} className='emojiPicker'>
            <Picker  data={data}  id='emoji' onEmojiSelect={emoji => {setmsgInput( prev=> {return prev+emoji.native}) ; }} />
          </div>    
            
          <Row className ="message-input no-gutters">
            <Col xs={2}  md={1} className="icons" >
              <FontAwesomeIcon  type='button'  onClick={()=>setEmoji(!emojiHide)}   icon={faSmile} size="2xl" style={{color: "white"} }/>
            </Col>
            <Col xs={2} md={1} className="icons">
              <label htmlFor="fileInput">
                <FontAwesomeIcon  type='button' icon={faPaperclip} size="2xl" style={{color: "white", marginTop:8} } />
              </label>
              <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleFileChange}/>
            </Col>
            <Col xs ={6} md={9}>
              <Form onSubmit={msghandleSubmit}>
                <Form.Control  className="chat-input " type="text"  placeholder="Type a Message..." value = {msginput} onChange={(e)=>{setmsgInput(e.target.value);}}/>
              </Form>
            </Col>
            <Col xs={2} md={1}  className="icons">
              <FontAwesomeIcon  onClick={msghandleSubmit} type='button' icon={faPaperPlane} size="2xl" style={{color: "white"}} />
            </Col>
          </Row>
        </div>
    </Col>

}

export default Messages;