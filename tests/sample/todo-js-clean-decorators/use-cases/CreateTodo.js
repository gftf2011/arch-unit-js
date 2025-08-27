export function Service() {
  return function (target) {
    Object.defineProperty(target.prototype, '__service__', { value: true, enumerable: false });
  };
}

@Service()
export class CreateTodo {
  constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }
  execute({ title }) {
    return this.todoRepository.create(title);
  }
}
