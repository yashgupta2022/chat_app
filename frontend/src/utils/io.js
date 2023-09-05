import io from 'socket.io-client';


const CON_PORT = 'https://chatapp-backend-poxg.onrender.com/';

let socket;

export default socket= io(CON_PORT)
export const port = CON_PORT;