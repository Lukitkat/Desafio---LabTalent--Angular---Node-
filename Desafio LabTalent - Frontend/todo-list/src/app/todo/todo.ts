import { CommonModule } from '@angular/common';
import { Component, signal, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TodoService, Task } from './todo.service';

@Component({
  selector: 'app-todo',
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './todo.html',
  styleUrl: './todo.css'
})
export class Todo implements OnInit {

  count = signal<number>(0);
  taskArray: Task[] = [];
  loading = false;
  error = '';
  editingIndex: number | null = null;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    console.log('Componente inicializado');
    // Teste inicial sem requisição HTTP
    this.loading = false;
    this.taskArray = [];
    this.updateCount();
    console.log('Componente carregado com dados iniciais');
  }

  loadTasks() {
    console.log('Iniciando carregamento de tarefas');
    this.loading = true;
    this.error = '';
    
    this.todoService.getTasks().subscribe({
      next: (tasks) => {
        console.log('Tarefas carregadas:', tasks);
        this.taskArray = tasks;
        this.updateCount();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar tarefas:', error);
        this.error = 'Erro ao carregar tarefas. Verifique se o backend está rodando.';
        this.loading = false;
      }
    });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const title = form.controls['Nova Atividade'].value;
      
      this.todoService.createTask(title).subscribe({
        next: (newTask) => {
          this.taskArray.push(newTask);
          this.updateCount();
          form.reset();
          this.error = '';
        },
        error: (error) => {
          console.error('Erro ao criar tarefa:', error);
          this.error = 'Erro ao criar tarefa. Verifique se o título não está vazio.';
        }
      });
    }
  }

  updateCount() {
    this.count.update(() => this.taskArray.length);
  }

  onDelete(index: number) {
    const task = this.taskArray[index];
    
    this.todoService.deleteTask(task.id).subscribe({
      next: () => {
        this.taskArray.splice(index, 1);
        this.updateCount();
        this.error = '';
      },
      error: (error) => {
        console.error('Erro ao excluir tarefa:', error);
        this.error = 'Erro ao excluir tarefa.';
      }
    });
  }

  onEdit(index: number) {
    this.editingIndex = index;
  }

  onSave(index: number, newTaskName: string) {
    const task = this.taskArray[index];
    
    if (!newTaskName || newTaskName.trim() === '') {
      this.error = 'O título da tarefa não pode estar vazio.';
      return;
    }

    this.todoService.updateTask(task.id, { title: newTaskName }).subscribe({
      next: (updatedTask) => {
        this.taskArray[index] = updatedTask;
        this.editingIndex = null; // Sair do modo de edição
        this.error = '';
      },
      error: (error) => {
        console.error('Erro ao atualizar tarefa:', error);
        this.error = 'Erro ao atualizar tarefa.';
      }
    });
  }

  onCancel() {
    this.editingIndex = null;
  }

  onCheck(index: number, event: any) {
    const task = this.taskArray[index];
    const newCompletedStatus = event.target.checked;
    
    // Atualizar o estado local imediatamente para feedback visual
    this.taskArray[index] = { ...task, completed: newCompletedStatus };
    
    this.todoService.updateTask(task.id, { completed: newCompletedStatus }).subscribe({
      next: (updatedTask) => {
        this.taskArray[index] = updatedTask;
        this.error = '';
      },
      error: (error) => {
        console.error('Erro ao atualizar status da tarefa:', error);
        this.error = 'Erro ao atualizar status da tarefa.';
        // Reverter o estado em caso de erro
        this.taskArray[index] = { ...task, completed: !newCompletedStatus };
      }
    });
  }
}
