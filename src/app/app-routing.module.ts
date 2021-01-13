import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainComponent} from './layout/main/main.component';
import {EditTodoComponent} from './todos/edit-todo/edit-todo.component';

const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
      {path: 'todo/:todoId', component: EditTodoComponent},
    ],
  },
  {path: '**', redirectTo: '/'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
