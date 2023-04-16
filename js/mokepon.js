
const HIPODOGE = "Hipodoge";
const CAPIPEPO = "Capipepo";
const RATIGUEYA = "Ratigueya";
const LANGOSTELVIS = "Langostelvis";
const TUCAPALMA = "Tucapalma";
const PYDOS = "Pydos";


const HIPODOGE_ID = "hipodoge";
const CAPIPEPO_ID = "capipepo";
const RATIGUEYA_ID = "ratigueya";
const LANGOSTELVIS_ID = "langostelvis";
const TUCAPALMA_ID = "tucapalma";
const PYDOS_ID = "pydos";
const MOKEPONES_ID = [HIPODOGE_ID, CAPIPEPO_ID, RATIGUEYA_ID, LANGOSTELVIS_ID, TUCAPALMA_ID, PYDOS_ID];
// para seleccionar el Mokepon de la PC
const MAX_ARRAY_MOKE = MOKEPONES_ID.length;
const MIN_ARRAY_MOKE = 1;

// ataques
let ataqueJugador;
let ataquePC;
const FUEGO = 'FUEGO';
const AGUA = 'AGUA';
const TIERRA = 'TIERRA';
const ATAQUES = [FUEGO, AGUA, TIERRA];
const MAX_ATAQUES = ATAQUES.length;
const MIN_ATAQUES = 1;

function iniciarJuego() {
    console.log('cargo OK el juego')

    // reacciona al elegir al mokepon
    let botonMascotaJugador = document.getElementById('boton-seleccionar-mascota');
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)

    //se setea el valor de la variable ataqueJugador segun la funcion invocada
    let botonAtaqueFuego = document.getElementById('boton-fuego');
    botonAtaqueFuego.addEventListener('click', ataqueFuego);

    let botonAtaqueAgua = document.getElementById('boton-agua');
    botonAtaqueAgua.addEventListener('click', ataqueAgua);

    let botonAtaqueTierra = document.getElementById('boton-tierra');
    botonAtaqueTierra.addEventListener('click', ataqueTierra);
    
}

function seleccionarMascotaJugador() {
    let mascota = MOKEPONES_ID.filter(element => document.getElementById(element).checked === true);

    if (mascota.length == 0) {
        console.error("No se ha elegido un Mokepon")
        alert("Debes seleccionar un Mokepon!")
    } else {
        //Setea primera mayuscula
        mascota = formatearNombre(mascota[0]);
        console.log('Has seleccionado a ' + mascota)
        // modifica el HTML de forma dinamica
        document.getElementById('mascota-jugador').innerHTML = mascota;

        // PC elige mokepon
        seleccionarMascotaPC();
    }
}

function ataqueFuego(){
    ataqueJugador = FUEGO;
    console.log('elegiste FUEGO')
    seleccionarAtaquesPC();
}

function ataqueAgua(){
    ataqueJugador = AGUA;
    console.log('elegiste AGUA')
    seleccionarAtaquesPC();
}

function ataqueTierra(){
    ataqueJugador = TIERRA;
    console.log('elegiste TIERRA')
    seleccionarAtaquesPC();
}

function formatearNombre(mascota) {
    return mascota.charAt(0).toUpperCase() + mascota.substring(1);
}

function seleccionarMascotaPC() {
    console.log('Se elige el Mokepon de la PC');
    let numRandom = Math.floor(Math.random() * (MAX_ARRAY_MOKE - MIN_ARRAY_MOKE - 1) + MIN_ARRAY_MOKE)
    console.log('numero random', numRandom, ', mokepon=', MOKEPONES_ID[numRandom])
    let mascotaPC = formatearNombre(MOKEPONES_ID[numRandom]);
    document.getElementById('mascota-PC').innerHTML = mascotaPC;
}

function seleccionarAtaquesPC(){
    console.log('la PC esta elegiendo sus ataques');
    let numRandom = Math.floor(Math.random()*(MAX_ATAQUES - MIN_ATAQUES + 1));
    ataquePC = ATAQUES[numRandom];
    console.log('la PC elegio de ataque:', ataquePC)

    // crea elemento con texto del combate
    crearMensajeCombate();
}

function crearMensajeCombate(){
    // creamos el elemento p
    let parrafo = document.createElement('p');
    parrafo.innerHTML =`Atacas con ${ataqueJugador}, y el enemigo se defiende con ${ataquePC}`;
    // insertamos el elemento en el HTML
    let sectionMensajes = document.getElementById('mensajes-combate');
    sectionMensajes.appendChild(parrafo);
}

// luego de que se carga todo el HTML, inicia el juego
window.addEventListener('load', iniciarJuego)