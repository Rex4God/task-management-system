"use strict";
const amqp = require("amqplib");
const logger = require("../app/utils/logger");

const log = logger();

exports.sendTaskToQueue = async (task) => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI || "amqp://localhost");
    process.once("SIGINT", () => {
      connection.close();
    });

    const channel = await connection.createChannel();
    const exchange = "TaskExchange";
    const queue = "Task";

    await channel.assertExchange(exchange, "direct", {
      durable: true,
    });

    await channel.assertQueue(queue, {
      exclusive: false,
      durable: true,
      autoDelete: false,
      arguments: {
        "x-queue-type": "stream",
        "x-max-length-bytes": 2_000_000_000,
      },
    });

    await channel.bindQueue(queue, exchange, ""); 

    await channel.sendToQueue(queue, Buffer.from(task));
    log.info(`Task Sent:${task}`);

    await channel.close();
    await connection.close();
  } catch (e) {
    log.error(e);
  }
};

async function consumer() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI || "amqp://localhost");
    process.once("SIGINT", connection.close);

    const channel = await connection.createChannel();
    const exchange = "TaskExchange";
    const queue = "Task";

    await channel.assertExchange(exchange, "direct", {
      durable: true,
    });

    await channel.assertQueue(queue, {
      exclusive: false,
      durable: true,
      autoDelete: false,
      arguments: {
        "x-queue-type": "stream",
        "x-max-length-bytes": 2_000_000_000,
      },
    });

    channel.qos(50);

    channel.bindQueue(queue, exchange, ""); 

    channel.consume(
      queue,
      (msg) => {
        log.info(`Task Received: ${msg.content.toString()}`);
        channel.ack(msg);
      },
      {
        noAck: false,
        arguments: {
          "x-stream-offset": "first",
        },
      }
    );

    console.log(" [*] Waiting for messages. To exit press CTRL+C");
  } catch (e) {
    logger.error(e);
  }
}

consumer();
