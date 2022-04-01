const endpoint = "https://pokeapi.co/api/v2/pokemon/";

//Selección de elementos del DOM que se van a usar.
const foto = document.querySelector(".foto");
const nombre = document.querySelector(".nombre");
const infoDiv = document.querySelector(".info");
const pokedex = document.querySelector("#pokedex");
const elInput = document.querySelector(".elInput");
const elBoton = document.querySelector(".elBoton");

//Creacion de otros elementos necesarios.
const boton = document.createElement("button");
const display = document.createElement("button");
const img = document.createElement("img");
const info = document.createElement("p");

//Manejo de datos del DOM (y estilos).
boton.classList.add("new");
boton.textContent = "Pokémon Random";
display.classList.add("new");
display.textContent = "Ver información";
foto.insertAdjacentElement("afterbegin", img);
foto.insertAdjacentElement("afterend", boton);
boton.insertAdjacentElement("afterend", display);

//Funciones para cerrar ventana de información.
function cerrarVentana() {
  infoDiv.classList.remove("open");
  infoDiv.classList.add("info");
}
infoDiv.addEventListener("click", function(event) {
  const estaAfuera = event.target.closest(".open");
  console.log(estaAfuera);

  if(estaAfuera) {
      cerrarVentana();
  }
});

//Se define esta variable afuera para poder utilizar el mismo numero random
//en ambas funciones (pokemon random y descripcion random).
var num;

//Funcion que devuelve un numero al azar entre la cantidad de Pokemon.
const max = 898;
const min = 1;

function random() {
    num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

//Funcion que genera un nuevo Pokemon al azar.
function apretaMe() {
  return pokeRandom();
}

//Funcion que hace aparecer el cuadro de la informacion, con la misma.
async function displayInfo() {
  //Fetchear los datos de las descripciones de los pokemones de la API.
  const resp = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${num}`);
  const data2 = await resp.json();
  //Funcion para devolver la descripcion en determinado lenguaje.
    function description() {
    for (let i = 0; i <= data2.flavor_text_entries.length; i++) {
      if(data2.flavor_text_entries[i].language.name === "es") {
        var x = data2.flavor_text_entries[i].flavor_text;
        i = data2.flavor_text_entries.length + 1;
      }
    }
    return x;
  };
  //Pasar al DOM los datos fetcheados antes.
  info.classList.add("para");
  info.textContent = `${description()}`;
  infoDiv.insertAdjacentElement("afterbegin", info);
  infoDiv.classList.remove("info");
  infoDiv.classList.add("open");
}

//Event listeners de botones.
//Evento para el boton, para que aparezca la info.
display.addEventListener("click", displayInfo);
//Evento para el boton de buscar pokemones.
elBoton.addEventListener("click", buscarPoke);


//Funcion para buscar pokemones por su nombre o id numerica.
async function buscarPoke(event) {
  event.preventDefault();
  const elPoke = elInput.value.toLowerCase();
  if (elPoke >= min && elPoke <= max || elPoke != null) {
    //Fetchear datos, tanto nombre como descripcion del bicho:
    const res3 = await fetch(`${endpoint}${elPoke}`);
    const data3 = await res3.json();

    //Pasar al DOM los datos fetcheados:
    img.src = data3.sprites.front_default;
    nombre.textContent = `${data3.id} ${data3.species.name[0].toUpperCase()}${data3.species.name.substring(1)}`;

    infoDiv.classList.remove("open");
    infoDiv.classList.add("info");
    boton.addEventListener("click", apretaMe);
    display.disabled = false;
    info.textContent = " ";
    num = elPoke;

    async function displayInfo2() {
    const resp2 = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${num}`);
    const data4 = await resp2.json();
      function description2() {
      for (let i = 0; i <= data4.flavor_text_entries.length; i++) {
        if(data4.flavor_text_entries[i].language.name === "es") {
          var x = data4.flavor_text_entries[i].flavor_text;
          i = data4.flavor_text_entries.length + 1;
        }
      }
      return x;
    };
    //Pasar al DOM los datos fetcheados antes.
    info.classList.add("para");
    info.textContent = `${description2()}`;
    infoDiv.insertAdjacentElement("afterbegin", info);
    display.addEventListener("click", displayInfo2);
    }
  } else if (elPoke === "") {
    alert("Pokémon inexistente");
  }
}


//Funcion central de la Pokedex, genera un Pokemon random consultando la API.
async function pokeRandom() {
    //Fetchear datos, tanto nombre como descripcion del bicho:
    const res = await fetch(`${endpoint}${random()}`);
    const data = await res.json();

    //Pasar al DOM los datos fetcheados:
    img.src = data.sprites.front_default;
    nombre.textContent = `${data.id} ${data.species.name[0].toUpperCase()}${data.species.name.substring(1)}`;

    infoDiv.classList.remove("open");
    infoDiv.classList.add("info");
    boton.addEventListener("click", apretaMe);
    display.disabled = false;
    info.textContent = " ";
    //console.log(data);
  };

//Error si no se puede consultar a la API y la promesa falla.
function elError(err) {
  console.log("algo salió mal");
  console.log(err);
  title.textContent = `Algo salio mal: ${err}`;
}

pokeRandom();