const mockDelay = (ms = 100) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const STORAGE_KEY = 'todos';

export interface Todo {
  id: number;
  name: string;
  notes: string;
  complete: boolean;
}


const defaultTodos: Todo[] = [
  {
    id: 1,
    name: 'Build Todo App in Angular',
    notes: '',
    complete: true,
  },
  {
    id: 2,
    name: 'Build Todo App in React',
    notes: '',
    complete: false,
  },
  {
    id: 3,
    name: 'Build Todo App in Vue',
    notes: '',
    complete: false,
  },
];

export class ServerEndpoint {
  private static save(todos: Todo[]): void {
    console.log('[SAVE] Todos');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  private static load(): Todo[] {
    console.log('[LOAD] Todos');
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === null) {
      this.save(defaultTodos);
      return this.load();
    } else {
      return (JSON.parse(stored)) as Todo[];
    }
  }

  static async getTodos(): Promise<Todo[]> {
    await mockDelay();
    return this.load();
  }

  static async postTodo(todo: Todo): Promise<Todo | undefined> {
    const todos = this.load();

    const ids = todos
      .map(i => i.id)
      .filter(Boolean);
    const newId = Math.max(0, ...ids) + 1;

    todos.push({...todo, id: newId});
    this.save(todos);

    await mockDelay();
    return this.getTodo(newId);
  }

  static async getTodo(id: number): Promise<Todo | undefined> {
    const todos = this.load();

    await mockDelay();
    return todos.find(todo => todo.id === id);
  }

  static async patchTodo(todoId: number, data: Todo): Promise<Todo | undefined> {
    const todos = this.load();

    const index = todos.findIndex(todo => todo.id === todoId);
    todos[index] = {...data, id: todoId};
    this.save(todos);

    await mockDelay();
    return this.getTodo(todoId);
  }

  static async deleteTodo(todoId: number): Promise<Todo | undefined> {
    const todos = this.load();

    const index = todos.findIndex(todo => todo.id === todoId);
    const deletedTodo = todos[index];
    todos.splice(index, 1);
    this.save(todos);

    await mockDelay();
    return deletedTodo;
  }
}
