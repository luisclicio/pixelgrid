import { amqpClient } from '@/services/amqp';
import {
  ClassifyAction,
  ClassifyActionPayload,
} from './actions/classify.action';

async function main() {
  await amqpClient.setupChannel(async (channel) => {
    await channel.assertExchange('pixelgrid', 'topic', { durable: true });

    await channel.assertQueue('pixelgrid-images-classifier', { durable: true });
    await channel.bindQueue(
      'pixelgrid-images-classifier', // Queue
      'pixelgrid', // Exchange
      'pixelgrid.images' // Routing key
    );

    await channel.prefetch(1);
  });

  amqpClient.consumeFromQueue<ClassifyActionPayload>(
    'pixelgrid-images-classifier',
    async ({ data }) => {
      try {
        const { success, invalid } = await ClassifyAction.execute(data);
        const canAcknowledge = Boolean(success || invalid);
        return canAcknowledge;
      } catch (error) {
        console.error(error, 'Failed to process image');
        return false;
      }
    }
  );

  console.info('The service has started successfully');
}

async function gracefulShutdown(exitCode = 0) {
  try {
    await amqpClient.close();
  } finally {
    process.exit(exitCode);
  }
}

main().catch(async (error) => {
  console.error(error, 'Failed to start the service');
  await gracefulShutdown(1);
});

process.on('uncaughtException', async (error) => {
  console.error(error, 'Uncaught exception detected');
  await gracefulShutdown(1);
});

process.on('unhandledRejection', async (error) => {
  console.error(error, 'Unhandled promise rejection detected');
  await gracefulShutdown(1);
});

process.on('SIGINT', async () => {
  console.info('Received SIGINT signal');
  await gracefulShutdown();
});

process.on('SIGTERM', async () => {
  console.info('Received SIGTERM signal');
  await gracefulShutdown();
});
