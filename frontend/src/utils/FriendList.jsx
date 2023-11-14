import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {Col, Container, Form, Image, ListGroup, Row } from 'react-bootstrap';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faPaperPlane, faPenToSquare} from '@fortawesome/free-solid-svg-icons'

import socket from '../utils/io';
import FriendInfo from './FriendInfo'
import ShowImage from './ShowImage';
import { handleDPChange ,getRoom, fetchDP} from './API';
import { port } from '../utils/io';
import UserProfile from './UserProfile';
const FriendList =({item,setItem,friendList,individualFriends,showMessages,showfriendList,
  handleLogout,resultantUsers,setShow , setDoc})=>{
    const {userid} =useParams();
    const [input,setInput] = useState('')
    const [search,setSearch] = useState('')
    const [isOpen,setOpen] = useState(1);
    const [dropDown,setDrop] = useState(true);
    const [room,setRoom] =useState('');
    const [group,setGroup] = useState([]);
    const[disable,setDisable] =useState(false); 
    const [searchList,setSearchList] =  useState([friendList])
    const [addList,setAddList] =  useState([resultantUsers])
    const [dp,setDP] =useState('/alt-dp.jpg')
    const buttonRef = useRef(null)


    const filterBySearch = (event) => {
      const query = event.target.value;
      setSearch(query)
      var updatedList = [...friendList];
      updatedList = updatedList.filter((item) => {
        return item.username.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
      setSearchList(updatedList);
    };
    useEffect(()=>{setSearchList(friendList)  },[friendList])

    
    const Add_filterSearch = (event) => {
      const query = event.target.value;
      setInput(query)
      var updatedList = [...resultantUsers];
      updatedList = updatedList.filter((item) => {
        return item.username.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
      setAddList(updatedList);
    };
    useEffect(()=>{setAddList(resultantUsers) },[resultantUsers])
    



  const resetSidebar =()=>{
        setGroup([]); 
        setRoom('');
        setInput('')
        setSearch('')
  }
  useEffect(()=>{ showfriendList();} ,[isOpen])

  const getDP =async ()=>{
      const data = await fetchDP ({userid, type:'individual'})
      setDP(data)
  }
  useEffect(()=>{getDP()},[])
  const handleChangeDP = async(e)=>{
      const data = await handleDPChange(e,{userid,type:'individual'})
      if (data) {
          setDP(data)
          socket.emit('updateDP')
      }
      setDrop(true)
  }

  const handleClick = (i) =>{
      if (i.username!=='No Friends Added'){
      let room = getRoom(i,userid);
      showMessages(room);    
      setItem({...i,room:room})
      setShow(false )
    }
  }

  const handleCheckBox = async (friend)=>{
      setGroup((prev) => {
        if (prev.some(item => item === friend.userid)){return prev.filter((i) => friend.userid!== i);}
        else {return [...prev, friend.userid];}
      });
    }
  
    

    

  const addFriend = async(friend)=>{
    if (!disable) {
      setDisable(true);
      setTimeout(async() => {
        // Check Friend in FriendDB
        const response = await axios.post(port+'check-friend',{userid : friend.userid})
          if (response.data==="success"){
              // Add Friend in FriendDB -> user->friend  and friend->user
              let room  = getRoom({...friend,type:'individual'} ,userid)
              const obj = {type:'individual', room , friendList : [friend.userid,userid] };
              const response2 = await axios.post(port+'add-friend',obj)
              if (response2.data==="success"){
                setOpen(1)
                socket.emit('show-friendlist', obj.friendList)
              }
            }
        setDisable(false);
      }, 2000);
    }
      
  }

    const handleGroupSubmit = async (e)=>{
      e.preventDefault();
      if (group.length===0){alert('Group must not be empty')}
      else if (room==='') alert ('Group must have a name')

      else { //Group name must be Unique
        const response =await axios.post(port+'check-group-name',{group: room})
        if (response.data==="fail"){ alert("Enter Unique Group Name") }
        else{
          const obj = {room:room , friendList : [...group,userid] ,type : 'group'};
          const response2 = await axios.post(port+'add-friend',obj)
            if (response2.data==="success"){
              setOpen(1)
              showfriendList()
              socket.emit('show-friendlist', obj.friendList)
            }
        }
      }
      setGroup([])
      setRoom('')
      setDisable(false);
  }  

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target))
       {setDrop(true);}
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {document.removeEventListener('click',handleOutsideClick);};
  }, []);


  return (<>
        <Row className='no-gutters'>
            <Col className='Display-friendInfo'>
                <Row className='no-gutters' >
                    <Col xs={3} sm={4} md={3}  style={{paddingLeft:10}}>
                    <ShowImage dp={dp} setDoc={setDoc} />
                    </Col>
                    <Col xs ={7} sm ={6} md={7} onClick ={()=>{if (isOpen===4){setOpen(1)} else{setOpen(4)}}}></Col>
                    <Col xs={2}  className=' my-0 d-flex justify-content-center align-items-center' >
                        <button ref={buttonRef} onClick={()=>setDrop(!dropDown)} style={{border:0 ,outline:'none'}} >
                            <FontAwesomeIcon className="fontawesome" color='#1e3050' icon={faEllipsisVertical} size='2xl' /> 
                        </button>
                            <div hidden={dropDown}  >
                            <ListGroup  className='dropDown' style={{ maxWidth:'400%'}}>
                            {isOpen!==4 ?<ListGroup.Item type='button' onClick = {()=>setOpen(4)}>View Profile</ListGroup.Item>:<></>}
                            {isOpen===1?<>
                                <ListGroup.Item  onClick={()=>{resetSidebar();setOpen(3)}}>New Friend</ListGroup.Item>
                                <ListGroup.Item  onClick={()=>{resetSidebar();setOpen(2)}}>New Group</ListGroup.Item>
                                </>
                            :<></>}
                            {isOpen===2?<>
                                <ListGroup.Item  onClick={()=>{resetSidebar();setOpen(1)}}>Search Friend</ListGroup.Item>
                                <ListGroup.Item  onClick={()=>{resetSidebar();setOpen(3)}}>New Friend</ListGroup.Item>
                                </>
                            :<></>}
                            {isOpen===3?<>
                                <ListGroup.Item  onClick={()=>{resetSidebar();setOpen(1)}}>Search Friend</ListGroup.Item>
                                <ListGroup.Item  onClick={()=>{resetSidebar();setOpen(2)}}>New Group</ListGroup.Item>
                                </>
                            :<></>}
                            
                            {isOpen===4 ?<>
                              <ListGroup.Item  onClick={()=>{resetSidebar();setOpen(1)}}>Search Friend</ListGroup.Item>
                              <ListGroup.Item  onClick={()=>{resetSidebar();setOpen(3)}}>New Friend</ListGroup.Item>
                              <ListGroup.Item  onClick={()=>{resetSidebar();setOpen(2)}}>New Group</ListGroup.Item>
                            </>  : <></>}
                               
                                <ListGroup.Item type='button' onClick={handleLogout}>LogOut</ListGroup.Item>
                            </ListGroup>
                            </div>
        
                    </Col>
                </Row>
            </Col>
        </Row>
    

    {/* SEARCH FRIEND LIST */}
    
    <div  hidden={isOpen===1?false:true} >  
        <div style={{height:50,padding:6,backgroundColor:'gray'}} >
        <input className='form-control' type="text" placeholder ="Search a Friend" onChange={filterBySearch}  value={search}/>
        </div>
        
        <Container className='px-0 scrollable-list'>
            {searchList.length===0?<FriendInfo isOpen={isOpen} setDoc={setDoc} item={{username:'No Friends Added', type:'' , userid:'' , room:''}} />
            :searchList.slice(0).reverse().map((item,index) =>
            <div type='button'  className='list-group-item-action  editFriendHover'  onClick={()=>{handleClick(item)}}  
                key = {index}  style={{height:80,padding:10, borderBottom:'1px lightgray solid '}}>
                <FriendInfo isOpen={isOpen} setDoc={setDoc} item={item} />
            </div>)}
      </Container>
    
    </div>
                              



    {/* CREATE GROUP  */}
    <div hidden={isOpen===2?false:true}>
        <Form style={{height:50,padding:6,backgroundColor:'gray'}}   disabled={disable} onSubmit ={handleGroupSubmit} >
            <Row className='no-gutters'> 
            <Col xs={10}><Form.Control  type="text" autocomplete="off" value={room}
            name='room' onChange={(e)=>{setRoom(e.target.value)}} placeholder ="Enter Group Name" /></Col>

            <Col xs={2} style={{ color:'white'}} className='d-flex justify-content-center align-items-center' onClick={handleGroupSubmit}>
              <FontAwesomeIcon type='button' className='fontawesome'  size='2xl' icon={faPaperPlane}  /></Col>
          </Row>
            
            <Container style={{width:'100%'}} className='px-0 mx-0 scrollable-list '>
             
          {individualFriends.length===0?<FriendInfo isOpen={isOpen} setDoc={setDoc} item={{username:'No Friends Added', type:'' , userid:'' , room:''}} />
          :individualFriends.slice(0).reverse().map((item,index) =>
            <div key={index} type='button' className='list-group-item d-flex' style={{height:80, borderBottom:'1px lightgray solid '}} 
              onClick= {()=>{handleCheckBox(item);}}>
              <FriendInfo isOpen={isOpen} setDoc={setDoc} item={item} />
              <Form.Check style={{paddingRight:'10%',marginTop:10 }}  onClick={(e) => { e.stopPropagation(); }}
              onChange={() => { handleCheckBox(item); }} checked={group.some(i => i===item.userid)}
              type='switch' label=''/> 
            </div>)}
         
            </Container>
        </Form>
    </div>


    {/* ADD-FRIENDLIST */}
    <div  hidden={isOpen===3?false:true} >  
        <div style={{height:50,padding:6,backgroundColor:'gray'}} >
        <input className='form-control' type="text" placeholder = "Add a Friend" onChange={Add_filterSearch} value={input} />
        </div>
        <Container className='px-0 scrollable-list'>
        {addList.length!==0?
           (addList).slice(0).reverse().map((item,index) =>
            <div type='button' disabled={disable} className='list-group-item-action  editFriendHover'  onClick={()=>{addFriend(item)}}
            key = {index}  style={{height:80,padding:10, borderBottom:'1px lightgray solid '}}>
                <FriendInfo isOpen={isOpen} setDoc={setDoc} item={{userid:item.userid, username:item.username , type:'individual' , room:getRoom(item.userid,userid)}} />
              </div>) : 
              <FriendInfo isOpen={isOpen} setDoc={setDoc} item={{username:'No Friends Added', type:'' , userid:'' , room:''}} />}
          
      </Container>
    
    </div>


    {/* USER PROFILE */}
    <div  hidden={isOpen===4?false:true} >  
        <Container style={{position:'absolute', bottom:0, top:60,overflow:'scroll'}}>
          <Row style={{paddingTop:20 , justifyContent:'center'}}>
            <Image  type='button' src={dp} style={{boxShadow: '0 1px 8px lightgrey' ,borderRadius:'50%',maxWidth:'100%', height:200,width:200}} onClick ={()=>{setDoc(dp)} } alt = "/alt-dp.jpg"/>
            <input type="file" id="dpChange" style={{ display: "none" }} onChange={handleChangeDP}/>
              <label htmlFor="dpChange">
              <FontAwesomeIcon type='button' icon={faPenToSquare} />
              </label>
          </Row>
          <Row className='d-flex justify-content-center' style={{ margin:'10px 5px 0 5px' ,fontSize:15}}>
            <UserProfile dp={dp}/>
          </Row>
        </Container>
      
    
    </div>



    </>
    )
}
export default FriendList;