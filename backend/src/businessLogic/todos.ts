import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../fileStorage/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger("todos");
const todoAccess = new TodosAccess();
const attachmentUtils = new AttachmentUtils();

export async function createTodo(model: CreateTodoRequest, userId: string): Promise<TodoItem> {
    logger.info(`Request: ${JSON.stringify(model)}`);

    const newItem: TodoItem = {} as TodoItem;
    newItem.userId = userId;
    newItem.todoId = uuid.v4();
    newItem.createdAt = new Date().toISOString();
    newItem.name = model.name;
    newItem.dueDate = model.dueDate;
    newItem.done = false;
    logger.info(`Item: ${JSON.stringify(newItem)}`)

    return await todoAccess.createTodo(newItem);
}

export async function getTodosForUser(userId: string): Promise<any> {
    logger.info(`Get todo list`);

    return await todoAccess.getTodos(userId);
}

export async function updateTodo(todoId: string, userId: string, model: UpdateTodoRequest) {
    logger.info(`Update todo: ${todoId}`)

    await todoAccess.updateTodo(todoId, userId, model);
}

export async function deleteTodo(todoId: string, userId: string) {
    logger.info(`Delete todo: ${todoId}`);

    await todoAccess.deleteTodo(todoId, userId);
}

export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
    logger.info(`Create Url for with ${todoId}`)
    const url: string = attachmentUtils.getUrl(todoId);
    const attachmentUrl :string = attachmentUtils.getAttachmenttUrl(todoId);
    await todoAccess.updateAttachmentForTodo(todoId, userId, url);

    return attachmentUrl;
}


