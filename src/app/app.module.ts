import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './layout/header/header.component';
import {FooterComponent} from './layout/footer/footer.component';
import {MainComponent} from './layout/main/main.component';
import {TodoListComponent} from './todos/todo-list/todo-list.component';
import {EditTodoComponent} from './todos/edit-todo/edit-todo.component';
import {AddTodoComponent} from './todos/todo-list/add-todo/add-todo.component';
import {TodoItemComponent} from './todos/todo-list/todo-item/todo-item.component';
import {BtnComponent} from './ui/btn/btn.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    TodoListComponent,
    EditTodoComponent,
    AddTodoComponent,
    TodoItemComponent,
    BtnComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
