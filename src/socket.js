// socket.js (GLOBAL SOCKET INSTANCE)
import { io } from "socket.io-client";

const socket = io("https://medidost-backend.onrender.com", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

export default socket;
