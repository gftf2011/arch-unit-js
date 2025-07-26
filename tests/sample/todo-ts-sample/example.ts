import { TodoApp } from '@/app';

async function runExample(): Promise<void> {
  const app = new TodoApp();

  console.log('=== Todo App Example ===\n');

  try {
    // Create todos
    console.log('1. Creating todos...');
    const todo1 = await app.create('Buy groceries', 'Milk, bread, eggs');
    const todo2 = await app.create('Call dentist', 'Schedule appointment');
    console.log('Created:', todo1.title, '-', todo2.title);

    // Get all todos
    console.log('\n2. Getting all todos...');
    const allTodos = await app.getAll();
    console.log('All todos:', allTodos.length);

    // Get specific todo
    console.log('\n3. Getting specific todo...');
    const todo = await app.getById(todo1.id);
    console.log('Found todo:', todo.title);

    // Update todo
    console.log('\n4. Updating todo...');
    const updatedTodo = await app.update(todo1.id, { 
      title: 'Buy groceries and medicine',
      completed: true 
    });
    console.log('Updated:', updatedTodo.title, '- Completed:', updatedTodo.completed);

    // Delete todo
    console.log('\n5. Deleting todo...');
    const deleteResult = await app.delete(todo2.id);
    console.log('Deleted todo with ID:', todo2.id, '-', deleteResult.message);

    // Show final state
    console.log('\n6. Final todos...');
    const finalTodos = await app.getAll();
    console.log('Remaining todos:', finalTodos.length);

  } catch (error) {
    console.error('Error:', (error as Error).message);
  }
}

runExample(); 