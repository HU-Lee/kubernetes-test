import io from 'socket.io-client';

// export const socket = io("https://covid19-hu-server.herokuapp.com", {
export const socket = io("http://127.0.0.1:51423", {
    path:'/ws/api/socket.io',
    autoConnect: false,
    reconnection: true,
    transports: ['websocket', 'polling']
});

socket.connect()