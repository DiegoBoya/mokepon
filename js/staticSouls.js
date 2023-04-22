import {Personaje} from './personaje.js';
import {Constants} from './constants.js'

const ID_CABALLERO_NEGRO = "caballeroNegro";
const ID_CABALLERO_REAL = "caballeroReal";
const ID_CABALLERO_TEMPLARIO = "caballeroTemplario";
const PIROMANTICO = "piromantico";
const HECHICERO_BLANCO = "hechiceroBlanco";
const HECHICERO_NEGRO = "hechiceroNegro";
const PERSONAJES_ID = [ID_CABALLERO_NEGRO, ID_CABALLERO_REAL, ID_CABALLERO_TEMPLARIO];
// para seleccionar el Personaje de la PC
const MAX_ARRAY_MOKE = PERSONAJES_ID.length;
const MIN_ARRAY_MOKE = 1;

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
const botonMascotaJugador = document.getElementById('boton-seleccionar-mascota');
const botonAtaqueFuego = document.getElementById('boton-fuego');
const botonAtaqueAgua = document.getElementById('boton-agua');
const botonAtaqueTierra = document.getElementById('boton-tierra');
const botonReiniciar = document.getElementById('boton-reiniciar');
const seccionAtaques = document.getElementById('seleccionar-ataque');
const seccionElegirMascota = document.getElementById('seleccionar-mascota');
const seleccionAtaques = document.getElementById('seleccionar-ataque');
const mascotaEnemigo = document.getElementById('mascota-enemigo');
const mascotaJugador = document.getElementById('mascota-jugador');
const vidasEnemigo = document.getElementById('barra-vidas-enemigo');
const vidasJugador = document.getElementById('barra-vidas-jugador');
const seccionMensajeFinal = document.getElementById('mensaje-final')
const parrafoAtaqueJugador = document.getElementById('ataque-jugador');
const parrafoAtaqueEnemigo = document.getElementById('ataque-enemigo');
const relato = document.getElementById('relato')
const mensajesCombate = document.getElementById('mensajes-combate');
const contenedorPersonajes = document.getElementById('contenedor-personajes');

// luego de que se carga todo el HTML, inicia el juego
window.addEventListener('load', iniciarJuego)

let caballeroNegro = new Personaje(ID_CABALLERO_NEGRO,'Caballero Negro', 120, './../assets/img/personajes/caballero-negro.png',[Constants.ataquesCaballeroNegro], [Constants.defensasCaballeroNegro])

let caballeroReal = new Personaje(ID_CABALLERO_REAL,'Caballero Real', 100, './../assets/img/personajes/caballero-real.png',[Constants.ataquesCaballeroNegro], [Constants.defensasCaballeroNegro])

let caballeroTemplario = new Personaje(ID_CABALLERO_TEMPLARIO, 'Caballero Templario', 110, './../assets/img/personajes/caballero_templario.png',[Constants.ataquesCaballeroNegro], [Constants.defensasCaballeroNegro])


let personajes = [caballeroNegro, caballeroReal, caballeroTemplario];
console.log(personajes);

function iniciarJuego() {
    console.log('cargo OK el juego')

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
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)

    //se setea el valor de la variable ataqueJugador segun la funcion invocada
    botonAtaqueFuego.addEventListener('click', ataqueFuego);
    botonAtaqueAgua.addEventListener('click', ataqueAgua);
    botonAtaqueTierra.addEventListener('click', ataqueTierra);

    // boton de reiniciar oculto por defecto
    botonReiniciar.style.display = 'none';
    botonReiniciar.addEventListener('click', reiniciarJuego);

    // seccion de ataques oculta por defecto
    seccionAtaques.style.display = 'none';

}

function seleccionarMascotaJugador() {
    console.log('seleccionados')
    let mascota = PERSONAJES_ID.filter(element => document.getElementById(element).checked === true);

    if (mascota.length == 0) {
        console.error("No se ha elegido un guerrero")
        alert("Debes seleccionar un Guerrero!")
    } else {
        //Setea primera mayuscula
        mascota = formatearNombre(mascota[0]);
        console.log('Has seleccionado a ' + mascota)
        // modifica el HTML de forma dinamica
        mascotaJugador.innerHTML = mascota;

        // oculto seccion elegit masctoa
        seccionElegirMascota.style.display ='none';
        
        // PC elige personaje
        seleccionarMascotaPC();

        // habilito seccion para elegir ataques
        seleccionAtaques.style.display = 'flex';

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

function formatearNombre(mascota) {
    return mascota.charAt(0).toUpperCase() + mascota.substring(1);
}

function seleccionarMascotaPC() {
    console.log('Se elige el guerrero de la PC');
    let numRandom = Math.floor(Math.random() * (MAX_ARRAY_MOKE - MIN_ARRAY_MOKE - 1) + MIN_ARRAY_MOKE)
    console.log('numero random', numRandom, ', guerrero=', PERSONAJES_ID[numRandom])
    let mascotaPC = formatearNombre(PERSONAJES_ID[numRandom]);
    mascotaEnemigo.innerHTML = mascotaPC;
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
function deshabilitarBotonesDeAtaque(){
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

function obtenerFraseSegunSuceso(suceso){
    let relato;
    if (suceso == 'rodo OK'){
        relato = 'Esquivaste justo! sigue asi!!';
    } else if (suceso == 'defensa efectiva'){
        relato = 'El escudo te salvo justo! Ten cuidado!!'
    } else if (suceso == 'espadazo OK'){
        relato = 'Como entro esa estocada!';
    } else if (suceso == 'espadazo-no-OK'){
        relato = 'La anticipaste mucho, te vieron venir...'
    } else {
        relato = 'siga !! sigaaa!!! '
    }
    console.log(relato)
    return relato;
}

function reiniciarJuego(){
    location.reload();
}



