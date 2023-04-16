
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

function iniciarJuego(){
    // reacciona al elegir al mokepon
    console.log('cargo OK el juego')
    let botonMascotaJugador = document.getElementById('boton-seleccionar-mascota');
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)
}

function seleccionarMascotaJugador(){
    let mascota = MOKEPONES_ID.filter(element => document.getElementById(element).checked === true);
    console.log(mascota)
    alert('Has seleccionado a ' + mascota)
}


// luego de que se carga todo el HTML, inicia el juego
window.addEventListener('load', iniciarJuego)