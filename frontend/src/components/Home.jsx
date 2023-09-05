
import {Container} from "react-bootstrap";
import NavBar from "../../src/utils/NavBar";
import CarouselHome from "../../src/utils/CarouselHome";

function Home({hide}) {
    return (<>
        <NavBar hide={hide} />
        <Container fluid className="home" >
            <h1 className="home-heading">CHAT-APP</h1>
            <h5 className="home-tagline"><i>Connect Together . . .   </i></h5>
            <CarouselHome />
        </Container>
        </>)
}

export default Home;
