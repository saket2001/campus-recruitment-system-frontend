import { io } from "socket.io-client";
///////////////////////
export const socket = io(process.env.NEXT_PUBLIC_DEV_SOCKET_SERVER);
///////////////////////
export const socketIoOperations = {
  sendTo: (receiver, emitKey, data) => {
    socket.to(receiver).emit(emitKey, data);
  },
  emitFn: (emitKey, data) => {
    socket.emit(emitKey, {
      ...data,
      socket_id: socket.id,
    });
  },
  receive: (receiveKey) => {
    let returnValue;
    socket.on("connection", (Socket) => {
      Socket.on(receiveKey, (...data) => {
        returnValue = data;
      });
    });
    return returnValue;
  },
};
