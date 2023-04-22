import { Personaje } from './personaje.js';
import { Constants } from './constants.js'

// constantes dinamicas
let PERSONAJES_ID = [];
let personajes = [];
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
let ataqueJugador;
let ataquePC;
const FUEGO = 'FUEGO';
const AGUA = 'AGUA';
const TIERRA = 'TIERRA';
const ATAQUES = [FUEGO, AGUA, TIERRA];
const MAX_ATAQUES = ATAQUES.length;
const MIN_ATAQUES = 1;

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
const botonAtaqueFuego = document.getElementById('boton-fuego');
const botonAtaqueAgua = document.getElementById('boton-agua');
const botonAtaqueTierra = document.getElementById('boton-tierra');
const personajeEnemigo = document.getElementById('personaje-enemigo');
const personajeJugador = document.getElementById('personaje-jugador');
const vidasEnemigo = document.getElementById('barra-vidas-enemigo');
const vidasJugador = document.getElementById('barra-vidas-jugador');
const parrafoAtaqueJugador = document.getElementById('ataque-jugador');
const parrafoAtaqueEnemigo = document.getElementById('ataque-enemigo');
const seccionMensajeFinal = document.getElementById('mensaje-final')
const botonReiniciar = document.getElementById('boton-reiniciar');
const mensajesCombate = document.getElementById('mensajes-combate');

// luego de que se carga todo el HTML, inicia el juego
window.addEventListener('load', iniciarJuego)

function iniciarJuego() {
    console.log('cargo OK el juego')
    crearPersonajes();

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
    botonpersonajeJugador.addEventListener('click', seleccionarpersonajeJugador)

    //se setea el valor de la variable ataqueJugador segun la funcion invocada
    botonAtaqueFuego.addEventListener('click', ataqueFuego);
    botonAtaqueAgua.addEventListener('click', ataqueAgua);
    botonAtaqueTierra.addEventListener('click', ataqueTierra);

    // boton de reiniciar oculto por defecto
    botonReiniciar.style.display = 'none';
    botonReiniciar.addEventListener('click', reiniciarJuego);

    // seccion de ataques oculta por defecto
    seccionSeleccionarAtaques.style.display = 'none';

}

function seleccionarpersonajeJugador() {
    let personaje = PERSONAJES_ID.filter(element => document.getElementById(element).checked === true);
    console.log(personaje)
    console.log(personajes)
    if (personaje.length == 0) {
        console.error("No se ha elegido un guerrero")
        alert("Debes seleccionar un Guerrero!")
    } else {
        //obtengo el elemento filtrado
        let personajeID = personaje[0];
        
        // comparo el id del elemento filtrado vs el id de los personjes disponibles
        personaje = personajes.filter(per => per.id == personajeID)
        console.log('Has seleccionado a ', personaje[0].nombre)
        // modifica el HTML de forma dinamica
        personajeJugador.innerHTML = personaje[0].nombre;

        // oculto seccion elegit masctoa
        seccionElegirpersonaje.style.display = 'none';

        // PC elige personaje
        seleccionarpersonajePC();

        // habilito seccion para elegir ataques
        seccionSeleccionarAtaques.style.display = 'flex';

    }
}

function ataqueFuego() {
    ataqueJugador = FUEGO;
    console.log('elegiste FUEGO')
    seleccionarAtaquesPC();
}

function ataqueAgua() {
    ataqueJugador = AGUA;
    console.log('elegiste AGUA')
    seleccionarAtaquesPC();
}

function ataqueTierra() {
    ataqueJugador = TIERRA;
    console.log('elegiste TIERRA')
    seleccionarAtaquesPC();
}

function formatearNombre(personaje) {
    return personaje.charAt(0).toUpperCase() + personaje.substring(1);
}

function seleccionarpersonajePC() {
    console.log('Se elige el guerrero de la PC de entre ', TOTAL_GUERREROS, ' disponibles.');
    let numRandom = Math.floor(Math.random() * (TOTAL_GUERREROS - MINIMO + 1))
   /*  console.log('numero random', numRandom, ', guerrero=', PERSONAJES_ID[numRandom], personajes[numRandom].nombre) */
    let personajePC = personajes[numRandom].nombre;
    console.log('Tu enemigo sera el', personajePC)
    personajeEnemigo.innerHTML = personajePC;
}

function seleccionarAtaquesPC() {
    console.log('la PC esta elegiendo sus ataques');
    let numRandom = Math.floor(Math.random() * (MAX_ATAQUES - MIN_ATAQUES + 1));
    ataquePC = ATAQUES[numRandom];
    console.log('la PC elegio de ataque:', ataquePC)

    // realizar el combate
    realizarCombate();
}

function realizarCombate() {
    let resultado;

    if (ataqueJugador == ataquePC) {
        resultado = EMPATE;
    } else if ((ataqueJugador == FUEGO && ataquePC == TIERRA)
        || (ataqueJugador == AGUA && ataquePC == FUEGO)
        || (ataqueJugador == TIERRA && ataquePC == AGUA)) {
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
    botonAtaqueFuego.disabled = true;
    botonAtaqueAgua.disabled = true;
    botonAtaqueTierra.disabled = true;
}

function crearMensajeCombate(resultado, suceso) {
    // actualiza valors tablas grid
    parrafoAtaqueJugador.innerHTML = ataqueJugador;
    parrafoAtaqueEnemigo.innerHTML = ataquePC;

    //editamos el relato
    console.log(suceso)
    relato.innerHTML = obtenerFraseSegunSuceso(suceso)

    // creamos el elemento p
    let parrafo = document.createElement('p');
    parrafo.innerHTML = `Atacas con ${ataqueJugador}, y el enemigo se defiende con ${ataquePC} --> ${resultado}`;
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

function crearPersonajes() {
    // todo: recibir de parametro cuantos guerreros diferentes crear
    const ID_CABALLERO_NEGRO = "caballeroNegro";
    const ID_CABALLERO_REAL = "caballeroReal";
    const ID_CABALLERO_TEMPLARIO = "caballeroTemplario";
    const PIROMANTICO = "piromantico";
    const HECHICERO_BLANCO = "hechiceroBlanco";
    const HECHICERO_NEGRO = "hechiceroNegro";
    PERSONAJES_ID = [ID_CABALLERO_NEGRO, ID_CABALLERO_REAL, ID_CABALLERO_TEMPLARIO];

    let caballeroNegro = new Personaje(ID_CABALLERO_NEGRO, 'Caballero Negro', 120,
        './../assets/img/personajes/caballero-negro.png', [Constants.ataquesCaballeroNegro], [Constants.defensasCaballeroNegro])

    let caballeroReal = new Personaje(ID_CABALLERO_REAL, 'Caballero Real', 100,
        './../assets/img/personajes/caballero-real.png', [Constants.ataquesCaballeroNegro], [Constants.defensasCaballeroNegro])

    let caballeroTemplario = new Personaje(ID_CABALLERO_TEMPLARIO, 'Caballero Templario', 110,
        './../assets/img/personajes/caballero_templario.png', [Constants.ataquesCaballeroNegro], [Constants.defensasCaballeroNegro])

    personajes = [caballeroNegro, caballeroReal, caballeroTemplario];
    TOTAL_GUERREROS = personajes.length;

    console.log('Los guerreros esperan su destino...', personajes);

}