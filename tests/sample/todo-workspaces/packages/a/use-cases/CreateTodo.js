import { Service } from './Service';

@Service()
export class CreateTodo {
  constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }
  execute({ title }) {
    return this.todoRepository.create(title);
  }
}
