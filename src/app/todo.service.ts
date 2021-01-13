import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map, take, tap} from 'rxjs/operators';
import {ServerEndpoint, Todo} from '../vendor/server-endpoint';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly todos$: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);

  constructor() {
    fromPromise(ServerEndpoint.getTodos())
      .subscribe(todos => this.todos$.next(todos));
  }

  getTodos(): Observable<Todo[]> {
    return this.todos$;
  }

  addTodo(todo: Todo): Observable<Todo | undefined> {
    return fromPromise(ServerEndpoint.postTodo(todo)).pipe(
      tap(newTodo => {
        if (newTodo) {
          this.todos$.pipe(take(1)).subscribe(todos => {
            todos.push(newTodo);
            this.todos$.next(todos);
          });
        }
      }),
    );
  }

  getTodo(todoId: number): Observable<Todo | undefined> {
    return this.todos$.pipe(
      map(todos => todos.find(todo => todo.id === todoId)),
    );
  }

  updateTodo(todoId: number, todo: Todo): Observable<Todo | undefined> {
    return fromPromise(ServerEndpoint.patchTodo(todoId, todo)).pipe(
      tap(updatedTodo => {
        if (updatedTodo) {
          this.todos$.pipe(take(1)).subscribe(todos => {
            const index = todos.findIndex(todo => todo.id === updatedTodo.id);
            todos[index] = updatedTodo;
            this.todos$.next(todos);
          });
        }
      }),
    );
  }

  deleteTodo(todoId: number): Observable<Todo | undefined> {
    return fromPromise(ServerEndpoint.deleteTodo(todoId)).pipe(
      tap(updatedTodo => {
        if (updatedTodo) {
          this.todos$.pipe(take(1)).subscribe(todos => {
            const index = todos.findIndex(todo => todo.id === updatedTodo.id);
            todos.splice(index, 1);
            this.todos$.next(todos);
          });
        }
      }),
    );
  }
}
