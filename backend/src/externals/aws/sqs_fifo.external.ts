'use strict';

import {SQS, Request, AWSError} from 'aws-sdk';
import {EventEmitter} from 'events';

export abstract class QueueFifoService extends EventEmitter {
    abstract subscribe(): Promise<void>;
    abstract unsubscribe(): void;
    abstract ackMessage(messageId: string): Promise<void>;
}

export class SQSFifoQueueExternal extends QueueFifoService {
    private sqs: SQS;

    private receiveMessageRequest: Request<SQS.Types.ReceiveMessageResult, AWSError>;

    constructor() {
        super();
        this.sqs = new SQS({
            accessKeyId: <string>process.env.AWS_SQS_ACCESS_KEY_ID,
            secretAccessKey: <string>process.env.AWS_SQS_SECRET_ACCESS_KEY,
            region: process.env.AWS_SQS_REGION
        });
    }

    subscribe(): Promise<void> {
        console.debug(`Subscribing to queue: ${JSON.stringify(<string>process.env.AWS_SQS_TRANSACTION_QUEUE)}`);
        this.receiveMessage();
        return Promise.resolve(undefined);
    }

    unsubscribe(): void {
        console.debug(`Unsubscribing to queue: ${JSON.stringify(<string>process.env.AWS_SQS_TRANSACTION_QUEUE)}`);
        if (this.receiveMessageRequest !== null) {
            this.receiveMessageRequest.abort();
        }
    }

    removeAllMessages(): Promise<void> {
        console.debug(`Removing all messages from queue: ${JSON.stringify(<string>process.env.AWS_SQS_TRANSACTION_QUEUE)}`);
        return new Promise<void>((resolve, reject) => {
            const params = {
                QueueUrl: <string>process.env.AWS_SQS_TRANSACTION_QUEUE
            };

            this.sqs.purgeQueue(params, (err, data) => {
                if (err) {
                    console.error(`Error removing all messages: ${JSON.stringify(err)}`);
                    reject(new Error(`Error removing all messages: ${err.code} - ${err.message}`));
                } else {
                    console.info(`Successfully messages purged.`);
                    resolve();
                }
            });
        });
    }

    ackMessage(receiptHandle: string): Promise<void> {
        console.debug(`ACK Message: ${JSON.stringify(receiptHandle)}`);
        return new Promise<void>((resolve, reject) => {
            const params = {
                QueueUrl: <string>process.env.AWS_SQS_TRANSACTION_QUEUE,
                ReceiptHandle: receiptHandle
            };

            this.sqs.deleteMessage(params, (err, data) => {
                if (err) {
                    console.error(`Error deleting message: ${JSON.stringify(err)}`);
                    reject(new Error(`Error deleting message: ${err.code} - ${err.message}`));
                } else {
                    resolve();
                }
            });
        });
    }

    sendMessage(
        messageBody: string,
        messageDeduplicationId: string,
        messageGroupId: string
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.info(`Sending message to queue: ${JSON.stringify(<string>process.env.AWS_SQS_TRANSACTION_QUEUE)}`);

            const sqs = new SQS({
                region: process.env.AWS_SQS_REGION,
                credentials: {
                    accessKeyId: <string>process.env.AWS_SQS_ACCESS_KEY_ID,
                    secretAccessKey: <string>process.env.AWS_SQS_SECRET_ACCESS_KEY
                }
            });

            sqs.sendMessage({
                'QueueUrl': <string>process.env.AWS_SQS_TRANSACTION_QUEUE,
                'MessageBody': messageBody,
                'MessageDeduplicationId': messageDeduplicationId,
                'MessageGroupId': messageGroupId
            }, (err: any, data: any) => {
                if(err) {
                    console.error(`Error sending message: ${JSON.stringify(err)}`);
                    return reject(err);
                }
                console.info(`Successfully message sent.`);
                return resolve();
            });
        });
    }

    private receiveMessage() {
        const params = {
            QueueUrl: <string>process.env.AWS_SQS_TRANSACTION_QUEUE,
            WaitTimeSeconds: 1000,
            MaxNumberOfMessages: 1,
        };

        this.receiveMessageRequest = this.sqs.receiveMessage(params, (err, data) => {
            let repeat = true;

            if (err) {
                console.error(`Error receiving message: ${JSON.stringify(err)}`);
                if (err.code === 'RequestAbortedError') {
                    repeat = false;
                } else {
                    this.emit('error', new Error(`Error receiving message: ${err.code} - ${err.message}`));
                }
            } else if (data && data.Messages && data.Messages.length > 0) {
                console.debug(`Message received: ${JSON.stringify(data)}`);
                const message = this.convertMessage(data.Messages[0]);
                this.emit('message', message);
            }

            if (repeat) {
                process.nextTick(() => {
                    this.receiveMessage();
                });
            }
        });
    }

    private convertMessage(sqsMessage: SQS.Message): any {
        const message = <any>{};
        message.Body = JSON.parse(<any>sqsMessage.Body);
        message.ReceiptHandle = sqsMessage.ReceiptHandle;
        message.MessageId = sqsMessage.MessageId;
        return message;
    }
}