import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  // Função para buscar tarefas
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Erro ao buscar tarefas', error);
    }
  };

  // Função para adicionar nova tarefa
  const addTask = async () => {
    const task = {
      task_id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description
    };

    try {
      await axios.post('http://localhost:5000/tasks', task);
      setNewTask({ title: '', description: '' });
      fetchTasks();
    } catch (error) {
      console.error('Erro ao adicionar tarefa', error);
    }
  };

  // Função para concluir uma tarefa
  const completeTask = async (task_id) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${task_id}/complete`);
      fetchTasks();
    } catch (error) {
      console.error('Erro ao concluir tarefa', error);
    }
  };

  // Função para remover uma tarefa
  const deleteTask = async (task_id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${task_id}`);
      fetchTasks();
    } catch (error) {
      console.error('Erro ao remover tarefa', error);
    }
  };

  return (
    <div className="App">
      <h1>Gerenciador de Tarefas</h1>

      <div className="new-task">
        <h2>Adicionar Nova Tarefa</h2>
        <input
          type="text"
          placeholder="Título"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          placeholder="Descrição"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <button onClick={addTask}>Adicionar Tarefa</button>
      </div>

      <div className="tasks-list">
        <h2>Lista de Tarefas</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task.task_id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.completed ? 'Concluída' : 'Pendente'}</p>
              <button onClick={() => completeTask(task.task_id)}>Concluir</button>
              <button onClick={() => deleteTask(task.task_id)}>Remover</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
