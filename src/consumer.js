const amqp = require('amqplib');
const Listener = require('./listener');
const MailSender = require('./MailSender');
const PlaylistsServices = require('./PlaylistsServices');

require('dotenv').config();

const init = async () => {
  const playlistsService = new PlaylistsServices();
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlists', {
    durable: true,
  });

  channel.consume('export:playlists', listener.listen, { noAck: true });
};

init();
