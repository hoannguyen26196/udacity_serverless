import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
    constructor(private readonly docClient: DocumentClient = new XAWS){

    }
    async createTodo(todo: TodoItem){
        return todo
    }

    async getTodos(userId: string){
        return 
    }

    async updateTodo(todoId: string, userId: string, model: TodoUpdate){
        return
    }

    async deleteTodo(odoId: string, userId: string){
        return
    }

    async updateAttachmentForTodo(todoId: string, userId :string, dbUrl :string){
        return
    }

}