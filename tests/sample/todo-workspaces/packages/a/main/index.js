import { InMemoryTodoRepository } from '@infra/InMemoryTodoRepository.js';
import { CreateTodo } from '@usecases/CreateTodo.js';
import { GetAllTodos } from '@usecases/GetAllTodos.js';

const repo = new InMemoryTodoRepository();
const createTodo = new CreateTodo(repo);
const getAllTodos = new GetAllTodos(repo);

function render() {
  const app = document.getElementById('app');
  const items = getAllTodos.execute();
  app.innerHTML = `
    <div>
      <h1>Todos</h1>
      <form id="todo-form">
        <input id="todo-title" placeholder="What needs to be done?" />
        <button>Add</button>
      </form>
      <ul>
        ${items.map((t) => `<li>${t.title}</li>`).join('')}
      </ul>
    </div>
  `;
  document.getElementById('todo-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('todo-title');
    const title = input.value.trim();
    if (title) {
      createTodo.execute({ title });
      input.value = '';
      render();
    }
  });
}

render();
