import {Component, Output, EventEmitter} from '@angular/core';
import {ServerEndpoint, Todo} from '../../../../vendor/server-endpoint';
import {TodoService} from '../../../todo.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss'],
})
export class AddTodoComponent {
  @Output() todoAdded = new EventEmitter<Todo>();

  constructor(
    private todoService: TodoService,
  ) {}

  async addTodo(): Promise<void> {
    const todo = {
      id: 0,
      name: 'New Item',
      notes: '',
      complete: false,
    };

    this.todoService.addTodo(todo)
      .subscribe(newTodo => this.todoAdded.emit(newTodo));
  }
}
