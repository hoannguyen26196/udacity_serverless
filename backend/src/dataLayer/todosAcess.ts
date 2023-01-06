import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient =  new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODO_TABLE,
    ){

    }
    async createTodo(todo: TodoItem){
        logger.debug('Create new todo');

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise();
  
        return todo as TodoItem;
    }

    async getTodos(userId: string){
        logger.debug('Getting all todos');

        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();

        return result.Items as TodoItem[];
    }

    async updateTodo(todoId: string, userId: string, model: TodoUpdate){
        logger.debug('Update todo');

        const params = {
            TableName: this.todosTable,
            Key: {
                todoId: todoId,
                userId: userId                
            },
            UpdateExpression: "set #todoName = :todoName, dueDate = :dueDate, done = :done",
            ExpressionAttributeNames: { '#todoName': "name" },
            ExpressionAttributeValues: {
                ":todoName": model.name,
                ":dueDate": model.dueDate,
                ":done": model.done
            },
            ReturnValues: "ALL_NEW"
        };

        const result = await this.docClient.update(params).promise();

        return result.Attributes as TodoItem;
    }

    async deleteTodo(todoId: string, userId: string): Promise<any>{
        console.log("Deleting todo");

        const params = {
            TableName: this.todosTable,
            Key: {
                todoId: todoId,
                userId: userId                
            },
        };

        return await this.docClient.delete(params).promise();
    }

    async updateAttachmentForTodo(todoId: string, userId :string, dbUrl :string): Promise<TodoItem>{
        logger.debug('Update attachment');

        const params = {
            TableName: this.todosTable,
            Key: {
                todoId: todoId,
                userId: userId                
            },
            UpdateExpression: "set attachmentUrl = :url",
            ExpressionAttributeValues: {
                ":url": dbUrl
            },
            ReturnValues: "ALL_NEW"
        };

        const result = await this.docClient.update(params).promise();

        return result.Attributes as TodoItem;

    }

}