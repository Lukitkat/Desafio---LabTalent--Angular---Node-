import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Todo } from './todo/todo';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Todo],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {

  protected title = 'todo-list';

}
