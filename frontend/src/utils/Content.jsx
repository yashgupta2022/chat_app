import { port } from "./io"
function Content({obj}){
    if (obj.msgType==='file'){
      
      if (obj.body.includes('.jpg') || obj.body.includes('.png') || obj.body.includes('.jpeg') ){
        return <a href ={obj.body} target="_blank">
          <img className='hoverImg' src={port+'/file/'+obj.body} alt='' style={{width:'100%',maxWidth:'300px',height:'100%',padding:'5px'}}/></a>
      }
      else if (obj.body.includes('.pdf')){
        return(<div style={{display:'flex'}}>
        <img src='/PDF_icon.jpg' alt='' style={{width:40, marginTop:2,marginRight:10}}/>
        <a target="_blank" style={{color:'blue',fontSize:14,marginTop:10 }} className='footer-left' href = {port+'/file/'+obj.body}>{obj?.filename}</a></div>
      )}
      else{
        return(<div style={{display:'flex'}}>
        <img src='/doc_icon.jpg' alt='' style={{width:40,marginTop:2, marginRight:10}}/>
        <a target="_blank" style={{color:'blue',fontSize:14,marginTop:10 }} className='footer-left' href = {port+'/file/'+obj.body}>{obj?.filename}</a></div>
      )}
  
    }
    else {
      return <p className='msgcontent'>{obj.body}</p> }
  }

export default Content;