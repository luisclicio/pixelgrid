import { AmqpClient } from '@/libs/amqp';

export const amqpClient = new AmqpClient({
  brokerConnectOptions: {
    host: process.env.BROKER_HOST!,
    port: Number(process.env.BROKER_PORT!),
    username: process.env.BROKER_USER!,
    password: process.env.BROKER_PASSWORD!,
  },
});

async function setupChannel() {
  await amqpClient.setupChannel(async (channel) => {
    await channel.assertExchange('pixelgrid', 'topic', { durable: true });
  });
}

setupChannel();
