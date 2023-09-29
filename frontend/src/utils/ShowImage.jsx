import React from 'react';
import { Image } from 'react-bootstrap';
import { port } from './io';
const ShowImage = ({ dp }) => {
  
  if (dp && dp !== "/alt-dp.jpg" ) {
  return <a href={port+'/file/'+dp} target="_blank">
      <Image fluid className='hoverImg Img' src={dp} alt='' />
    </a>
  }return <Image fluid className='hoverImg Img' src="/alt-dp.jpg"  alt='' />
}

export default ShowImage;