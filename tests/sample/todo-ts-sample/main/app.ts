import { v4 as uuidv4 } from 'uuid';
import { InMemoryTodoRepository } from '@/infra/repositories/InMemoryTodoRepository';
import { CreateTodo } from '@/use-cases/CreateTodo';
import { GetAllTodos } from '@/use-cases/GetAllTodos';
import { GetTodoById } from '@/use-cases/GetTodoById';
import { UpdateTodo, TodoUpdates } from '@/use-cases/UpdateTodo';
import { DeleteTodo } from '@/use-cases/DeleteTodo';
import { Todo, ITodo } from '@/domain/entities';
import { DeleteResult } from '../use-cases/DeleteTodo';

export class TodoApp {
  private todoRepository: InMemoryTodoRepository;
  private createTodo: CreateTodo;
  private getAllTodos: GetAllTodos;
  private getTodoById: GetTodoById;
  private updateTodo: UpdateTodo;
  private deleteTodo: DeleteTodo;

  constructor() {
    this.todoRepository = new InMemoryTodoRepository();
    this.createTodo = new CreateTodo(this.todoRepository);
    this.getAllTodos = new GetAllTodos(this.todoRepository);
    this.getTodoById = new GetTodoById(this.todoRepository);
    this.updateTodo = new UpdateTodo(this.todoRepository);
    this.deleteTodo = new DeleteTodo(this.todoRepository);
  }

  async create(title: string, description?: string): Promise<Todo> {
    return await this.createTodo.execute(title, description);
  }

  async getAll(): Promise<ITodo[]> {
    return await this.getAllTodos.execute();
  }

  async getById(id: string): Promise<ITodo> {
    return await this.getTodoById.execute(id);
  }

  async update(id: string, updates: TodoUpdates): Promise<Todo> {
    return await this.updateTodo.execute(id, updates);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.deleteTodo.execute(id);
  }
} 