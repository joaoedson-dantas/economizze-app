function getLocalStorage() {
  return JSON.parse(localStorage.getItem("dbTransaction")) ?? [];
}
function setLocalStorage(db_transaction) {
  localStorage.setItem("dbTransaction", JSON.stringify(db_transaction));
}

/* Crud */

const readTransaction = () => getLocalStorage();

/* Criar */
const creatTransaction = (transaction) => {
  const db_transaction = getLocalStorage();
  db_transaction.push(transaction);
  setLocalStorage(db_transaction);
};

function creatLi(transaction) {
  const newLi = document.createElement("li");
  if (transaction.tipo === "entrada") {
    newLi.innerHTML = `        
    <div class="transacoes_item transacao-entrada">
      <div class="entrada_icon">
        <i class="ri-arrow-up-line"></i>
        <div class="desc_info">
          <h4>${transaction.desc}</h4>
          <span id="date">${dataTransaction()}</span>
        </div>
      </div>
      <div class="valor">
        <h3>${transaction.valor}</h3>
        <div>
          <i class="ri-delete-bin-line"></i>
        </div>
      </div>
  </div> `;
    const transacoes_ul = document.querySelector("#transacoes_ul");
    transacoes_ul.appendChild(newLi);
  } else {
    newLi.innerHTML = ` 
    <li>
        <div class="transacoes_item ">
          <div class="entrada_icon">
            <i class="ri-arrow-down-line"></i>
            <div class="desc_info">
              <h4>${transaction.desc}</h4>
              <span id="date">${dataTransaction()}</span>
            </div>
          </div>
          <div class="valor">
            <h3>${transaction.valor}</h3>
            <div>
              <i class="ri-delete-bin-line"></i>
            </div>
          </div>
        </div>
      </li> `;
    const transacoes_ul = document.querySelector("#transacoes_ul");
    transacoes_ul.appendChild(newLi);
  }
}

function clearUl() {
  const lis = document.querySelectorAll("#transacoes_ul>li");
  lis.forEach((li) => li.parentNode.removeChild(li));
}

function updateList() {
  const db_transaction = getLocalStorage();
  clearUl();
  db_transaction.forEach(creatLi);
}

/* Modificar */
const updateTransaction = (index, transaction) => {
  const db_transaction = getLocalStorage();
  db_transaction[index] = transaction;
  setLocalStorage(db_transaction);
};

const deleteTransaction = (index) => {
  const db_transaction = getLocalStorage();
  db_transaction.splice(index, 1); // Pegar o index e excluir somente um que é ele mesmo.
  setLocalStorage(db_transaction);
};

/* Interação */

function isValidFilds() {
  const form = document.querySelector(".form");
  return form.reportValidity();
}

function clearFields() {
  const fields = document.querySelectorAll(".inputsModal");
  fields.forEach((field) => (field.value = ""));
}

function saveTransaction() {
  if (isValidFilds()) {
    const desc = document.querySelector("#desc").value;
    const valor = document.querySelector("#valor").value;
    const tipo = document.querySelector("#select").value;
    const transaction = {
      desc,
      valor,
      tipo,
    };
    creatTransaction(transaction);
    atualizarValores();
    updateList();
    fecharModal();
  }
}

const btnEntrada = document.getElementById("registrarEntrada");
btnEntrada.addEventListener("click", saveTransaction);

const inputValor = document.querySelector("#valor");
inputValor.addEventListener("input", () => {
  const valor = inputValor.value.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
  const formatarValor = formatarMoeda(valor);
  inputValor.value = formatarValor;
});

function formatarMoeda(valor) {
  const formatar = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return formatar.format(valor / 100); // Divide por 100 para tratar o valor como centavos
}

/* ------------- */

function atualizarValores() {
  const valorEntrada = document.querySelector("#valorEntrada");
  const valorSaida = document.querySelector("#valorSaida");
  const valorTotal = document.querySelector("#valorTotal");

  const db_transaction = getLocalStorage();
  let valorTotalEntrada = 0;
  let valorTotalSaida = 0;
  db_transaction.forEach((item) => {
    if (item.tipo === "entrada") {
      const valorEntrada = +item.valor.replace(/[.,R$]/g, "");
      valorTotalEntrada = valorTotalEntrada + valorEntrada;
    } else {
      const valorSaida = +item.valor.replace(/[.,R$]/g, "");
      valorTotalSaida = valorTotalSaida + valorSaida;
    }
  });
  const somaValorTotal = valorTotalEntrada - valorTotalSaida;
  valorTotal.innerHTML = formatarMoeda(somaValorTotal);
  const formatarMoedaEntrada = formatarMoeda(valorTotalEntrada);
  const formatarMoedaSaida = formatarMoeda(valorTotalSaida);
  valorEntrada.innerHTML = formatarMoedaEntrada;
  valorSaida.innerHTML = formatarMoedaSaida;
}

/* MODAL  */

function fecharModal() {
  const modal = document.querySelector("#modal");
  clearFields();
  modal.classList.remove("mostrar");
}

function iniciaModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("mostrar");
    modal.addEventListener("click", (event) => {
      if (event.target.id == modalId || event.target.className == "fechar") {
        clearFields();
        modal.classList.remove("mostrar");
      }
    });
  }
}

const btnEntradaModal = document.querySelector("#entrada-btn");
btnEntradaModal.addEventListener("click", () => iniciaModal("modal"));

updateList();
atualizarValores();

const today = new Date();
const day = today.getDate();
const month = today.getMonth() + 1;

function dataTransaction() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const monthNames = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
  ];
  const monthAtual = monthNames[month];

  return `${day} ${monthAtual}`;
}
