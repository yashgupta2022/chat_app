import axios from "axios";
import {Row,Col, ListGroup, Form} from 'react-bootstrap';
import { useEffect, useRef, useState} from 'react';
import { useParams } from 'react-router-dom';

import { onlineUsers,handleDPChange,getLastMessage , fetchDP, getallfriends } from './API';
import socket from './io';
import ShowImage from "./ShowImage";
import { port } from "./io";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowLeft, faEllipsisVertical} from '@fortawesome/free-solid-svg-icons'

const SelectedFriendDetails = ({item ,setItem, showfriendList,showMessages, screen, back , setback})=>{
    
    const {userid} = useParams();
    const [friendlist,setList] = useState('');
    const [isOnline,setOnline] = useState('');
    const [users,setUsers] = useState([]);
    const [hid,setHid] =useState(0)
    const [detail,setDetail] =useState()
    
    const [dp,setDP] = useState('/alt-dp.jpg');
    const [dropDown,setDrop] =useState(true)
    const [input,setInput] = useState('')
    const buttonRef = useRef(null)
    const itemRef = useRef(item)
    useEffect(()=>{itemRef.current=item},[item])
    


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



    const handleSubmit= async(e)=>{
        e.preventDefault();
        if (input!=='' && input!==userid){
          // Check Friend in FriendDB
            const response1 = await axios.post(port+'check-friend',{userid: input})
            let f_list = await getallfriends(item.room) ,fl=[]
            f_list.forEach(i=>fl.push(i.userid))    
            if (response1.data==="success" ){
                if (!fl.some(i=>i===input)){
                    await axios.post(port+'addFriendinGrp',{item:item, newFriend:input})
                    socket.emit('show-friendlist' ,[...fl,input])
                }
                else {alert('Friend Already in Group')}
            }
            else{alert("Invalid Friend Name")}
        }
        else{alert("Invalid Friend Name")}
        setInput("");
        setDrop(true)
        setHid(0)
    }

    const exitGrp=async()=>{
        let fl = []
        if (item.type==='group'){
            const f = await getallfriends(item.room);
            f.forEach(i=>fl.push(i.userid))    
        }
        await axios.post(port+'exitGrp',{userid,item})
        setDrop(true)
        setItem({userid:'', username: 'No Chat Selected',type:"" ,room:''})
        setback(true);
        showfriendList();
        if (item.type==='individual'){socket.emit('deleted-friendlist' ,item.userid,userid)}
        else {socket.emit('show-friendlist' ,fl)}
    }
    
    const deleteChat =async()=>{
        await axios.post(port+'deleteChat',{userid,item})
        setDrop(true)
        showMessages(item.room)
        getlastmsg();
    }

    const handleChangeDP = async(e)=>{
        const data = await handleDPChange(e,item)
        if (data) {
            setDP(data)
            socket.emit('updateDP')
        }
        setDrop(true)
    }

    const getOnlineStatus =()=>{
        if (item.type ==='individual'){
            const userStatus =onlineUsers(item,users)
            setOnline(userStatus)
        }
    }
        
    const getFriendList =async(item)=>{
        if (item.type==='group') {
        const data = await getallfriends(item.room)
        let a=''
        data.forEach((i)=>{
            if (i.userid===userid) {a= 'You, ' + a}
            else {a = a +  i.username +', '}
        })
        setList(a.substring(0,a.length-2))
        }
    }


    useEffect(()=>{ getOnlineStatus(); getFriendList(item) },[item,users])  
    
    useEffect(()=>{
            socket.on('receiveDP',()=>{getDP()})
            socket.on('onlineUsers',data=>{setUsers(data)})
            socket.on('update-friendList' ,async ()=>{
                getFriendList(item);
                getFriendList(itemRef.current); 
        })
    },[])


    const handleOutsideClick = (event) => {
        if (buttonRef.current && !buttonRef.current.contains(event.target))
         {setDrop(true);setHid(0)}
    };
    
    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
          document.removeEventListener('click',handleOutsideClick);
        };
      }, []);



    return (
        <Row  className="no-gutters Display-friendInfo">
            {screen<450?<Col xs={1} classname='d-flex justify-content-center'> <FontAwesomeIcon className="backbtn fontawesome" icon={faArrowLeft} size="xl" onClick={()=>setback(!back)} /></Col>:""}
            <Col xs={3} sm={2}  lg={1}  className="d-flex justify-content-center ">  
                <ShowImage dp={dp} />
            </Col>
            <Col xs={screen<450?6:7} sm={8} lg={10}>
                <Row className="no-gutters " style={{height:30,marginTop:4}}> 
                    <p style={{fontSize:'larger'}}>{item.username}</p>
                </Row>
                <Row style={{height:30}} className="no-gutters">
                    <p className="display-friends">{(item.type==='individual') ? isOnline : friendlist }</p>
                </Row>
            </Col>
            <div hidden={dropDown} >
                <ListGroup style={{right:50,maxWidth:'100%'}} className='dropDown'>
                    {item?.type==='group' ? 
                    <>
                    <ListGroup.Item   type='button' onClick={(e)=>{e.stopPropagation();setHid(hid===1?0:1)}}>Add Participant
                    <Form   hidden={hid===1?false:true} onSubmit={handleSubmit}>
                        <Form.Control  onClick={e=>{e.stopPropagation()}} type='text' style={{fontSize:14,marginTop:5}} 
                        onChange={e=>{setInput(e.target.value)}} value={input} placeholder='Enter UserID' />
                    </Form>
                    </ListGroup.Item>
                    <input  id='inputDP'  style={{display:'none'}}  type="file" onChange={handleChangeDP} />
                    
                        <label htmlFor='inputDP'>
                         <ListGroup.Item style={{marginTop:-1,marginBottom:-10  }}  type='button' >Change Group Icon</ListGroup.Item>
                        </label>
                    
                    </>:<></>
                    }
                                    
                    <ListGroup.Item  type='button' onClick={deleteChat}>Delete Chat</ListGroup.Item>
                    <ListGroup.Item  type='button' onClick={exitGrp}>{item?.type==='group'?'Exit Group':'Remove Friend'} </ListGroup.Item>
                    </ListGroup>    
                    </div> 

                <Col xs={2} sm ={2} lg={1} className=' my-0 d-flex justify-content-center align-items-center' >
                        <button ref={buttonRef} onClick={()=>setDrop(!dropDown)} style={{border:0 ,outline:'none'}} >
                            <FontAwesomeIcon  className="fontawesome" color='#1e3050' icon={faEllipsisVertical} size='2xl' /> 
                        </button>
                    </Col>     
                    
        </Row>
    )
}

export default SelectedFriendDetails;