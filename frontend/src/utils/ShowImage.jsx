import React, { useState } from 'react';
import { Container, Image } from 'react-bootstrap';
const ShowImage = ({ dp  , setDoc}) => {

  if (dp && dp !== "/alt-dp.jpg" ) {
  return <Image onClick ={()=>{setDoc(dp)} } fluid className='hoverImg Img' src={dp} alt='' />
    
  }return <Image fluid className='hoverImg Img' src="/alt-dp.jpg"  alt='' />
}

export default ShowImage;