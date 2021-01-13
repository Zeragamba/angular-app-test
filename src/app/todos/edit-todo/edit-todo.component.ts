import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {debounce, debounceTime, map, mergeMap, takeUntil, tap} from 'rxjs/operators';
import {Todo} from '../../../vendor/server-endpoint';
import {TodoService} from '../../todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.scss'],
})
export class EditTodoComponent implements OnInit, OnDestroy {
  todo?: Todo;

  private unsubscribe$ = new Subject<void>();
  private changed$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService,
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => parseInt(params.todoId)),
      mergeMap(todoId => this.todoService.getTodo(todoId)),
      takeUntil(this.unsubscribe$),
    ).subscribe((todo) => this.todo = todo);

    this.changed$.pipe(
      tap(() => console.log('changed', this.todo)),
      debounceTime(500),
      takeUntil(this.unsubscribe$),
    ).subscribe(() => {
      if (!this.todo) { return; }
      console.log('save changes');
      this.todoService.updateTodo(this.todo.id, this.todo);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  delete(): void {
    if (!this.todo) { return; }
    this.todoService.deleteTodo(this.todo.id).pipe(
      mergeMap(() => this.router.navigate(['/'])),
    ).subscribe();
  }

  toggleDone(): void {
    if (!this.todo) { return; }

    this.todo.complete = !this.todo.complete;
    this.todoService.updateTodo(this.todo.id, this.todo)
      .subscribe(savedTodo => this.todo = savedTodo);
  }

  nameChanged(newValue: string): void {
    if (!this.todo) { return; }

    this.todo.name = newValue;
    this.changed$.next();
  }

  notesChanged(newValue: string): void {
    if (!this.todo) { return; }

    this.todo.notes = newValue;
    this.changed$.next();
  }
}
