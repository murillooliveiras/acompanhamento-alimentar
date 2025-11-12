// Recupera ou inicializa os usuários
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

const form = document.getElementById("formLogin");
const btnCadastrar = document.getElementById("btnCadastrar");
const msg = document.getElementById("mensagem");

// Função de login
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value;

  const user = usuarios.find(u => u.usuario === usuario && u.senha === senha);

  if (user) {
    localStorage.setItem("usuarioLogado", usuario);
    window.location.href = "dashboard.html";
  } else {
    msg.textContent = "Usuário ou senha incorretos!";
  }
});

// Função de cadastro
btnCadastrar.addEventListener("click", () => {
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value;

  if (!usuario || !senha) {
    msg.textContent = "Preencha usuário e senha!";
    return;
  }

  if (usuarios.some(u => u.usuario === usuario)) {
    msg.textContent = "Usuário já existe!";
    return;
  }

  usuarios.push({ usuario, senha });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  msg.textContent = "Usuário cadastrado com sucesso!";
  msg.classList.remove("text-danger");
  msg.classList.add("text-success");

  setTimeout(() => {
    msg.textContent = "";
  }, 2000);
});
