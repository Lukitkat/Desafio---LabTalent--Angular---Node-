import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  deleted: boolean;
  created_at: string;
}

@Injectable({

  providedIn: 'root'

})

export class TodoService{

  private apiUrl = 'http://localhost:8080/tasks';

  constructor(private http: HttpClient){ }

  // Buscar todas as tarefas
  getTasks(): Observable<Task[]>{

    console.log('Fazendo requisição GET para:', this.apiUrl);
    return this.http.get<Task[]>(this.apiUrl);

  }

  // Criar nova tarefa
  createTask(title: string): Observable<Task>{

    console.log('Fazendo requisição POST para:', this.apiUrl, 'com título:', title);
    return this.http.post<Task>(this.apiUrl, { title });

  }

  // Atualizar tarefa
  updateTask(id: number, updates: { title?: string; completed?: boolean }): Observable<Task>{

    console.log('Fazendo requisição PUT para:', `${this.apiUrl}/${id}`, 'com updates:', updates);
    return this.http.put<Task>(`${this.apiUrl}/${id}`, updates);

  }

  // Excluir tarefa
  deleteTask(id: number): Observable<any> {

    console.log('Fazendo requisição DELETE para:', `${this.apiUrl}/${id}`);
    return this.http.delete(`${this.apiUrl}/${id}`);

  }
  
} 