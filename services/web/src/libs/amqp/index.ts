import amqp, { type Connection, type Channel } from 'amqplib';

export type IBrokerConnectOptions = {
  host: string;
  port: number;
  username: string;
  password: string;
};

export type ISetupChannel<T = void> = (channel: Channel) => Promise<T>;

export type AmqpClientProps = {
  brokerConnectOptions: IBrokerConnectOptions;
};

export class AmqpClient {
  private logger = console;

  private connection!: Connection;
  private channel!: Channel;
  private connected = false;
  private brokerConnectOptions: IBrokerConnectOptions;

  constructor({ brokerConnectOptions }: AmqpClientProps) {
    this.brokerConnectOptions = brokerConnectOptions;
  }

  async connect() {
    if (this.connected && this.channel) {
      return;
    }

    try {
      this.logger.debug('Connecting to broker...');

      this.connection = await amqp.connect({
        hostname: this.brokerConnectOptions.host,
        port: this.brokerConnectOptions.port,
        username: this.brokerConnectOptions.username,
        password: this.brokerConnectOptions.password,
      });
      this.connected = true;

      this.logger.debug('Broker connection is ready');

      this.channel = await this.connection.createChannel();

      this.logger.debug('Created broker channel successfully');
    } catch (error) {
      this.logger.error(error, 'Failed to connect to broker');
      throw error;
    }
  }

  async close() {
    if (!this.connected) {
      return;
    }

    try {
      this.logger.debug('Disconnecting from broker...');

      await this.channel.close();
      await this.connection.close();

      this.connected = false;

      this.logger.debug('Broker connection is closed');
    } catch (error) {
      this.logger.error(error, 'Failed to disconnect from broker');
      throw error;
    }
  }

  async setupChannel<T = void>(callback: ISetupChannel<T>): Promise<T> {
    try {
      if (!this.channel) {
        await this.connect();
      }

      const result = await callback(this.channel);

      this.logger.debug('Broker channel is setup');

      return result;
    } catch (error) {
      this.logger.error(error, 'Failed to setup broker channel');
      throw error;
    }
  }

  async sendToQueue<T>(queue: string, data: T) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));

      this.logger.debug(`Sent message to queue: ${queue}`);
    } catch (error) {
      this.logger.error(error, `Failed to send message to queue: ${queue}`);
      throw error;
    }
  }

  async publishToExchange<T>(exchange: string, routingKey: string, data: T) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      this.channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(data))
      );

      this.logger.debug(`Published message to exchange: ${exchange}`);
    } catch (error) {
      this.logger.error(
        error,
        `Failed to publish message to exchange: ${exchange}`
      );
      throw error;
    }
  }

  async consumeFromQueue<T>(
    queue: string,
    handler: ({ data }: { data: T }) => Promise<boolean>
  ) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      this.channel.consume(
        queue,
        async (message) => {
          if (!message) {
            return;
          }

          this.logger.debug(`Received message from queue: ${queue}`);

          try {
            const data = JSON.parse(message.content.toString());
            const success = await handler({ data });

            if (success) {
              this.channel.ack(message);
            } else {
              this.channel.nack(message);
            }
          } catch (error) {
            this.logger.error(
              error,
              `Failed to handle message from queue: ${queue}`
            );
            this.channel.nack(message);
          }
        },
        { noAck: false }
      );
    } catch (error) {
      this.logger.error(
        error,
        `Failed to consume messages from queue: ${queue}`
      );
      throw error;
    }
  }
}
