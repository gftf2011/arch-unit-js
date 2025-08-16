'use strict';

require('../setup-aliases');

const { InMemoryTodoRepository } = require('#infra/repositories/InMemoryTodoRepository');
const { CreateTodo } = require('#usecases/CreateTodo');
const { GetAllTodos } = require('#usecases/GetAllTodos');

async function main() {
  const repo = new InMemoryTodoRepository();
  const createTodo = new CreateTodo(repo);
  const getAll = new GetAllTodos(repo);

  await createTodo.execute({ id: '1', title: 'Learn Clean Architecture' });
  await createTodo.execute({ id: '2', title: 'Write tests' });

  const todos = await getAll.execute();
  // eslint-disable-next-line no-console
  console.log(
    '[todos]',
    todos.map((t) => ({ id: t.id, title: t.title, completed: t.completed })),
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
