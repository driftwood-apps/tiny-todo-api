const todos = [];
let nextId = 1;

export function listTodos() {
  return todos;
}

export function addTodo(title) {
  const todo = { id: nextId++, title, done: false };
  todos.push(todo);
  return todo;
}
