// 1. Selecionar os elementos HTML.
let loginForm = document.getElementById("loginForm");
let loginSection = document.getElementById("loginSection");
let appSection = document.getElementById("appSection");
let welcomeMessage = document.getElementById("welcomeMessage");
let logoutBtn = document.getElementById("logoutBtn");
let themeToggle = document.getElementById("themeToggle");

let taskForm = document.getElementById("taskForm");
let taskFeedback = document.getElementById("taskFeedback");
let taskList = document.getElementById("taskList");
let taskId = document.getElementById("taskId");
let taskInput = document.getElementById("taskInput");
let taskDate = document.getElementById("taskDate");
let createdDate = document.getElementById("createdDate");
let totalTasks = document.getElementById("totalTasks");
let activeTasks = document.getElementById("activeTasks");
let completedTasks = document.getElementById("completedTasks");
let botoesFiltro = document.querySelectorAll(".filter-btn");

let currentDate = document.getElementById("currentDate");
let currentTime = document.getElementById("currentTime");
let cityName = document.getElementById("cityName");
let temperature = document.getElementById("temperature");
let weatherDescription = document.getElementById("weatherDescription");

// 2. Dados da aplicação.
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let filtroAtual = "all";

// 3. Login simulado.
function mostrarApp(nome) {
  loginSection.classList.add("hidden");
  appSection.classList.remove("hidden");
  logoutBtn.classList.remove("hidden");
  welcomeMessage.textContent = "Olá, " + nome + "!";
}

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let nome = document.getElementById("username").value.trim();

  if (nome !== "") {
    sessionStorage.setItem("username", nome);
    mostrarApp(nome);
  }
});

logoutBtn.addEventListener("click", function () {
  sessionStorage.removeItem("username");
  appSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
  logoutBtn.classList.add("hidden");
  loginForm.reset();
});

let nomeGuardado = sessionStorage.getItem("username");
if (nomeGuardado !== null) {
  mostrarApp(nomeGuardado);
}

// 4. Guardar dados e apresentar mensagens.
function guardarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function mostrarFeedback(mensagem, tipo = "") {
  taskFeedback.textContent = mensagem;

  // Remover as cores anteriores.
  taskFeedback.classList.remove(
    "feedback-sucesso",
    "feedback-erro",
    "feedback-aviso",
  );

  // Aplicar a cor correspondente ao tipo de mensagem.
  if (tipo !== "") {
    taskFeedback.classList.add("feedback-" + tipo);
  }
}

function guardarEAtualizar() {
  guardarTarefas();
  mostrarTarefas();
}

// Obter a data de criação.
function obterDataCriacao() {
  return new Date().toLocaleDateString("pt-PT");
}

// Preencher automaticamente o campo.
createdDate.value = obterDataCriacao();

// 5. Adicionar ou editar tarefas.
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let formData = new FormData(this);
  let titulo = formData.get("task").trim();
  let data = formData.get("date");

  if (titulo === "") {
    mostrarFeedback("Escreve uma tarefa válida.", "erro");
    taskInput.focus();
    return;
  }

  // Verificar se já existe uma tarefa com o mesmo nome.
  let tarefaRepetida = tarefas.find(function (tarefa) {
    return (
      tarefa.titulo.trim().toLowerCase() === titulo.toLowerCase() &&
      tarefa.id !== Number(taskId.value)
    );
  });

  if (tarefaRepetida !== undefined) {
    mostrarFeedback("Já existe uma tarefa com esse nome!", "erro");

    taskInput.focus();
    return;
  }
  let prazoUltrapassado = false;
  // Avisar quando a data limite já passou.
  if (data !== "") {
    let hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    let dataLimite = new Date(data + "T00:00:00");

    if (dataLimite < hoje) {
      prazoUltrapassado = true;

      let continuar = confirm(
        "A data limite já passou. Queres guardar a tarefa na mesma?",
      );

      if (continuar === false) {
        taskDate.focus();
        return;
      }
    }
  }

  // Avisar quando não existe data limite.
  if (data === "") {
    let continuar = confirm(
      "Não definiste uma data limite. " + "Queres guardar a tarefa sem prazo?",
    );

    if (continuar === false) {
      taskDate.focus();
      return;
    }
  }

  if (taskId.value !== "") {
    let tarefa = tarefas.find(function (item) {
      return item.id === Number(taskId.value);
    });

    if (tarefa === undefined) {
      mostrarFeedback("Não foi possível encontrar a tarefa.", "erro");
      return;
    }

    tarefa.titulo = titulo;
    tarefa.data = data;

    if (data === "") {
      mostrarFeedback("Tarefa atualizada sem data limite.", "aviso");
    } else if (prazoUltrapassado) {
      mostrarFeedback(
        "Tarefa atualizada com uma data limite ultrapassada.",
        "aviso",
      );
    } else {
      mostrarFeedback("Tarefa atualizada com sucesso!", "sucesso");
    }
  } else {
    let tarefa = {
      id: Date.now(),
      titulo: titulo,
      criadaEm: obterDataCriacao(),
      data: data,
      concluida: false,
    };

    // Adicionar a tarefa ao array.
    tarefas.push(tarefa);

    // Mostrar a mensagem adequada.
    if (data === "") {
      mostrarFeedback("Tarefa adicionada sem data limite.", "aviso");
    } else if (prazoUltrapassado) {
      mostrarFeedback(
        "Tarefa adicionada com uma data limite ultrapassada.",
        "aviso",
      );
    } else {
      mostrarFeedback("Tarefa adicionada com sucesso!", "sucesso");
    }
  }

  this.reset();

  // Atualizar a data de criação para a próxima tarefa.
  createdDate.value = obterDataCriacao();

  // Limpar o ID da tarefa em edição.
  taskId.value = "";

  guardarEAtualizar();
});

// Converter uma data de AAAA-MM-DD para DD/MM/AAAA.
function formatarData(data) {
  let partes = data.split("-");

  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// 6. Apresentar tarefas e respetivos botões.
function mostrarTarefas() {
  taskList.innerHTML = "";

  let tarefasFiltradas = tarefas;

  if (filtroAtual === "active") {
    tarefasFiltradas = tarefas.filter(function (tarefa) {
      return tarefa.concluida === false;
    });
  } else if (filtroAtual === "completed") {
    tarefasFiltradas = tarefas.filter(function (tarefa) {
      return tarefa.concluida === true;
    });
  }

  if (tarefasFiltradas.length === 0) {
    let aviso = document.createElement("li");
    aviso.classList.add("task-item");

    if (tarefas.length === 0) {
      aviso.textContent = "Ainda não existem tarefas. Adiciona a primeira!";
    } else {
      aviso.textContent = "Não existem tarefas neste filtro.";
    }

    taskList.appendChild(aviso);
  }

  tarefasFiltradas.forEach(function (tarefa) {
    let item = document.createElement("li");
    item.classList.add("task-item");

    let info = document.createElement("div");
    info.classList.add("task-info");

    let texto = document.createElement("p");
    texto.classList.add("task-title");
    texto.textContent = tarefa.titulo;
    info.appendChild(texto);

    // Mostrar a data de criação.
    let criacao = document.createElement("p");
    criacao.classList.add("task-date");

    criacao.textContent = "Criada em: " + (tarefa.criadaEm || "Não registada");

    info.appendChild(criacao);

    // Mostrar a data limite.
    let elementoData = document.createElement("p");
    elementoData.classList.add("task-date");

    if (tarefa.data !== "") {
      elementoData.textContent = "Data limite: " + formatarData(tarefa.data);
    } else {
      elementoData.textContent = "Data limite: Não definida";
    }

    info.appendChild(elementoData);

    let acoes = document.createElement("div");
    acoes.classList.add("task-actions");

    // Concluir ou reabrir.
    let botaoEstado = document.createElement("button");
    botaoEstado.classList.add("btn", "secondary");

    if (tarefa.concluida === true) {
      item.classList.add("task-completed");
      botaoEstado.textContent = "Reabrir";
    } else {
      botaoEstado.textContent = "Concluir";
    }

    botaoEstado.addEventListener("click", function () {
      tarefa.concluida = !tarefa.concluida;
      guardarEAtualizar();
    });

    // Editar.
    let botaoEditar = document.createElement("button");
    botaoEditar.classList.add("btn", "secondary");
    botaoEditar.textContent = "Editar";

    botaoEditar.addEventListener("click", function () {
      taskId.value = tarefa.id;
      taskInput.value = tarefa.titulo;
      taskDate.value = tarefa.data;
      createdDate.value = tarefa.criadaEm || "Não registada";
      mostrarFeedback("");
      taskInput.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      taskInput.focus();
    });

    // Eliminar.
    let botaoEliminar = document.createElement("button");
    botaoEliminar.classList.add("btn", "danger");
    botaoEliminar.textContent = "Eliminar";

    botaoEliminar.addEventListener("click", function () {
      // Pedir confirmação ao utilizador.
      let confirmar = confirm(
        "Tens a certeza de que queres eliminar esta tarefa?",
      );

      // Se cancelar, não eliminar.
      if (confirmar === false) {
        return;
      }

      // Remover a tarefa do array.
      tarefas = tarefas.filter(function (item) {
        return item.id !== tarefa.id;
      });

      // Limpar o formulário, se necessário.
      if (taskId.value === String(tarefa.id)) {
        taskForm.reset();
        taskId.value = "";
        createdDate.value = obterDataCriacao();
      }

      // Guardar e atualizar.
      guardarEAtualizar();

      // Apresentar a mensagem.

      mostrarFeedback("Tarefa eliminada com sucesso!", "sucesso");
    });

    acoes.appendChild(botaoEstado);
    acoes.appendChild(botaoEditar);
    acoes.appendChild(botaoEliminar);
    item.appendChild(info);
    item.appendChild(acoes);
    taskList.appendChild(item);
  });

  atualizarContadores();
}

// 7. Contadores e filtros.
function atualizarContadores() {
  let total = tarefas.length;
  let concluidas = tarefas.filter(function (tarefa) {
    return tarefa.concluida === true;
  }).length;

  totalTasks.textContent = total;
  activeTasks.textContent = total - concluidas;
  completedTasks.textContent = concluidas;
}

botoesFiltro.forEach(function (botao) {
  botao.addEventListener("click", function () {
    filtroAtual = botao.getAttribute("data-filter");

    botoesFiltro.forEach(function (outroBotao) {
      outroBotao.classList.remove("active");
    });

    botao.classList.add("active");
    mostrarTarefas();
  });
});

// 8. Tema claro/escuro.
let temaGuardado = localStorage.getItem("tema");
if (temaGuardado === "dark") {
  document.body.classList.add("dark");
}

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("tema", "dark");
  } else {
    localStorage.setItem("tema", "light");
  }
});

// 9. Data e hora atuais.
function atualizarDataHora() {
  let agora = new Date();
  currentDate.textContent = agora.toLocaleDateString("pt-PT");
  currentTime.textContent = agora.toLocaleTimeString("pt-PT");
}

// 10. API meteorológica.
function carregarTempo() {
  let url =
    "https://api.open-meteo.com/v1/forecast?latitude=38.72&longitude=-9.14&current=temperature_2m,weather_code&timezone=Europe%2FLisbon";

  fetch(url)
    .then(function (resposta) {
      if (!resposta.ok) {
        throw new Error("Erro ao consultar a API");
      }
      return resposta.json();
    })
    .then(function (dados) {
      let temperaturaAtual = dados.current.temperature_2m;
      let codigoTempo = dados.current.weather_code;

      cityName.textContent = "Lisboa";
      temperature.textContent = temperaturaAtual + " °C";

      if (codigoTempo === 0) {
        weatherDescription.textContent = "Céu limpo";
      } else if (codigoTempo <= 2) {
        weatherDescription.textContent = "Pouco nublado";
      } else if (codigoTempo === 3) {
        weatherDescription.textContent = "Encoberto";
      } else if (codigoTempo === 45 || codigoTempo === 48) {
        weatherDescription.textContent = "Nevoeiro";
      } else if (codigoTempo >= 51 && codigoTempo <= 57) {
        weatherDescription.textContent = "Chuvisco";
      } else if (codigoTempo >= 61 && codigoTempo <= 67) {
        weatherDescription.textContent = "Chuva";
      } else if (codigoTempo >= 71 && codigoTempo <= 77) {
        weatherDescription.textContent = "Neve";
      } else if (codigoTempo >= 80 && codigoTempo <= 82) {
        weatherDescription.textContent = "Aguaceiros";
      } else if (codigoTempo === 85 || codigoTempo === 86) {
        weatherDescription.textContent = "Aguaceiros de neve";
      } else if (codigoTempo >= 95) {
        weatherDescription.textContent = "Trovoada";
      } else {
        weatherDescription.textContent = "Outras condições";
      }
    })
    .catch(function (erro) {
      console.error("Erro na API:", erro);
      cityName.textContent = "Lisboa";
      temperature.textContent = "--";
      weatherDescription.textContent = "Dados indisponíveis";
    });
}

// 11. Iniciar a aplicação.
mostrarTarefas();
atualizarDataHora();
setInterval(atualizarDataHora, 1000);
carregarTempo();
