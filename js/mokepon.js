
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
const MAX_ARRAY_MOKE = MOKEPONES_ID.length;
const MIN_ARRAY_MOKE = 1;

function iniciarJuego() {
    console.log('cargo OK el juego')

    // reacciona al elegir al mokepon
    let botonMascotaJugador = document.getElementById('boton-seleccionar-mascota');
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)
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

// luego de que se carga todo el HTML, inicia el juego
window.addEventListener('load', iniciarJuego)