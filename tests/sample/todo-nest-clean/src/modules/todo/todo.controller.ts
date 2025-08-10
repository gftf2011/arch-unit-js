import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTodo } from '../../use-cases/create-todo.usecase';
import { ListTodos } from '../../use-cases/list-todos.usecase';
import { GetTodo } from '../../use-cases/get-todo.usecase';
import { UpdateTodo } from '../../use-cases/update-todo.usecase';
import { DeleteTodo } from '../../use-cases/delete-todo.usecase';
import { CreateTodoDto } from './todo.dto';

@Controller('todos')
export class TodoController {
  constructor(
    private readonly createTodo: CreateTodo,
    private readonly listTodos: ListTodos,
    private readonly getTodo: GetTodo,
    private readonly updateTodo: UpdateTodo,
    private readonly deleteTodo: DeleteTodo,
  ) {}

  @Post()
  async create(@Body() dto: CreateTodoDto) {
    return this.createTodo.execute({ title: dto.title });
  }

  @Get()
  async list() {
    return this.listTodos.execute();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.getTodo.execute({ id });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: CreateTodoDto) {
    return this.updateTodo.execute({ id, title: dto.title });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.deleteTodo.execute({ id });
    return { ok: true };
  }
} 