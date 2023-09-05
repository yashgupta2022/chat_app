
import {Carousel} from "react-bootstrap";
 

const CarouselHome = (props)=>{

    return (
        <Carousel indicators={false}  slide ={true}  controls={false} interval={2000}>
            <Carousel.Item>
                <img className="home-img" src="/CHAT-1-1.jpg" alt="First slide"/>
                <h4>Real-time Chat with Friends</h4>
            </Carousel.Item>
            <Carousel.Item >
                <img className="home-img" src="/Group-Chat.jpg" alt="Second slide"/>
                <h4>Group Chat with Friends</h4>
            </Carousel.Item>
            <Carousel.Item >
                <img className="home-img" src="/SHARE-EMOJI.jpg" alt="Third slide" />
                <h4 >Send Texts, Images and much more....   </h4>
            </Carousel.Item>
            </Carousel>

    )
}

export default CarouselHome;