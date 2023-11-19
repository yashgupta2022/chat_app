import { useParams } from 'react-router-dom';
import {React, useState,useEffect,useRef, useCallback } from 'react';
import { Button, Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import axios from 'axios';
import socket from './io';
import Home from '../components/Home';
import SelectedFriendDetails from './SelectedFriendDetails';
import MsgTemplate from "./MsgTemplate";
import {datetime, updateFriendList} from './API';
import { port } from './io';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmile,faPaperPlane, faPaperclip, faRecordVinyl, faPlay, faPause, faSquare, faTrash, faCross, faClose, faVideo, faCamera, faCameraRotate } from '@fortawesome/free-solid-svg-icons'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import Webcam from 'react-webcam';


const Messages =({Msgs , setMsgs ,setItem, showfriendList , showMessages ,item, screen, back , setback, setDoc,
  status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl, pauseRecording , resumeRecording , setFacingMode})=>{
  
    const {userid} =useParams();
    const [msginput,setmsgInput] =useState('');
    const [emojiHide,setEmoji] = useState(true)
    const [file,setFile] =useState(null)
    const messageScroll = useRef(0)
    const [dropDown,setDrop] =useState(true)
    const [recordingbtn , setRecordingbtn] = useState();
    const [audioControls,setAudio] = useState(true);
    const [isOpenVideo,setOpenVideo] = useState(false);
    const [isPhoto,setPhoto] = useState(false);
    const buttonRef = useRef(null)
    const webcamRef = useRef(null);
    

    const switchCamera = () => {
      setFacingMode((prevFacingMode) =>
        prevFacingMode === 'user' ? 'environment' : 'user'
      );
    };


    const handleFileChange = (event) => {
      let fileObj = event.target.files[0];
      if (fileObj) {
        setmsgInput(fileObj.name)
        setFile(fileObj)
      }
    };

   
    useEffect(()=>{
      if (!isOpenVideo && dropDown ){
        stopRecording()
        clearBlobUrl();
        setPhoto(false);
        setAudio(true);
      }
    },[isOpenVideo, dropDown])

    const msghandleSubmit =async (e)=>{
        e.preventDefault();
        if (item.username!=='No Chat Selected' ){
          let flag=0 ,msg
          if (file && msginput===file.name) {
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
        clearFile();
        setDrop(true);
        setEmoji(true);
        setOpenVideo(false);
        
    }

    
    const handleRecording = () => {
      if (status==='idle'){startRecording()}
      else if (status==='recording'){pauseRecording()}
      else if (status==='paused'){resumeRecording()}
    }
    useEffect(()=>{
      if (status==='stopped'){sendFile()}
      else if (status==='recording'){setRecordingbtn(<FontAwesomeIcon icon={faPause} size="xs" />) }
      else if (status==='paused'){setRecordingbtn(<FontAwesomeIcon icon={faPlay} size="xs" />)}
    },[status])

    const sendFile = async () => {
      try {
        let filename 
        !isOpenVideo ? filename = 'audio_' + Date.now() + '.mp3' : filename = 'video_' + Date.now() + '.mp4' ;
        const response = await fetch(mediaBlobUrl);
        const blob = await response.blob();
        const fileObj = new File([blob], filename, { type: blob.type });
        if (fileObj) {
          setFile(fileObj);
          setmsgInput(fileObj.name);
        }
      } catch (error) {
        console.error('Error fetching or creating File:', error);
      }
    };

    const clearFile=()=>{
      clearBlobUrl();
      setPhoto(false);
      setmsgInput('');
      setFile(null);
      setAudio(true);
    }

    const handleTakePhoto = () => {
      try{
        setPhoto(true)
        const base64Screenshot = webcamRef?.current?.getScreenshot();
        if (base64Screenshot) {
          const byteCharacters = atob(base64Screenshot.split(',')[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/png' });
          const filename  = 'image_' + Date.now() + '.png' ;
          const fileObj = new File([blob], filename, { type: 'image/png' });
          if (fileObj) {
            setFile(fileObj);
            setmsgInput(fileObj.name);
          }
        }
      }catch(err){
        console.log(err)
      }

    };

    const sendLocation = async () => {
      if (navigator.geolocation) {navigator.geolocation.getCurrentPosition(
        (position)=>{
          setmsgInput(`https://www.google.com/maps/place/${position.coords.latitude},${position.coords.longitude}`)
        }
      )}
      else {alert('Location not supported')}
    }
    
    useEffect(()=>{
      if (messageScroll.current){
      messageScroll.current.scrollTop = messageScroll.current.scrollHeight}
    },[Msgs , isOpenVideo])

    const handleOutsideClick = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target))
       {setDrop(true) ; setAudio(true); clearBlobUrl()}
  };
  
  useEffect(() => {
      document.addEventListener('click', handleOutsideClick);
      return () => {
        document.removeEventListener('click',handleOutsideClick);
      };
    }, []);


    
    
    return  <>
        <div  hidden={item.username!=='No Chat Selected' }>
          <Container fluid style={{paddingTop:0}} className='home'><Home hide={true}/></Container>
        </div>
        <div hidden={item.username==='No Chat Selected'}>
          
          <SelectedFriendDetails setDoc={setDoc} item={item} setItem={setItem} showfriendList={showfriendList} showMessages={showMessages} screen = {screen} back = {back} setback = {setback}  />

          <Row  className='no-gutters message-display ' ref = {messageScroll}>
            <Col >
              {!isOpenVideo ?Msgs.slice(0).map((i,index) => 
                <MsgTemplate key={index} setDoc={setDoc} obj = {{item:i ,type:item.type}} />
              ) : 
              <Container fluid style={{ backgroundColor:'black' , top:0, bottom:-5, position:'absolute'}}>
                <div>
                  <>
                    <Row className='no-gutters d-flex justify-content-end' style={{marginTop:0,height:'5vh',width:'100%'}} >
                    <FontAwesomeIcon type='button' onClick={()=>{setOpenVideo(false)}} icon={faClose} size="2xl" color='white' style={{marginTop:10}} />
                    </Row>
                    <Row className='no-gutters d-flex justify-content-center' style={{width:'100%'}} >

                    {!isPhoto && status!=='stopped'?<Webcam ref={webcamRef} style={{width:'100%',height:'50vh'}}  />: !isPhoto  && status==='stopped'? 
                    <video style={{width:'100%',height:'50vh'}}  src={mediaBlobUrl} controls loop />  :
                    isPhoto ? <img src={webcamRef?.current?.getScreenshot()} alt='Img' style={{ width:'100%',height:'50vh'}}></img>:<></>}
                    </Row>
                    <Row className='no-gutters d-flex justify-content-center' style={{width:'100%', marginTop:10}} >
                      {status==='idle'? <>
                        {!isPhoto ?<Button className='recordAudio' onClick={handleTakePhoto} variant='danger'><FontAwesomeIcon icon={faCamera} style={{color: "#ffffff",}} /></Button> : ""}
                        {isPhoto ?<Button variant='danger' className='recordAudio' onClick={clearFile}><FontAwesomeIcon icon={faTrash} size="xs" /></Button> :"" }
                        {!isPhoto ? <><Button className='recordAudio' onClick ={()=>{setPhoto(false);startRecording();}} variant='danger'><FontAwesomeIcon icon={faVideo} style={{color: "#ffffff",}} /></Button> </> :""}
                      </>:<></>}
                    {status!=='stopped' && status!=='idle' && !isPhoto?<>
                    <Button className='recordAudio' variant='danger' onClick={handleRecording}>{recordingbtn}</Button>
                    
                    </>:""}
                    {status!=='idle' && !isPhoto?<><Button className='recordAudio' variant='danger' onClick={stopRecording}>
                      <FontAwesomeIcon icon={faSquare} size="xs" /></Button>
                    <Button variant='danger' className='recordAudio' onClick={clearFile}><FontAwesomeIcon icon={faTrash} size="xs" /></Button></>
                    :""}
                    {!isPhoto && status!=='stopped' ?<Button className='recordAudio' variant='danger' onClick={switchCamera}><FontAwesomeIcon icon={faCameraRotate} style={{color: "#ffffff",}} /></Button>:""}
                    {status==='paused' && !isPhoto?<p style={{color:'white', marginTop:10}}>Paused</p>:status==='recording'?<p style={{color:'white', marginTop:10}}>Recording <FontAwesomeIcon icon={faRecordVinyl} size ='xs' color='red' fade/></p>:""}
                    </Row>
                  </>
            </div>
              </Container>}
            </Col>
          </Row>
            
          <div hidden={emojiHide} className='emojiPicker'>
            <Picker  data={data}  id='emoji' onEmojiSelect={emoji => {setmsgInput( prev=> {return prev+emoji.native}) ; }} />
          </div>    

          {/* ATTACHMENTS */}

          <div hidden={dropDown} >
                
            <ListGroup style={{right:50,maxWidth:'100%' }} className='dropdown-message'>
                 
            <ListGroup.Item type='button' style={{marginBottom:0, paddingBottom:0}}>
                  <div> 
                     {audioControls || status==='idle'? <p onClick ={()=>{ clearFile(); setAudio(false); setOpenVideo(false); startRecording()}}>Record Audio </p> : 
                      !isOpenVideo ? <>
                      {status!=='stopped'?<><Button className='recordAudio' variant='danger' onClick={handleRecording}>{recordingbtn}</Button>
                      </>
                      :""}
                      {status!=='idle'?<><Button className='recordAudio' variant='danger' onClick={stopRecording}>
                          <FontAwesomeIcon icon={faSquare} size="xs" /></Button>
                      <Button variant='danger' className='recordAudio' onClick={clearFile}><FontAwesomeIcon icon={faTrash} size="xs" /></Button></>:""}
                      {status==='stopped'?<audio style={{'width':'100%'}} src={mediaBlobUrl} controls loop />:""}
                      {status==='paused'?<p>Paused</p>:status==='recording'?<p>Recording <FontAwesomeIcon icon={faRecordVinyl} size ='xs' color='red' fade/></p>:""}
                      </> : <></>} 
                    </div>
                </ListGroup.Item>  
               
                <ListGroup.Item onClick={()=>{clearBlobUrl();setOpenVideo(!isOpenVideo) ;setPhoto(false) ; setDrop(!dropDown)    }} type='button' > 
                     Camera
                </ListGroup.Item>
                

                <label htmlFor="fileInput">
                  <ListGroup.Item  style={{marginBottom:0, paddingBottom:0, marginTop:-1}} type='button' > 
                      <p>Documents</p>
                      <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleFileChange}/> 
                  </ListGroup.Item>
                </label>
                
                <ListGroup.Item  type='button'  style={{marginTop:-10 }} onClick = {sendLocation} > 
                     Send Current Location 
                </ListGroup.Item>


            </ListGroup>   

            </div>


            
          <Row className ="message-input no-gutters">
            <Col xs={2}  md={1} className="icons" >
              <FontAwesomeIcon className="fontawesome"  type='button'  onClick={()=>setEmoji(!emojiHide)}   icon={faSmile} size="2xl" style={{color: "white"} }/>
            </Col>
            <Col xs={2} md={1} className="icons">
        
            <FontAwesomeIcon className="fontawesome"  type='button' onClick={()=>{setDrop(!dropDown) ; setPhoto(false); setAudio(true); clearBlobUrl() ; setOpenVideo(false) }} icon={faPaperclip} size="2xl" style={{color: "white", marginTop:2} } />
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
