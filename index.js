const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

//Midelware
app.use(express.static(__dirname + '/public'));
app.use(express.json()); // body-parser
app.use(express.urlencoded());


//Routes
const chatRoute = require("./routes/chat")
app.use("/api/chat", chatRoute);
const ptosTest = require("./routes/productosTest")
app.use("/api/productos-test", ptosTest);

//Servidor HTTP
const http = require("http");
const server = http.createServer(app);

//Servidor de Socket
const { Server } = require("socket.io");
const io = new Server(server);

io.on("connection", (socket)=> {
  socket.emit("render", "")
  
  socket.on("actualizacion", ()=>{
    io.sockets.emit("render", "")
  })
})


//Comienzo Servidor
server.listen(PORT, () => {
  console.log(`Server is run on port ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))