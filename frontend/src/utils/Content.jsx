import { GoogleMap,  Marker } from '@react-google-maps/api';
import { Container } from 'react-bootstrap';

function Content({obj ,setDoc}){
  try{
    if (obj.msgType==='file'){
      
      if (obj.body.includes('.jpg') || obj.body.includes('.png') || obj.body.includes('.jpeg') ){
        return <img onClick = {()=>{setDoc(obj.body)}} className='hoverImg' src={obj.body} alt='' style={{width:'100%',maxWidth:'300px',maxHeight:'100%',padding:'5px'}}/>
      }
      else if (obj.body.includes('.pdf')){
        return(<div onClick = {()=>{setDoc(obj.body)}}  style={{display:'flex'}}>
        <img src='/PDF_icon.jpg' alt='' style={{width:40, marginTop:2,marginRight:10}}/>
        <p style={{color:'blue',fontSize:14,marginTop:10 }} className='footer-left' >{obj?.filename}</p></div>
      )}
      else if (obj.body.includes('.mp3') || obj.body.includes('.ogg') || obj.body.includes('.wav') ){
        return(<div >
        <p>{obj.filename}</p>
        <audio  controls color='rgb(220, 248, 198)'  style={{maxWidth:'100%'}}>
          <source src={obj.body} type="audio/mpeg"/>
          <source src={obj.body} type="audio/ogg"/>
          <source src={obj.body} type="audio/wav"/>
        </audio>
        </div >
        
      )}
      else if (obj.body.includes('.mp4') || obj.body.includes('.ogg') || obj.body.includes('.webm') ){
        return(
          <video controls style={{maxWidth:350, maxHeight:300, borderRadius:5}}>
            <source src={obj.body} type="video/mpeg" />
            <source src={obj.body} type="video/ogg" />
            <source src={obj.body} type="video/webm" />
          </video>
        );
      }
      
      else{
        return(<div onClick = {()=>{setDoc(obj.body)}}  style={{display:'flex'}}>
        <img src='/doc_icon.jpg' alt='' style={{width:40,marginTop:2, marginRight:10}}/>
        <p style={{color:'blue',fontSize:14,marginTop:10 }} className='footer-left' >{obj?.filename}</p></div>
      )}
  
    }

    else if (obj.body.includes('https://www.google.com/maps/place/')){
      let sep = obj.body.indexOf(',')  
      let lt = parseFloat(obj.body.substring(34,sep));
      let lg = parseFloat(obj.body.substring(sep+1));
      return <Container onClick={()=>window.open(obj.body)} style={{width:300, height:200, maxWidth:'100%' ,padding:5}}>
        <GoogleMap 
          mapContainerStyle={{width:'95%', height:'95%', borderRadius:5}}
          zoom={18}
          center={{lat: lt  , lng: lg }}
          options={{
            gestureHandling: 'none',
            zoomControl: false,
            fullscreenControl: false,
            alerts: false,
          }}
          >
          <Marker position={{lat: lt  , lng: lg }} />
        </GoogleMap>
      </Container>
    }
    else if (obj.body.includes('https://www.youtube.com/watch?v=')){
      return (<iframe style={{maxWidth:350, maxHeight:300, borderRadius:5}} src={`${obj.body.substring(0,24)}embed/${obj.body.substring(32 )}`}/>);
    }
    else if (obj.body.includes('www.') && obj.body.includes('.co')){
      return <a target="_blank" href = {obj.body}>{obj.body}</a>
    }
    else {return <p className='msgcontent'>{obj.body}</p> }
  }catch(err){
    console.log("Error Parsing Content" , err)
  }
  }

export default Content;

