import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { InMemoryTodoRepository } from '../../repositories/in-memory-todo.repository';
import { CreateTodo } from '../../use-cases/create-todo.usecase';
import { ListTodos } from '../../use-cases/list-todos.usecase';
import { GetTodo } from '../../use-cases/get-todo.usecase';
import { UpdateTodo } from '../../use-cases/update-todo.usecase';
import { DeleteTodo } from '../../use-cases/delete-todo.usecase';

@Module({
  controllers: [TodoController],
  providers: [
    InMemoryTodoRepository,
    CreateTodo,
    ListTodos,
    GetTodo,
    UpdateTodo,
    DeleteTodo,
  ],
})
export class TodoModule {} 