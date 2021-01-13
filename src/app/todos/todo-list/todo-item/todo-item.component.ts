import {Component, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {map, mergeMap, takeUntil, tap} from 'rxjs/operators';
import {Todo} from '../../../../vendor/server-endpoint';
import {TodoService} from '../../../todo.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
})
export class TodoItemComponent implements OnInit, OnDestroy {
  @Input() todo?: Todo;
  @HostBinding('class.active') active = false;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private todoService: TodoService,
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => parseInt(params.todoId)),
      map(todoId => todoId === this.todo?.id),
      takeUntil(this.unsubscribe$),
    ).subscribe(isActive => this.active = isActive);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  openTask(): void {
    if (!this.todo) { return; }
    this.router.navigate(['/todo', this.todo.id]);
  }

  async toggleDone(event: Event): Promise<void> {
    if (!this.todo) { return; }
    event.stopPropagation();

    this.todo.complete = !this.todo.complete;
    this.todoService.updateTodo(this.todo.id, this.todo)
      .subscribe(savedTodo => this.todo = savedTodo);
  }
}
