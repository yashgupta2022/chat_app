import {Container, Card} from 'react-bootstrap';
import Content from './Content';

function MsgTemplate({obj , setDoc}) {
      if (obj.item.status === 'Received' ){
      return (<Container className="d-flex">
        <Card className="message received-message">
        {obj.type==='group'? <p className='received-header'>{obj.item.sendername}</p> : ''}
        <Content obj={obj.item} setDoc={setDoc}/>
        <p className="footer-right"> <i>{obj.item.timestamp} </i></p>  
          
        </Card>
        </Container>)
    }
    else { 
      return (<Container className="d-flex justify-content-end ">
        <Card className=" message sent-message ">
            <Content obj={obj.item} setDoc={setDoc} />
            <p className="footer-right"><i> {obj.item.timestamp} </i> <img style={{height:15,marginBottom:3, width:15}} src='/blue-tick.png' /></p>  
        </Card>
        </Container>)
    }
}  
export default MsgTemplate;
