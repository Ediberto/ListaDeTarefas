// Seleção dos elementos do DOM
const inputTitleElement = document.querySelector(".new-task-title");
const inputDescriptionElement = document.querySelector(".new-task-description");
const addTaskButton = document.querySelector(".new-task-button");
const tasksContainer = document.querySelector('.tasks-container');
const errorMessageElement = document.querySelector('.error-message');

// Array para armazenar as tarefas (carregado do localStorage ou inicializado como um array vazio)
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Função para validar a entrada
const validateInput = () => {
  return inputTitleElement.value.trim().length > 0 && inputDescriptionElement.value.trim().length > 0;
};

// Função para verificar se a tarefa já existe
const checkIfTaskExists = (title, description) => {
  return tasks.some(task => task.title === title && task.description === description);
};

// Função para adicionar uma nova tarefa
const handleAddTask = () => {
  const inputIsValid = validateInput();
  if (!inputIsValid) {
    inputTitleElement.classList.add("error");
    inputDescriptionElement.classList.add("error");
    return;
  }

  const title = inputTitleElement.value;
  const description = inputDescriptionElement.value;

  // Verifica se a tarefa já existe
  if (checkIfTaskExists(title, description)) {
    errorMessageElement.textContent = "Tarefa já existe!";
    errorMessageElement.style.display = "block";
    return; // Não adiciona a tarefa se já existir
  }

  // Limpa a mensagem de erro, caso exista
  errorMessageElement.style.display = "none";

  const task = {
    title: title,
    description: description,
    createdAt: new Date().toISOString(),
    status: 'pendente',
    completedAt: null,
  };

  // Adiciona a tarefa ao array de tarefas
  tasks.push(task);

  // Cria o elemento da tarefa no DOM
  createTaskElement(task);

  // Limpa os campos
  inputTitleElement.value = '';
  inputDescriptionElement.value = '';
  inputTitleElement.classList.remove("error");
  inputDescriptionElement.classList.remove("error");

  // Atualiza o localStorage com o array de tarefas atualizado
  updateLocalStorage();
};

// Função para criar um item de tarefa no DOM
const createTaskElement = (task) => {
  const taskItemContainer = document.createElement("div");
  taskItemContainer.classList.add("task-item");

  const taskContent = document.createElement("p");
  taskContent.innerText = `${task.title}: ${task.description}`;

  const taskInfo = document.createElement("div");
  taskInfo.classList.add("task-info");
  taskInfo.innerHTML = `
    Criado em: ${new Date(task.createdAt).toLocaleString()}<br>
    Status: ${task.status}
  `;

  // Adicionar status completado se já estiver concluído
  if (task.status === 'concluída') {
    taskInfo.innerHTML += `<br> Concluído em: ${new Date(task.completedAt).toLocaleString()}`;
  }

  // Container para os botões e o ícone de exclusão
  const taskActions = document.createElement("div");
  taskActions.classList.add("task-actions");

  // Ícone de excluir
  const deleteItem = document.createElement("i");
  deleteItem.classList.add("far", "fa-trash-alt");
  deleteItem.addEventListener('click', () => {
    taskItemContainer.remove();
    handleDeleteTask(task);
  });

  // Botão "Em Andamento"
  const inProgressButton = document.createElement("button");
  inProgressButton.classList.add("in-progress-button");
  inProgressButton.innerText = "Em Andamento";
  inProgressButton.addEventListener("click", () => {
    handleInProgressTask(task, taskContent, taskInfo, taskItemContainer);
  });

  // Botão "Concluída"
  const completedButton = document.createElement("button");
  completedButton.classList.add("completed-button");
  completedButton.innerText = "Concluída";
  completedButton.addEventListener("click", () => {
    handleCompleteTask(task, taskContent, taskInfo, taskItemContainer);
  });

  // Adicionando ícones e botões ao container das ações
  taskActions.appendChild(deleteItem);
  taskActions.appendChild(inProgressButton);
  taskActions.appendChild(completedButton);

  // Adicionando o conteúdo, informações e o container das ações
  taskItemContainer.appendChild(taskContent);
  taskItemContainer.appendChild(taskInfo);
  taskItemContainer.appendChild(taskActions); // Adicionando o container de ações

  tasksContainer.appendChild(taskItemContainer);
};

// Função para atualizar o status e o DOM após a alteração
const updateTaskInDOM = (task, taskItemContainer, taskContent, taskInfo) => {
  taskItemContainer.querySelector("p").innerText = `${task.title}: ${task.description}`;
  taskItemContainer.querySelector(".task-info").innerHTML = `
    Criado em: ${new Date(task.createdAt).toLocaleString()}<br>
    Status: ${task.status}
  `;
  if (task.status === 'concluída') {
    taskItemContainer.querySelector(".task-info").innerHTML += `<br> Concluído em: ${new Date(task.completedAt).toLocaleString()}`;
  }
};

// Função para marcar a tarefa como "Em Andamento"
const handleInProgressTask = (task, taskContent, taskInfo, taskItemContainer) => {
  task.status = 'em andamento';
  taskInfo.innerHTML = taskInfo.innerHTML.replace(/Status: \w+/, `Status: ${task.status}`);
  updateLocalStorage();
  updateTaskInDOM(task, taskItemContainer, taskContent, taskInfo); // Atualiza o DOM
};

// Função para marcar a tarefa como "Concluída"
const handleCompleteTask = (task, taskContent, taskInfo, taskItemContainer) => {
  task.status = 'concluída';
  task.completedAt = new Date().toISOString();
  
  taskInfo.innerHTML = taskInfo.innerHTML.replace(/Status: \w+/, `Status: ${task.status}`);
  taskInfo.innerHTML += `<br> Concluído em: ${new Date(task.completedAt).toLocaleString()}`;

  // Atualizar o título para não ser riscado
  taskContent.classList.remove("completado");

  updateLocalStorage();
  updateTaskInDOM(task, taskItemContainer, taskContent, taskInfo);  // Atualiza o DOM
};

// Função para atualizar o localStorage com as tarefas atuais
const updateLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Função para carregar as tarefas do localStorage e renderizá-las na página
const loadTasksFromLocalStorage = () => {
  tasks.forEach(task => createTaskElement(task));
};

// Função para remover a tarefa
const handleDeleteTask = (taskToDelete) => {
  tasks = tasks.filter(task => task.title !== taskToDelete.title || task.description !== taskToDelete.description);
  updateLocalStorage();
};

// Carregar as tarefas ao carregar a página
window.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

// Adicionando os eventos
addTaskButton.addEventListener("click", handleAddTask);
