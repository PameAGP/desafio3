
const socket = io()

socket.on('mensaje1', (data) => {
console.log(data)
})