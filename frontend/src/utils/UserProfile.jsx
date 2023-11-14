import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { port } from './io';
import axios from 'axios';

function UserProfile({dp}) {
    const {userid} = useParams();
    const [profile,setProfile] = useState({username:'',email:'',userid:''})

    const getprofile = async()=>{
        const response = await axios.post(port+'getuserprofile',{userid: userid})
        if (response.data!=='NotFound'){
            setProfile(response.data)
        }
    }
    useEffect(()=>{
        // getprofile();
    },[dp])

    return (
        <div style={{textAlign:'center'}}>
            <h6>User ID</h6>
            <p>{userid}</p>
            <h6>User Name</h6>
            <p>{profile.username}</p>
            <h6>Email</h6>
            <p>{profile.email}</p>
        </div>
    );
}
export default UserProfile;
