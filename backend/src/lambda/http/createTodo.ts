import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    var userId = getUserId(event);
    var newtodo = await createTodo(newTodo, userId);

    return {
      statusCode: 201,
      body: JSON.stringify(newtodo)
    }
  }
)

handler
.use(httpErrorHandler())
.use(
  cors({
    credentials: true
  })
)

// {
//   "item": {
  //    "todoId": "123",
  //    "createdAt": "2019-07-27T20:01:45.424Z",
  //    "name": "Buy milk",
  //    "dueDate": "2019-07-29T20:01:45.424Z",
  //    "done": false,
  //    "attachmentUrl": "http://example.com/image.png"
//    }
//  }
