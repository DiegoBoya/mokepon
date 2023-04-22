import { Personaje } from './personaje.js';
import { Constants } from './constants.js'


const ID_CABALLERO_NEGRO = "caballeroNegro";
const ID_CABALLERO_REAL = "caballeroReal";
const ID_CABALLERO_TEMPLARIO = "caballeroTemplario";
const PIROMANTICO = "piromantico";
const ID_HECHICERO_BADASS = "hechicero-badass"
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

// ataques
let ataqueTurnoJugador;
let ataqueTurnoEnemigo;
let ataquesCaballeroNegro;
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

function realizarCombate() {
    let resultado;

    if (ataqueTurnoJugador == ataqueTurnoEnemigo) {
        resultado = EMPATE;
    } else if ((ataqueTurnoJugador == FUEGO && ataqueTurnoEnemigo == TIERRA)
        || (ataqueTurnoJugador == AGUA && ataqueTurnoEnemigo == FUEGO)
        || (ataqueTurnoJugador == TIERRA && ataqueTurnoEnemigo == AGUA)) {
        resultado = GANASTE;
        actualizarVidasPC();
    } else {
        resultado = PERDISTE;
        actualizarVidasPlayer();
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
    // todo: aca van los getElemenById de los botones de ataque
    const botonAtaqueDebil1 = document.getElementById('ataque-debil-1');
    const botonAtaqueDebil2 = document.getElementById('ataque-daga');
    const botonAtaqueFuerte1 = document.getElementById('ataque-fuerte-1');
    const botonAtaqueFuerte2 = document.getElementById('ataque-fuerte-2');

    // todo: aca van los addEventListener para los botones de ataque, no arriba
    botonAtaqueDebil1.addEventListener('click', ataqueFuego);
    botonAtaqueDebil2.addEventListener('click', ataqueDaga)
    botonAtaqueFuerte1.addEventListener('click', ataqueAgua);
    botonAtaqueFuerte2.addEventListener('click', ataqueTierra);
}

function ataqueFuego() {
    ataqueTurnoJugador = FUEGO;
    console.log('elegiste FUEGO')
    seleccionarAtaquesPC();
}

function ataqueAgua() {
    ataqueTurnoJugador = AGUA;
    console.log('elegiste AGUA')
    seleccionarAtaquesPC();
}

function ataqueTierra() {
    ataqueTurnoJugador = TIERRA;
    console.log('elegiste TIERRA')
    seleccionarAtaquesPC();
}

function ataqueDaga() {
    ataqueTurnoJugador = TIERRA;
    console.log('elegiste TIERRA')
    seleccionarAtaquesPC();
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
   
    

     await fetch('./../assets/img/personajes/caballero-negro/ataques/ataques-caballero-negro.json')
     .then( response => response.json())
     .then( json => {
        ataquesCaballeroNegro = json.atacks;
     })

    let caballeroNegro = new Personaje(ID_CABALLERO_NEGRO, 'Caballero Negro', 120,
        './../assets/img/personajes/caballero-negro.png', ataquesCaballeroNegro, Constants.defensasCaballeroNegro);

    let caballeroReal = new Personaje(ID_CABALLERO_REAL, 'Caballero Real', 100,
        './../assets/img/personajes/caballero-real.png', Constants.ataquesCaballeroReal, Constants.defensasCaballeroReal);

    let caballeroTemplario = new Personaje(ID_CABALLERO_TEMPLARIO, 'Caballero Templario', 110,
        './../assets/img/personajes/caballero_templario.png', Constants.ataquesCaballeroTemplario, Constants.defensasCaballeroTemplario);

    let hechiceroBadass = new Personaje(ID_HECHICERO_BADASS, 'Hechicero Badass', 90,
        './../assets/img/personajes/hechicero-badass.png', Constants.ataquesHechiceroBadass, Constants.defensasHechiceroBadass);


    personajes = [caballeroNegro, caballeroReal, caballeroTemplario, hechiceroBadass];
    TOTAL_GUERREROS = personajes.length;

    console.log('Los guerreros esperan su destino...', personajes);

}
