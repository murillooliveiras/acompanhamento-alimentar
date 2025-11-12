//CONTROLE DE USUÁRIO LOGADO
if (!usuarioLogado) {
  window.location.href = "index.html"; // redireciona se não estiver logado
}

let todasRefeicoes = JSON.parse(localStorage.getItem("refeicoes")) || {};
let refeicoes = todasRefeicoes[usuarioLogado] || [];

//FUNÇÕES PRINCIPAIS
const tabela = document.getElementById("tabelaRefeicoes");
const totalCaloriasEl = document.getElementById("totalCalorias");
let grafico;

// Função para salvar no localStorage por usuário
function salvarRefeicoes() {
  todasRefeicoes[usuarioLogado] = refeicoes;
  localStorage.setItem("refeicoes", JSON.stringify(todasRefeicoes));
}

// Atualiza tabela de refeições
function atualizarTabela() {
  tabela.innerHTML = "";
  let total = 0;

  refeicoes.forEach((r) => {
    const linha = `<tr>
      <td>${r.data}</td>
      <td>${r.tipo}</td>
      <td>${r.alimento}</td>
      <td>${r.calorias}</td>
    </tr>`;
    tabela.innerHTML += linha;
    total += parseFloat(r.calorias);
  });

  totalCaloriasEl.textContent = `Total de calorias: ${total.toFixed(2)} kcal`;
}

// Atualiza gráfico de calorias por dia
function atualizarGrafico() {
  const ctx = document.getElementById("graficoCalorias");
  const dadosAgrupados = {};

  refeicoes.forEach((r) => {
    dadosAgrupados[r.data] = (dadosAgrupados[r.data] || 0) + parseFloat(r.calorias);
  });

  const labels = Object.keys(dadosAgrupados);
  const valores = Object.values(dadosAgrupados);

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Calorias por dia",
        data: valores,
        borderWidth: 1,
        backgroundColor: "rgba(25,135,84,0.7)",
      }],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

//REGISTRAR REFEIÇÃO
document.getElementById("formRefeicao").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = document.getElementById("data").value;
  const tipo = document.getElementById("tipo").value;
  const alimento = document.getElementById("alimento").value;
  const calorias = document.getElementById("calorias").value;

  refeicoes.push({ data, tipo, alimento, calorias });
  salvarRefeicoes();

  atualizarTabela();
  atualizarGrafico();

  e.target.reset();
});


//CÁLCULO DE IMC
document.getElementById("formIMC").addEventListener("submit", (e) => {
  e.preventDefault();
  const peso = parseFloat(document.getElementById("peso").value);
  const altura = parseFloat(document.getElementById("altura").value);

  if (!peso || !altura) return;

  const imc = peso / (altura * altura);
  let classificacao = "";

  if (imc < 18.5) classificacao = "Abaixo do peso";
  else if (imc < 25) classificacao = "Peso normal";
  else if (imc < 30) classificacao = "Sobrepeso";
  else classificacao = "Obesidade";

  const resultado = document.getElementById("resultadoIMC");
  resultado.textContent = `IMC: ${imc.toFixed(2)} - ${classificacao}`;
});


//GERAR RELATÓRIO EM PDF
document.getElementById("btnRelatorio").addEventListener("click", () => {
  if (refeicoes.length === 0) {
    alert("Nenhuma refeição registrada!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Relatório de Alimentação", 10, 10);
  doc.setFontSize(12);
  doc.text(`Usuário: ${usuarioLogado}`, 10, 20);
  doc.text(`Data do relatório: ${new Date().toLocaleDateString()}`, 10, 28);

  const dadosTabela = refeicoes.map(r => [r.data, r.tipo, r.alimento, r.calorias]);
  doc.autoTable({
    head: [["Data", "Tipo", "Alimento", "Calorias"]],
    body: dadosTabela,
    startY: 35,
  });

  const totalCal = refeicoes.reduce((acc, r) => acc + parseFloat(r.calorias), 0);
  doc.text(`Total de calorias: ${totalCal.toFixed(2)} kcal`, 10, doc.lastAutoTable.finalY + 10);

  doc.save(`relatorio_${usuarioLogado}.pdf`);
});


//LIMPAR DADOS
document.getElementById("btnLimpar").addEventListener("click", () => {
  const confirmar = confirm("Tem certeza que deseja apagar todas as refeições salvas?");
  if (!confirmar) return;

  refeicoes = [];
  salvarRefeicoes();
  atualizarTabela();
  atualizarGrafico();

  alert("Todos os dados foram apagados com sucesso!");
});

//LOGOUT
document.getElementById("btnLogout").addEventListener("click", () => {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
});


//INICIALIZAÇÃO
window.addEventListener("load", () => {
  atualizarTabela();
  atualizarGrafico();
});

