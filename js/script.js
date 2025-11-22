// script.js - TODO TACHE (stockage local)
(() => {
  const STORAGE_KEY = 'todo-tache-tasks';

  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');
  const countEl = document.getElementById('count');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const clearAllBtn = document.getElementById('clear-all');

  let tasks = [];

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function loadTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
  }

  function updateCount() {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    countEl.textContent = `${total} tâche${total !== 1 ? 's' : ''} — ${done} terminée${done !== 1 ? 's' : ''}`;
  }

  function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!task.done;
    checkbox.setAttribute('aria-label', `Marquer ${task.text} comme ${task.done ? 'non terminée' : 'terminée'}`);

    const span = document.createElement('div');
    span.className = 'text' + (task.done ? ' done' : '');
    span.textContent = task.text;

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn del';
    delBtn.title = 'Supprimer';
    delBtn.textContent = 'Supprimer';

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);

    return li;
  }

  function render() {
    list.innerHTML = '';
    if (tasks.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = "Aucune tâche pour l'instant. Ajoutez-en une !";
      list.appendChild(empty);
      updateCount();
      return;
    }

    tasks.forEach(task => {
      const el = createTaskElement(task);
      list.appendChild(el);
    });

    updateCount();
  }

  // Event handlers via delegation
  list.addEventListener('click', (e) => {
    const li = e.target.closest('li.task-item');
    if (!li) return;
    const id = Number(li.dataset.id);
    if (e.target.matches('input[type="checkbox"]')) {
      // toggle done
      tasks = tasks.map(t => t.id === id ? {...t, done: !t.done} : t);
      saveTasks();
      render();
    } else if (e.target.matches('.del')) {
      // delete
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      render();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const newTask = { id: Date.now(), text, done: false };
    tasks.unshift(newTask); // newest on top
    saveTasks();
    input.value = '';
    render();
    input.focus();
  });

  clearCompletedBtn.addEventListener('click', () => {
    const hadCompleted = tasks.some(t => t.done);
    tasks = tasks.filter(t => !t.done);
    if (hadCompleted) {
      saveTasks();
      render();
    }
  });

  clearAllBtn.addEventListener('click', () => {
    if (!confirm('Supprimer toutes les tâches ?')) return;
    tasks = [];
    saveTasks();
    render();
  });

  // initial load
  document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    render();
  });
})();
