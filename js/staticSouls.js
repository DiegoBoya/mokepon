import { Personaje } from './personaje.js';
import { Constants } from './constants.js'


const ID_CABALLERO_NEGRO = "caballeroNegro";
const ID_CABALLERO_REAL = "caballeroReal";
const ID_CABALLERO_TEMPLARIO = "caballeroTemplario";
const ID_HECHICERO_BADASS = "hechicero-badass"
const PIROMANTICO = "piromantico";
const HECHICERO_BLANCO = "hechiceroBlanco"
const HECHICERO_NEGRO = "hechiceroNegro";
// constantes dinamicas
let PERSONAJES_ID = []
let personajes = [];
let objPersonajeEnemigo;
let objPersonajeJugador;
// para seleccionar el Personaje de la PC
let TOTAL_GUERREROS;
const MINIMO = 1;

// vidas 
const INICIO_VIDAS = 3;
let vidasPC = INICIO_VIDAS;
let vidasPlayer = INICIO_VIDAS;

// contadores
let contadorRachasDerrotas = 0;
let contadorRachasVictorias = 0;

// ataques traidos de los JSON
let ataqueTurnoJugador;
let ataqueTurnoEnemigo;
let ataquesCaballeroNegro;
let defensasCaballeroNegro;
let ataquesCaballeroReal;
let defensasCaballeroReal;
let ataquesCaballeroTemplario;
let defensasCaballeroTemplario;
let ataquesHechiceroBadass;
let defensasHechiceroBadass;
const FUEGO = 'FUEGO';
const AGUA = 'AGUA';
const TIERRA = 'TIERRA';
const ATAQUES = [FUEGO, AGUA, TIERRA];
const MAX_ATAQUES = ATAQUES.length;
const MIN_ATAQUES = 1;
let arrayIDsBotonesDeAtaqueEnPantalla = [];

//resultados
const EMPATE = 'empate 😐';
const GANASTE = 'ganaste! 😎';
const PERDISTE = 'perdiste 😕';

// elementos manipulables
//seccion 1
const botonpersonajeJugador = document.getElementById('boton-seleccionar-personaje');
const seccionElegirpersonaje = document.getElementById('seleccionar-personaje');
const contenedorPersonajes = document.getElementById('contenedor-personajes');

//seccion2
const seccionSeleccionarAtaques = document.getElementById('seleccionar-ataque');
const relato = document.getElementById('relato')
const seccionBotonesAtaquesJugador = document.getElementById('seccion-botones-ataques-jugador');
const nombrePersonajeEnemigoDOM = document.getElementById('personaje-enemigo');
const nombrePersonajeJugadorDOM = document.getElementById('personaje-jugador');
const vidasEnemigo = document.getElementById('barra-vidas-enemigo');
const vidasJugador = document.getElementById('barra-vidas-jugador');
const parrafoAtaqueJugador = document.getElementById('ataque-jugador');
const parrafoAtaqueEnemigo = document.getElementById('ataque-enemigo');
const seccionMensajeFinal = document.getElementById('mensaje-final')
const botonReiniciar = document.getElementById('boton-reiniciar');
const mensajesCombate = document.getElementById('mensajes-combate');

//botones de ataque compartidos
let botonAtaqueDaga;
let botonAtaqueFuerte;
let botonAtaqueDebil;
let botonAtaqueDosManos;
// botones de ataque HB
let botonAtaqueFlechaMagica;
let botonAtaqueRafagaMagica;
// botones de ataque CT
// .
// botones de ataque CR
let botonAtaqueRayo;
let botonAtaqueDobleRayo;
// botones de ataque CN
let botonAtaqueRayo1;
let botonAtaqueRayo2;
let botonAtaqueFuego;

// luego de que se carga todo el HTML, inicia el juego
window.addEventListener('load', iniciarJuego)

async function iniciarJuego() {
    //step 1
    console.log('cargo OK el juego')
    await crearPersonajes();

    // inyecta el js en el DOM
    personajes.forEach((personaje) => {
        let tarjetaPersonaje = `
        <input class="input-tarjeta-personaje" type="radio" name="character" id=${personaje.id}>
        <label class="tarjeta-personaje" for="${personaje.id}">
            <img src=${personaje.foto} alt="${personaje.nombre}">
            <p>${personaje.nombre}</p>
            <p>estadisticas</p>    
        </label>
        `
        contenedorPersonajes.innerHTML += tarjetaPersonaje;
    })

    // reacciona al elegir al Guerrero
    botonpersonajeJugador.addEventListener('click', seleccionarPersonajeJugador)

    // boton de reiniciar oculto por defecto
    botonReiniciar.style.display = 'none';
    botonReiniciar.addEventListener('click', reiniciarJuego);

    // seccion de ataques oculta por defecto
    seccionSeleccionarAtaques.style.display = 'none';

}

function seleccionarPersonajeJugador() {
    let personaje = PERSONAJES_ID.filter(element => document.getElementById(element).checked === true);

    if (personaje.length == 0) {
        console.error("No se ha elegido un guerrero")
        alert("Debes seleccionar un Guerrero!")
    } else {
        //obtengo el elemento filtrado
        let personajeID = personaje[0];

        // comparo el id del elemento filtrado vs el id de los personjes disponibles
        personaje = personajes.filter(per => per.id == personajeID)
        // modifica el HTML de forma dinamica
        objPersonajeJugador = personaje[0];
        nombrePersonajeJugadorDOM.innerHTML = objPersonajeJugador.nombre;
        console.log('Has seleccionado a', objPersonajeJugador)

        cargarAtaquesJugadorEnPantalla();

        // oculto seccion elegir personaje
        seccionElegirpersonaje.style.display = 'none';

        // PC elige personaje
        seleccionarpersonajePC();

        // habilito seccion para elegir ataques
        seccionSeleccionarAtaques.style.display = 'flex';

    }
}

function formatearNombre(personaje) {
    return personaje.charAt(0).toUpperCase() + personaje.substring(1);
}

function seleccionarpersonajePC() {
    console.log('Se elige el guerrero de la PC de entre ', TOTAL_GUERREROS, ' disponibles.');
    let numRandom = Math.floor(Math.random() * (TOTAL_GUERREROS - MINIMO + 1))
    let personajePC = personajes[numRandom];
    nombrePersonajeEnemigoDOM.innerHTML = personajePC.nombre;
    objPersonajeEnemigo = personajePC;
    console.log('Tu enemigo sera el', objPersonajeEnemigo)
}

// todo: modificar esta logica por completo, segun ataques y defensas
function realizarCombate() {
    let resultado;

    if (ataqueTurnoJugador == ataqueTurnoEnemigo) {
        resultado = EMPATE;
    } else if ((ataqueTurnoJugador == FUEGO && ataqueTurnoEnemigo == TIERRA)
        || (ataqueTurnoJugador == AGUA && ataqueTurnoEnemigo == FUEGO)
        || (ataqueTurnoJugador == TIERRA && ataqueTurnoEnemigo == AGUA)) {
        resultado = GANASTE;
        // actualizarVidasPC();
    } else {
        resultado = PERDISTE;
        //actualizarVidasPlayer();
    }

    // TODO: el suceso es la convinacion de los dos movimientos seleccionados. 
    // pendiente, funcion que compara ataques y determina que suceso salio.
    let suceso = 'espadazo OK';

    // crea elemento con texto del combate
    crearMensajeCombate(resultado, suceso);

    if (vidasPC == 0) {
        // mostrar animacion que ganaste
        crearMensajeFinDeJuego(GANASTE);
    }

    if (vidasPlayer == 0) {
        // mostrar animacion que perdiste
        crearMensajeFinDeJuego(PERDISTE);
    }
}

function actualizarVidasPC() {
    vidasPC--;
    vidasEnemigo.innerHTML = vidasPC;
}

function actualizarVidasPlayer() {
    vidasPlayer--;
    vidasJugador.innerHTML = vidasPlayer;

}

function crearMensajeFinDeJuego(mensaje) {
    let mensajeFinal = document.createElement('p');
    if (mensaje == GANASTE) {
        mensajeFinal.innerHTML = 'VAMOOO GANASTE!!'
        contadorRachasVictorias++;
    } else if (mensaje == PERDISTE) {
        mensajeFinal.innerHTML = 'Te derrotaron, vuelve a intentarlo, no te rindas!'
        contadorRachasDerrotas++;
    } else {
        console.error('entro aca, no deberia....')
        mensajeFinal.innerHTML = 'ERROR!!!!'
    }
    deshabilitarBotonesDeAtaque();
    seccionMensajeFinal.appendChild(mensajeFinal)


    // habilito boton reiniciar
    botonReiniciar.style.display = 'block';
}

/**
 * Al finalizar el juego, inhabilita a todos los botones de ataques
 */
function deshabilitarBotonesDeAtaque() {
    console.warn('se inhabilitan los botones de ataque')
    seccionBotonesAtaquesJugador.style.display = 'none';
}

function crearMensajeCombate(resultado, suceso) {
    // actualiza valors tablas grid
    parrafoAtaqueJugador.innerHTML = ataqueTurnoJugador;
    parrafoAtaqueEnemigo.innerHTML = ataqueTurnoEnemigo;

    //editamos el relato
    console.log(suceso)
    relato.innerHTML = obtenerFraseSegunSuceso(suceso)

    // creamos el elemento p
    let parrafo = document.createElement('p');
    parrafo.innerHTML = `Atacas con ${ataqueTurnoJugador}, y el enemigo se defiende con ${ataqueTurnoEnemigo} --> ${resultado}`;
    // insertamos el elemento en el HTML
    mensajesCombate.appendChild(parrafo);
}

function obtenerFraseSegunSuceso(suceso) {
    let relato;
    if (suceso == 'rodo OK') {
        relato = 'Esquivaste justo! sigue asi!!';
    } else if (suceso == 'defensa efectiva') {
        relato = 'El escudo te salvo justo! Ten cuidado!!'
    } else if (suceso == 'espadazo OK') {
        relato = 'Como entro esa estocada!';
    } else if (suceso == 'espadazo-no-OK') {
        relato = 'La anticipaste mucho, te vieron venir...'
    } else {
        relato = 'siga !! sigaaa!!! '
    }
    console.log(relato)
    return relato;
}

function reiniciarJuego() {
    location.reload();
}

// step 2
function cargarAtaquesJugadorEnPantalla() {
    // creacion de botones de ataque en el front
    objPersonajeJugador.ataques.forEach((atack) => {
        let botonDeAtaque = `
        <button class="boton-ataque" id="${atack.id}">${atack.icon + atack.name} </button> 
        `
        arrayIDsBotonesDeAtaqueEnPantalla.push(atack.id);
        seccionBotonesAtaquesJugador.innerHTML += botonDeAtaque;
    })
    //PERSONAJES_ID = [ID_CABALLERO_NEGRO, ID_CABALLERO_REAL, ID_CABALLERO_TEMPLARIO, ID_HECHICERO_BADASS];
    // llamado a funcion que crea y asocia los botones del front con las funciones de JS
    let _id = objPersonajeJugador.id;
    switch (_id) {
        case ID_CABALLERO_NEGRO:
            asociarBotonesCaballeroNegro();
            break;
        case ID_CABALLERO_TEMPLARIO:
            asociarBotonesCaballeroTemplario();
            break;
        case ID_CABALLERO_REAL:
            asociarBotonesCaballeroReal();
            break;
        case ID_HECHICERO_BADASS:
            asociarBotonesHechiceroBadass();
            break;

    }
}

function asociarBotonesCaballeroNegro() {
    botonAtaqueDebil = document.getElementById('ataque-debil');
    botonAtaqueFuerte = document.getElementById('ataque-fuerte');
    botonAtaqueDosManos = document.getElementById('dos-manos');
    botonAtaqueDaga = document.getElementById('ataque-daga');
    botonAtaqueFuego = document.getElementById('ataque-piromancia');
    
    botonAtaqueDebil.addEventListener('click', ataqueDebil);
    botonAtaqueFuerte.addEventListener('click', ataqueFuerte);
    botonAtaqueDosManos.addEventListener('click', ataqueA2Manos);
    botonAtaqueDaga.addEventListener('click', ataqueDaga)
    botonAtaqueFuego.addEventListener('click', ataquePiromancia);
    
}

function asociarBotonesCaballeroReal() {
    botonAtaqueRayo = document.getElementById('ataque-rayo');
    botonAtaqueDobleRayo = document.getElementById('doble-rayo');
    botonAtaqueFuerte = document.getElementById('ataque-fuerte');
    
    botonAtaqueRayo.addEventListener('click', ataqueRayo);
    botonAtaqueDobleRayo.addEventListener('click', ataqueDobleRayo)
    botonAtaqueFuerte.addEventListener('click', ataqueFuerte);
}

function asociarBotonesCaballeroTemplario() {
    botonAtaqueDebil = document.getElementById('ataque-debil');
    botonAtaqueDaga = document.getElementById('ataque-daga');
    botonAtaqueFuerte = document.getElementById('ataque-fuerte');
    botonAtaqueDosManos = document.getElementById('dos-manos');
    
    botonAtaqueDebil.addEventListener('click', ataqueDebil);
    botonAtaqueDaga.addEventListener('click', ataqueDaga)
    botonAtaqueFuerte.addEventListener('click', ataqueFuerte);
    botonAtaqueDosManos.addEventListener('click', ataqueA2Manos);
}

function asociarBotonesHechiceroBadass() {
    botonAtaqueFlechaMagica = document.getElementById('flecha-magica');
    botonAtaqueRafagaMagica = document.getElementById('rafaga-magica');
    botonAtaqueDaga = document.getElementById('ataque-daga');

    botonAtaqueFlechaMagica.addEventListener('click', ataqueFlechaMagica);
    botonAtaqueRafagaMagica.addEventListener('click', ataqueRafagaMagica);
    botonAtaqueDaga.addEventListener('click', ataqueDaga);

}
function ataquePiromancia() {
    let objAtaque = objPersonajeJugador.getAtackById('ataque-piromancia');
    ataqueTurnoJugador = objAtaque.name
    console.log('elegiste', ataqueTurnoJugador)
    seleccionarAtaquesPC();
    if (objAtaque.cant == 0) {
        botonAtaqueFuego.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        //checkIfAllAtacksAreDisabled()
    }
}

function ataqueRayo() {
    let objAtaque = objPersonajeJugador.getAtackById('ataque-rayo');
    ataqueTurnoJugador = objAtaque.name
    console.log('elegiste', ataqueTurnoJugador)
    seleccionarAtaquesPC();
    if (objAtaque.cant == 0) {
        botonAtaqueRayo.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        //checkIfAllAtacksAreDisabled()
    }
}

function ataqueDobleRayo() {
    let objAtaque = objPersonajeJugador.getAtackById('doble-rayo');
    ataqueTurnoJugador = objAtaque.name
    console.log('elegiste', ataqueTurnoJugador)
    seleccionarAtaquesPC();
    if (objAtaque.cant == 0) {
        botonAtaqueDobleRayo.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        //checkIfAllAtacksAreDisabled()
    }
}

function ataqueA2Manos() {
    let objAtaque = objPersonajeJugador.getAtackById('dos-manos');
    ataqueTurnoJugador = objAtaque.name
    console.log('elegiste', ataqueTurnoJugador)
    seleccionarAtaquesPC();
    if (objAtaque.cant == 0) {
        botonAtaqueDosManos.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        //checkIfAllAtacksAreDisabled()
    }
}

function ataqueFuerte() {
    let objAtaque = objPersonajeJugador.getAtackById('ataque-fuerte');
    ataqueTurnoJugador = objAtaque.name
    console.log('elegiste', ataqueTurnoJugador)
    seleccionarAtaquesPC();
    if (objAtaque.cant == 0) {
        botonAtaqueFuerte.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        //checkIfAllAtacksAreDisabled()
    }
}
function ataqueDebil() {
    let objAtaque = objPersonajeJugador.getAtackById('ataque-debil');
    ataqueTurnoJugador = objAtaque.name
    console.log('elegiste', ataqueTurnoJugador)
    seleccionarAtaquesPC();
    if (objAtaque.cant == 0) {
        botonAtaqueDebil.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        //checkIfAllAtacksAreDisabled()
    }
}
function ataqueFlechaMagica() {
    let objAtaque = objPersonajeJugador.getAtackById('flecha-magica');
    ataqueTurnoJugador = objAtaque.name
    console.log('elegiste', ataqueTurnoJugador)
    seleccionarAtaquesPC();
    if (objAtaque.cant == 0) {
        botonAtaqueFlechaMagica.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        //checkIfAllAtacksAreDisabled()
    }
}
function ataqueRafagaMagica() {
    let objAtaque = objPersonajeJugador.getAtackById('rafaga-magica');
    ataqueTurnoJugador = objAtaque.name
    console.log('elegiste', ataqueTurnoJugador)
    seleccionarAtaquesPC();
    if (objAtaque.cant == 0) {
        botonAtaqueRafagaMagica.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        //checkIfAllAtacksAreDisabled()
    }
}
function ataqueDaga() {

    let objAtaque = objPersonajeJugador.getAtackById('ataque-daga');
    ataqueTurnoJugador = objAtaque.name
    console.log('elegiste', ataqueTurnoJugador)
    seleccionarAtaquesPC();
    if (objAtaque.cant == 0) {
        botonAtaqueDaga.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        //checkIfAllAtacksAreDisabled()
    }
}


function seleccionarAtaquesPC() {
    console.log('la PC esta elegiendo sus ataques');
    let numRandom = Math.floor(Math.random() * (MAX_ATAQUES - MIN_ATAQUES + 1));
    ataqueTurnoEnemigo = ATAQUES[numRandom];
    console.log('la PC elegio de ataque:', ataqueTurnoEnemigo)

    // realizar el combate
    realizarCombate();
}

async function crearPersonajes() {
    // todo: recibir de parametro cuantos guerreros diferentes crear
    PERSONAJES_ID = [ID_CABALLERO_NEGRO, ID_CABALLERO_REAL, ID_CABALLERO_TEMPLARIO, ID_HECHICERO_BADASS];

    await obtenerAtaquesDefensas();

    let caballeroNegro = new Personaje(ID_CABALLERO_NEGRO, 'Caballero Negro', 120,
        './../assets/img/personajes/caballero-negro.png', ataquesCaballeroNegro, defensasCaballeroNegro);

    let caballeroReal = new Personaje(ID_CABALLERO_REAL, 'Caballero Real', 100,
        './../assets/img/personajes/caballero-real.png', ataquesCaballeroReal, defensasCaballeroReal);

    let caballeroTemplario = new Personaje(ID_CABALLERO_TEMPLARIO, 'Caballero Templario', 110,
        './../assets/img/personajes/caballero_templario.png', ataquesCaballeroTemplario, defensasCaballeroTemplario);

    let hechiceroBadass = new Personaje(ID_HECHICERO_BADASS, 'Hechicero Badass', 90,
        './../assets/img/personajes/hechicero-badass.png', ataquesHechiceroBadass, defensasHechiceroBadass);


    personajes = [caballeroNegro, caballeroReal, caballeroTemplario, hechiceroBadass];
    TOTAL_GUERREROS = personajes.length;

    console.log('Los guerreros esperan su destino...', personajes);

}

async function obtenerAtaquesDefensas() {

    // Caballero Negro
    await fetch('./../assets/caballero-negro/ataques-caballero-negro.json')
        .then(response => response.json())
        .then(json => {
            ataquesCaballeroNegro = json.atacks;
        })

    await fetch('./../assets/caballero-negro/defensas-caballero-negro.json')
        .then(response => response.json())
        .then(json => {
            defensasCaballeroNegro = json.defense;
        })

    // Caballero Real
    await fetch('./../assets/caballero-real/ataques-caballero-real.json')
        .then(response => response.json())
        .then(json => {
            ataquesCaballeroReal = json.atacks;
        })

    await fetch('./../assets/caballero-real/defensas-caballero-real.json')
        .then(response => response.json())
        .then(json => {
            defensasCaballeroReal = json.defense;
        })

    // Hechicero Badass
    await fetch('./../assets/caballero-templario/ataques-caballero-templario.json')
        .then(response => response.json())
        .then(json => {
            ataquesCaballeroTemplario = json.atacks;
        })

    await fetch('./../assets/caballero-templario/defensas-caballero-templario.json')
        .then(response => response.json())
        .then(json => {
            defensasCaballeroTemplario = json.defense;
        })

    // Hechicero Badass
    await fetch('./../assets/hechicero-badass/ataques-hechicero-badass.json')
        .then(response => response.json())
        .then(json => {
            ataquesHechiceroBadass = json.atacks;
        })

    await fetch('./../assets/hechicero-badass/defensas-hechicero-badass.json')
        .then(response => response.json())
        .then(json => {
            defensasHechiceroBadass = json.defense;
        })

}


