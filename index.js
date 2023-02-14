
const app = require("express")();
const server = require("http").Server(app);
let sala;


const io = require("socket.io")
(server, {
  cors: {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST']
  }
})

const connect = require('./consumidor');
const fila = "users.v1.user.created-notification"

// funiconalidade que consome mensagem da fila rabbit mq da api
function escutar(connect, evento, socket, nameRoom) {
  connect.then((connection) => {
    connection.createChannel()
      .then((channel) => {
        channel.consume(fila, (mensagem) => {
          //envia memsagem para o front-end
          socket.to(nameRoom).emit(evento, mensagem.content.toString())
        }, { noAck: true })
      })
  })
    .catch((error) => {
      console.log(error);
    })
}

app.get("/", (req, res) => {

});

// recebe a conexão e junta os dispositivos conectados
io.on("connection", (socket) => {
  const id = socket.id;
  const { nameRoom } = socket.handshake.query;
  sala = nameRoom;

  socket.join(sala);
  
  escutar(connect, "evento", socket, nameRoom);

})

server.listen(3000, () => {
console.log("servidor executando na porta 3000, aceitando conexões!")
})

