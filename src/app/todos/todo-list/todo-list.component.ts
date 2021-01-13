import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Todo} from '../../../vendor/server-endpoint';
import {TodoService} from '../../todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];

  private unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private todoService: TodoService,
  ) { }

  ngOnInit(): void {
    this.todoService.getTodos().pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(todos => this.todos = todos);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  async todoAdded(todo: Todo): Promise<void> {
    await this.router.navigate(['/todo', todo.id]);
  }
}
