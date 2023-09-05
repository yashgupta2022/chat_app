
import axios from 'axios';
import { port } from './io';

export const datetime =()=>{
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  let d = new Date();
  let hrs = d.getHours();
  let min = d.getMinutes()<10?'0'+d.getMinutes() :d.getMinutes();
  let time  = (hrs>=12)? ((hrs===12)? ('12:'+min+' PM') : ((hrs-12)+':'+min+' PM')) :((hrs===0)?('12:'+min+' AM'):(hrs+':'+min+' AM'));
  const dt =days[d.getDay()] +", " + d.getDate()+"/"+(d.getMonth()+1)+"/"+(d.getFullYear()%100) +", "+ time;
  return dt
}


export const getRoom = (item,userid)=>{
  if (item?.type==='individual' ){return (userid.localeCompare(item.userid) ===-1) ? (userid + item.userid) :(item.userid + userid);}
  else if (item?.type==='group' ){return item.username }
  else {return ""}
}


export const getName = async(user)=>{
    const res = await axios.post(port + 'getName',{username:user})
    return res.data

}

export const getfriendList=async(userid)=>{
      
  var friendlist =[]
  var individualfriends =[]
  const response = await axios.post(port + 'friendList',{userid});
  if (response.data === 'Empty' ){
    friendlist =[{ userid:'', username:"No Friends Added" , type:'' , room:''}];
    individualfriends = [{ userid:'', username:"No Friends Added" , type:'' , room:''}]     
  }
  else{
    response.data.forEach(item=>{
        
        if (item.type==='individual'){
          let obj = {userid : item.names[0].userid , username:item.names[0].username , type:item.type,room:item.room }
          
          friendlist.push(obj)
          individualfriends.push(obj)
        }
        else if (item.type==='group'){
          let obj = {userid :'', username:item.room , type:item.type,room:item.room }
          friendlist.push(obj)
        }
    })
  }
  return {friendlist,individualfriends}
}

export const getMessages=  async(room,userid)=>{
  const obj ={userid , room}
  const response = await axios.post(port + 'showMsg', obj);
  if(response.data==='FAIL') {return []}
  return response.data
}


export const getLastMessage = async (item, userid) => {
  if (item.username !== 'No Friend Added') {
    const obj = { room: item.room, userid };
    const response = await axios.post(port + 'lastMsg', obj);
    return response.data;
  }
  return {};
};

export const handleDPChange = async(e,item)=>{
    const file =  e.target.files[0];
    if (file){
    if (['.jpg','.png','.jpeg'].some(i=>file.name.includes(i))){
      const data = new FormData();
      data.append('name',file.name)
      data.append('file',file)
      const response = await axios.post(port + 'uploadFile',data);
      const res  = await axios.post(port + 'setDP',{userid:item.userid, username:item.username , type:item.type,dp:response.data});
      return response.data 
    }else{alert ('Invalid Profile Picture Format... Acceptable formats (jpg, png) ')}
    return null
}}

  
  export const fetchDP = async (item) => {
    const response = await axios.post(port + 'fetchDP', item);
    if (response.data !== 'NotFound') {return response.data;}
    else {return '/alt-dp.jpg';}
  }

 

  export const onlineUsers = (item, users)=>{
      for (let user of users){
        if (user.userid===item.userid){
          return('Online')
        }
      }
      return 'Offline'
  }

    export const getallfriends=async(room)=>{
      const response = await axios.post(port + 'getGroupFriendList',{room:room})
      return response.data
    }


    export const getAllUsers = async()=>{
      const res = await axios.get(port + 'getAllUsers')
      return res.data      
    }

    export const updateFriendList =async (userid,room)=>{
      const res = await axios.post(port + 'updateFriendList',{userid,room})
    }
    

