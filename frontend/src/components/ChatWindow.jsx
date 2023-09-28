import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Container, Row } from 'react-bootstrap';
import socket from '../utils/io';

import FriendList from '../utils/FriendList';

import {getAllUsers, getMessages, getfriendList, updateFriendList} from '../utils/API'
import Messages from '../utils/Messages';

function ChatWindow(){
  
    const {userid} =useParams();
    const navigate = useNavigate();
    
    
    const [friendList,setFriendList] = useState([{}])
    const [individualFriends,setIndiFriends] = useState([])
    const [item,setItem] = useState({userid:'', username:'No Chat Selected',room:'',type:''})
    const [Msgs , setMsgs] =useState([])
    
    const [usersList,setUsers] =useState([])
    const [resultantUsers,setResultantUsers] = useState([]);
    const itemRef = useRef(item);
    useEffect(()=>{itemRef.current = item},[item])

    
    const showfriendList=async()=>{
      const users = await getAllUsers();
      const data = await getfriendList(userid)      
      let result = users.filter(objA => !data.individualfriends.some(objB => objB.userid === objA.userid));
      let newresult =  result.filter(i=>i.userid !==userid)
      setFriendList(data.friendlist);
      setIndiFriends(data.individualfriends)
      setUsers(users);
      setResultantUsers(newresult)
    }


    const showMessages=  async(room)=>{
      const data = await getMessages(room,userid)
      setMsgs(data)
    }


    const handleLogout = ()=>{
      localStorage.removeItem(userid)
      socket.emit('disconnectings' , userid)
      navigate('/')
  }

  

  useEffect(()=>{
    socket.emit('close-tab',userid) //->for user's previously logged-in session
    socket.on('close-tab-prompt',()=>{
      const shouldReloadTab = window.confirm(`${userid} is opened in another window. Click OK to use account in this window.`); 
      if (shouldReloadTab) {window.location.reload();}
      else {window.location.replace('/')}

    })
    
    if (!localStorage.getItem(userid)){
      socket.emit('disconnectings' , userid)
      navigate('/')
    }
    else {
      socket.emit('join-room',userid)
      showfriendList();

      socket.on('receive-message', (msg)=>{
         updateFriendList(userid , msg.room)
         showfriendList()
        const roomname =itemRef.current.room
        if (roomname.localeCompare(msg.room)===0){
          setMsgs(prev=>{return [...prev,msg]})
        }
     })

      socket.on('delete-in-friendList' , (deletedid)=>{
        if (deletedid.localeCompare(itemRef.current.userid)===0){
          setItem({userid:'', username: 'No Chat Selected',type:"" ,room:''})
        }
        showfriendList();
      })
    }

    socket.on('update-friendList',()=>{showfriendList()})
  },[])
  


  const [show, setShow] = useState(true);
  const [screen, setScreen] = useState(window.screen.availWidth);
  function handleResize() {
    setScreen(window.screen.availWidth);
  }

  
  useEffect(()=>{window.addEventListener('resize', handleResize);},[])

      return  <Container fluid className='px-0 chat-window'>
        {screen<450 ? <>
        <Row className='no-gutters h-100 ' >
        <Col className={!show ? 'd-none' : ''} >
          <FriendList setItem={setItem} 
            friendList={friendList} showfriendList={showfriendList}
            individualFriends={individualFriends} showMessages={showMessages} handleLogout={handleLogout}
            resultantUsers={resultantUsers} setShow={setShow}
          /></Col>
          <Col className={show ? 'd-none message-area' : 'message-area'} >
          <Messages Msgs ={Msgs} setMsgs ={setMsgs} 
          showfriendList ={showfriendList} item={item} setItem={setItem} showMessages={showMessages} screen={screen}  back = {show} setback = {setShow}
          /></Col>

      </Row></>
      :
      <Row className='no-gutters h-100 ' >
        
        <Col xs={3}>
          <FriendList setItem={setItem} 
            friendList={friendList} showfriendList={showfriendList}
            individualFriends={individualFriends} showMessages={showMessages} handleLogout={handleLogout}
            resultantUsers={resultantUsers} setShow={setShow}
          /></Col>
          <Col xs={9} >
          <Messages Msgs ={Msgs} setMsgs ={setMsgs} 
          showfriendList ={showfriendList} item={item} setItem={setItem} showMessages={showMessages}
          /></Col>

      </Row>}

      </Container>

}

export default ChatWindow;