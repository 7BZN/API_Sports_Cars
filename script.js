


const API = "https://parallelum.com.br/fipe/api/v1/carros/marcas";

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

function toggleLoading(show) {
  document.getElementById("loading").classList.toggle("hidden", !show);
}

async function buscarCarros() {
  const busca = document.getElementById("search").value || "lamborghini";

  toggleLoading(true);

  const resposta = await fetch(API + busca);
  const dados = await resposta.json();

  toggleLoading(false);

  exibirCarros(dados.cars || []);
}

function exibirCarros(lista) {
  const container = document.getElementById("carros");
  container.innerHTML = "";

  if (lista.length === 0) {
    container.innerHTML = "<p>Nenhum carro encontrado.</p>";
    return;
  }

  lista.forEach(carro => {
    const isFav = favoritos.some(f => f.id === carro.idCar);

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${carro.strThumb}" alt="">
      <div class="card-content">
        <h2>${carro.strMake} ${carro.strModel}</h2>
        <p><strong>Ano:</strong> ${carro.intYear || "N/A"}</p>
        <button onclick='favoritar(${JSON.stringify(carro)})'>
          ${isFav ? "★ Remover" : "☆ Favoritar"}
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

function favoritar(carro) {
  const existe = favoritos.find(f => f.id === carro.idCar);

  if (existe) {
    favoritos = favoritos.filter(f => f.id !== carro.idCar);
  } else {
    favoritos.push({ id: carro.idCar, ...carro });
  }

  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  buscarCarros();
}

function mostrarFavoritos() {
  exibirCarros(favoritos);
}

// inicial
buscarCarros();