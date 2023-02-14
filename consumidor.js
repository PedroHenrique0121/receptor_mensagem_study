const amqp = require("amqplib")

const connect = amqp.connect({
  hostname: "localhost",
  port: 5672,
  username: "admin",
  password: "123"


});

module.exports = connect;