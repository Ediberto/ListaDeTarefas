// Seleção dos elementos do DOM
const inputTitleElement = document.querySelector(".new-task-title");
const inputDescriptionElement = document.querySelector(".new-task-description");
const addTaskButton = document.getElementById("add-task-button");
const updateTaskButton = document.getElementById("update-task-button");
const pesquisaTaskButton = document.getElementById("pesquisa-task-button");
const tasksContainer = document.querySelector('.tasks-container');
const errorMessageElement = document.querySelector('.error-message');

// Array para armazenar as tarefas (carregado do localStorage ou inicializado como um array vazio)
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Função para validar a entrada
const validateInput = () => {
  return inputTitleElement.value.trim().length > 0 && inputDescriptionElement.value.trim().length > 0;
};

// Função para verificar se a tarefa já existe
const checkIfTaskExists = (title) => {
  return tasks.find(task => task.title === title);
};

// Função para buscar tarefa por título
const findTaskByTitle = (title) => {
  return tasks.find(task => task.title === title);
};

// Função para criar um item de tarefa no DOM
const createTaskElement = (task) => {
  const taskItemContainer = document.createElement("div");
  taskItemContainer.classList.add("task-item");

  const taskContent = document.createElement("p");
  taskContent.innerText = `${task.title}: ${task.description}`;

  const taskInfo = document.createElement("div");
  taskInfo.classList.add("task-info");
  taskInfo.innerHTML = `Criado em: ${new Date(task.createdAt).toLocaleString()}<br>Status: ${task.status}`;

  const taskActions = document.createElement("div");
  taskActions.classList.add("task-actions");

  const deleteItem = document.createElement("i");
  deleteItem.classList.add("far", "fa-trash-alt");
  deleteItem.addEventListener('click', () => {
    taskItemContainer.remove();
    handleDeleteTask(task);
  });

  const inProgressButton = document.createElement("button");
  inProgressButton.classList.add("in-progress-button");
  inProgressButton.innerText = "Em Andamento";
  inProgressButton.addEventListener('click', () => handleUpdateStatus(task, "Em Andamento"));

  const completedButton = document.createElement("button");
  completedButton.classList.add("completed-button");
  completedButton.innerText = "Concluída";
  completedButton.addEventListener('click', () => handleUpdateStatus(task, "Concluída"));

  taskActions.appendChild(deleteItem);
  taskActions.appendChild(inProgressButton);
  taskActions.appendChild(completedButton);

  taskItemContainer.appendChild(taskContent);
  taskItemContainer.appendChild(taskInfo);
  taskItemContainer.appendChild(taskActions);

  tasksContainer.appendChild(taskItemContainer);
};

// Função para atualizar o localStorage com as tarefas atuais
const updateLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Função para adicionar uma nova tarefa
const handleAddTask = () => {
  if (!validateInput()) {
    errorMessageElement.innerText = "Preencha todos os campos!";
    errorMessageElement.style.display = "block";
    return;
  }

  const taskTitle = inputTitleElement.value.trim();
  const taskDescription = inputDescriptionElement.value.trim();

  if (checkIfTaskExists(taskTitle)) {
    errorMessageElement.innerText = "Tarefa já existe!";
    errorMessageElement.style.display = "block";
    return;
  }

  const newTask = {
    title: taskTitle,
    description: taskDescription,
    createdAt: Date.now(),
    status: "Pendente"
  };

  tasks.push(newTask);
  updateLocalStorage();
  createTaskElement(newTask);

  inputTitleElement.value = '';
  inputDescriptionElement.value = '';
  errorMessageElement.style.display = "none";
};

// Função para excluir uma tarefa
const handleDeleteTask = (taskToDelete) => {
  tasks = tasks.filter(task => task.title !== taskToDelete.title);
  updateLocalStorage();
};

// Função para atualizar o status da tarefa
const handleUpdateStatus = (task, newStatus) => {
  task.status = newStatus;
  updateLocalStorage();
  refreshTaskList();
};

// Função para limpar a lista de tarefas exibidas
const clearTaskList = () => {
  tasksContainer.innerHTML = '';
};

// Função para exibir todas as tarefas na lista
const refreshTaskList = () => {
  clearTaskList();
  tasks.forEach(task => createTaskElement(task));
};

// Função para pesquisar uma tarefa pelo título
const handleSearchTask = () => {
  const taskTitle = inputTitleElement.value.trim();

  if (!taskTitle) {
    errorMessageElement.innerText = "Digite o título da tarefa para pesquisa.";
    errorMessageElement.style.display = "block";
    return;
  }

  const task = findTaskByTitle(taskTitle);

  if (!task) {
    errorMessageElement.innerText = "Tarefa não encontrada.";
    errorMessageElement.style.display = "block";
    return;
  }

  inputDescriptionElement.value = task.description;
  errorMessageElement.style.display = "none";
};

// Função para atualizar a tarefa
const handleUpdateTask = () => {
  const taskTitle = inputTitleElement.value.trim();

  if (!validateInput()) {
    errorMessageElement.innerText = "Preencha todos os campos!";
    errorMessageElement.style.display = "block";
    return;
  }

  const task = findTaskByTitle(taskTitle);

  if (!task) {
    errorMessageElement.innerText = "Tarefa não encontrada para atualizar.";
    errorMessageElement.style.display = "block";
    return;
  }

  task.description = inputDescriptionElement.value.trim();
  updateLocalStorage();
  refreshTaskList();

  inputTitleElement.value = '';
  inputDescriptionElement.value = '';
  errorMessageElement.style.display = "none";
};

// Função para inicializar as tarefas
const initializeApp = () => {
  refreshTaskList();

  addTaskButton.addEventListener("click", handleAddTask);
  updateTaskButton.addEventListener("click", handleUpdateTask);
  pesquisaTaskButton.addEventListener("click", handleSearchTask);
};

// Inicializa o aplicativo
initializeApp();