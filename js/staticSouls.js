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
let personajesJugador = [];
let personajesEnemigo = [];
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
let numRonda = 1;

// ataques traidos de los JSON
let movimientoTurnoJugador;
let movimientoTurnoEnemigo;
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
/* let arrayIDsBotonesDeAtaqueEnPantalla = [];
let arrayIDsBotonesDeDefensaEnPantalla = []; */
const arrayMovimientosJugador = [];
let arrayMovimientosEnemigo = [];
let objMovimientoEnemigo;
let objAtaqueJugador;
let objDefensaJugador;

//resultados
const EMPATE = 'empate 😐';
const GANASTE = 'ganaste! 😎';
const PERDISTE = 'perdiste 😕';

// elementos manipulables
//seccion 1
const botonPersonajeJugador = document.getElementById('boton-seleccionar-personaje');
const seccionElegirpersonaje = document.getElementById('seleccionar-personaje');
const contenedorPersonajes = document.getElementById('contenedor-personajes');

//seccion2
const seccionSeleccionarAtaques = document.getElementById('seleccionar-ataque');
const relato = document.getElementById('relato')
const seccionBotonesAtaquesJugador = document.getElementById('seccion-botones-ataques-jugador');
const seccionCantidadAtaquesJugador = document.getElementById('seccion-cantidad-ataques-jugador');
const seccionBotonesDefensaJugador = document.getElementById('seccion-botones-defensa-jugador');
const seccionBotonesHabilidadEspecialJugador = document.getElementById('seccion-botones-habilidad-especial-jugador');
const seccionBotonesAtaquesEnemigo = document.getElementById('seccion-botones-ataques-enemigo');
const seccionBotonesDefensaEnemigo = document.getElementById('seccion-botones-defensa-enemigo');
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
let botonMilagroSalud;
let botonMilagroAnularAtaque;
// botones de ataque CN
let botonAtaqueFuego;
let botonEfectoIra;
// botones defensas
let botonDefensaRodar;
let botonDefensaEscudoMadera;
let botonDefensaEscudoMagico;
let botonDefensaEscudoMagicoOscuro;

// todo: desarrollo pendiente
let botonHabilidadEspecialMaldecir; // CN: efecto por 3 rondas, chance de inflingir la mitad de danio y de defender mal
let botonHabilidadEspecialAnularAtaque; // CR: un solo uso, si el enemigo usa un ataque, este es 100% repelido
let botonHabilidadEspecialRestaurarPS; // CR: un solo uso, cura 35 PS
let botonHabilidadEspecialFuria; //2 turnos, para el templario : aumenta un 20% su fuerza de ataque
let botonHabilidadEspecial // HB: te roba la habilidad especial por un turno, luego se pierde elefecto --> si esta duraba mas, como la del CR o CT, se rompe

// luego de que se carga todo el HTML, inicia el juego
window.addEventListener('load', iniciarJuego)

async function iniciarJuego() {
    //step 1
    console.log('cargo OK el juego')
    await crearPersonajes();

    // inyecta el js en el DOM
    personajesJugador.forEach((personaje) => {
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
    botonPersonajeJugador.addEventListener('click', seleccionarPersonajeJugador)

    // boton de reiniciar oculto por defecto
    botonReiniciar.style.display = 'none';
    botonReiniciar.addEventListener('click', reiniciarJuego);

    // STEP 2 oculta por defecto
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
        personaje = personajesJugador.filter(per => per.id == personajeID)
        // modifica el HTML de forma dinamica
        objPersonajeJugador = personaje[0];
        nombrePersonajeJugadorDOM.innerHTML = objPersonajeJugador.nombre;
        console.log('Has seleccionado a', objPersonajeJugador)
        // oculto seccion elegir personaje
        seccionElegirpersonaje.style.display = 'none';

        // PC elige personaje
        seleccionarpersonajePC();

        // habilito seccion para elegir ataques
        seccionSeleccionarAtaques.style.display = 'flex';
    }
}

function seleccionarpersonajePC() {
    console.log('Se elige el guerrero de la PC de entre ', TOTAL_GUERREROS, ' disponibles.');
    let numRandom = Math.floor(Math.random() * (TOTAL_GUERREROS - MINIMO + 1))
   let enemigo = personajesEnemigo[numRandom];
    //diego
    //let enemigo = personajesEnemigo[0];
    objPersonajeEnemigo = new Personaje(enemigo.id, enemigo.nombre, enemigo.salud, enemigo.foto, enemigo.ataques, enemigo.defensas)
    nombrePersonajeEnemigoDOM.innerHTML = objPersonajeEnemigo.nombre;
    console.log('Tu enemigo sera el', objPersonajeEnemigo)

    arrayMovimientosEnemigo = objPersonajeEnemigo.movimientos;

    cargarAtaquesDefensasEnPantalla();
}

// step 2
function cargarAtaquesDefensasEnPantalla() {
    // creacion de botones de ataque en el front
    objPersonajeJugador.ataques.forEach((atack) => {
        let botonDeAtaque = `
        <button class="boton-ataque" id="${atack.id}">${atack.icon}  ${atack.name} | ${atack.cant} </button> 
        `
        //arrayIDsBotonesDeAtaqueEnPantalla.push(atack.id);
        seccionBotonesAtaquesJugador.innerHTML += botonDeAtaque;

        /*
        // contadores , estan estaticos TODO : corregir
        let cantidadDeAtaques = `
        <button class="boton-ataque" id="cant-ataques">${atack.icon}  ${atack.cant}  </button> 
        `
        //arrayIDsBotonesDeAtaqueEnPantalla.push(atack.id);
        seccionCantidadAtaquesJugador.innerHTML += cantidadDeAtaques;
        */    
    })

    // creacion de botones de defensa en el front
    objPersonajeJugador.defensas.forEach((defense) => {

        // JSON de defensas: si no es una defensa, es una H.Especial
        if (defense.id.includes('defensa-')){
            let botonDeDefensa = `
            <button class="boton-defensa" id="${defense.id}">${defense.icon}  ${defense.name} | ${defense.cant} </button> 
            `
            //arrayIDsBotonesDeDefensaEnPantalla.push(defense.id);
            seccionBotonesDefensaJugador.innerHTML += botonDeDefensa;
        } else {
            let botonHabilidadEspecial = `
            <button class="boton-habilidad-especial" id="${defense.id}">${defense.icon}  ${defense.name} | ${defense.cant} </button> 
            `
            //arrayIDsBotonesDeDefensaEnPantalla.push(defense.id);
            seccionBotonesHabilidadEspecialJugador.innerHTML += botonHabilidadEspecial;
        }
   })

    // creacion de botones de ataque en el front
    objPersonajeEnemigo.ataques.forEach((atack) => {
        let botonDeAtaque = `
        <button class="boton-enemigo boton-ataque" id="enemigo-${atack.id}" >${atack.icon}  ${atack.name} | ${atack.cant} </button> 
        `
        //arrayIDsBotonesDeAtaqueEnPantalla.push(atack.id);
        seccionBotonesAtaquesEnemigo.innerHTML += botonDeAtaque;
    })

    // creacion de botones de defensa en el front
     objPersonajeEnemigo.defensas.forEach((defense) => {
        let botonDeDefensa = `
        <button class="boton-defensa" id="enemigo-${defense.id}">${defense.icon}  ${defense.name} | ${defense.cant} </button> 
        `
        //arrayIDsBotonesDeDefensaEnPantalla.push(defense.id);
        seccionBotonesDefensaEnemigo.innerHTML += botonDeDefensa;
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
    botonAtaqueDosManos = document.getElementById('ataque-dos-manos');
    botonAtaqueDaga = document.getElementById('ataque-daga');
    botonAtaqueFuego = document.getElementById('ataque-piromancia');
    botonAtaqueDebil.addEventListener('click', ataqueDebil);
    botonAtaqueFuerte.addEventListener('click', ataqueFuerte);
    botonAtaqueDosManos.addEventListener('click', ataqueA2Manos);
    botonAtaqueDaga.addEventListener('click', ataqueDaga)
    botonAtaqueFuego.addEventListener('click', ataquePiromancia);
    
    botonEfectoIra = document.getElementById('efecto-ira')
    botonEfectoIra.addEventListener('click', efectoIra);


    botonDefensaEscudoMagico = document.getElementById('defensa-magica');
    botonDefensaRodar = document.getElementById('defensa-rodar');
    botonDefensaEscudoMagicoOscuro = document.getElementById('defensa-oscura');
    botonDefensaEscudoMagico.addEventListener('click', defensaEscMagico)
    botonDefensaRodar.addEventListener('click', defensaRodar)
    botonDefensaEscudoMagicoOscuro.addEventListener('click', defensaEscMagicoOscuro)

    arrayMovimientosJugador.push(botonAtaqueDaga, botonAtaqueDebil, botonAtaqueFuerte, botonAtaqueFuego, botonAtaqueDosManos,botonDefensaEscudoMagico, botonDefensaRodar,botonDefensaEscudoMagicoOscuro,botonEfectoIra);
    console.log('diego',arrayMovimientosJugador);

}

function asociarBotonesCaballeroReal() {
    botonAtaqueRayo = document.getElementById('ataque-rayo');
    botonAtaqueDobleRayo = document.getElementById('doble-rayo');
    botonAtaqueFuerte = document.getElementById('ataque-fuerte');
    botonAtaqueRayo.addEventListener('click', ataqueRayo);
    botonAtaqueDobleRayo.addEventListener('click', ataqueDobleRayo)
    botonAtaqueFuerte.addEventListener('click', ataqueFuerte);

    botonDefensaEscudoMagico = document.getElementById('defensa-magica');
    botonDefensaEscudoMadera = document.getElementById('defensa-escudo-madera');
    botonDefensaRodar = document.getElementById('defensa-rodar');
    botonDefensaEscudoMagico.addEventListener('click', defensaEscMagico)
    botonDefensaRodar.addEventListener('click', defensaRodar)
    botonDefensaEscudoMadera.addEventListener('click', defensaEscMadera)

    botonMilagroAnularAtaque = document.getElementById('milagro-de-paz')
    botonMilagroSalud = document.getElementById('milagro-salud')
    botonMilagroAnularAtaque.addEventListener('click', milagroAnularAtaque);
    botonMilagroSalud.addEventListener('click', milagroRestaurarPS);

    arrayMovimientosJugador.push(botonAtaqueRayo, botonAtaqueDobleRayo, botonAtaqueFuerte,botonDefensaEscudoMagico,botonDefensaEscudoMadera,botonDefensaRodar);
    console.log('diego',arrayMovimientosJugador);
}

function asociarBotonesCaballeroTemplario() {
    botonAtaqueDebil = document.getElementById('ataque-debil');
    botonAtaqueDaga = document.getElementById('ataque-daga');
    botonAtaqueFuerte = document.getElementById('ataque-fuerte');
    botonAtaqueDosManos = document.getElementById('ataque-dos-manos');
    botonAtaqueDebil.addEventListener('click', ataqueDebil);
    botonAtaqueDaga.addEventListener('click', ataqueDaga)
    botonAtaqueFuerte.addEventListener('click', ataqueFuerte);
    botonAtaqueDosManos.addEventListener('click', ataqueA2Manos);

    botonDefensaEscudoMadera = document.getElementById('defensa-escudo-madera');
    botonDefensaRodar = document.getElementById('defensa-rodar');
    botonDefensaRodar.addEventListener('click', defensaRodar)
    botonDefensaEscudoMadera.addEventListener('click', defensaEscMadera)

    arrayMovimientosJugador.push(botonAtaqueDaga, botonAtaqueDebil, botonAtaqueFuerte, botonAtaqueDosManos,botonDefensaEscudoMadera, botonDefensaRodar);
    console.log('diego',arrayMovimientosJugador);
}

function asociarBotonesHechiceroBadass() {
    botonAtaqueFlechaMagica = document.getElementById('flecha-magica');
    botonAtaqueRafagaMagica = document.getElementById('rafaga-magica');
    botonAtaqueDaga = document.getElementById('ataque-daga');
    botonAtaqueFlechaMagica.addEventListener('click', ataqueFlechaMagica);
    botonAtaqueRafagaMagica.addEventListener('click', ataqueRafagaMagica);
    botonAtaqueDaga.addEventListener('click', ataqueDaga);

    botonDefensaEscudoMagico = document.getElementById('defensa-magica');
    botonDefensaEscudoMadera = document.getElementById('defensa-escudo-madera');
    botonDefensaRodar = document.getElementById('defensa-rodar');
    botonDefensaEscudoMagico.addEventListener('click', defensaEscMagico)
    botonDefensaRodar.addEventListener('click', defensaRodar)
    botonDefensaEscudoMadera.addEventListener('click', defensaEscMadera)

    arrayMovimientosJugador.push(botonAtaqueFlechaMagica, botonAtaqueRafagaMagica, botonAtaqueDaga,botonDefensaEscudoMagico,botonDefensaRodar,botonDefensaEscudoMadera);
    console.log('diego',arrayMovimientosJugador);
}
function ataquePiromancia() {
    objAtaqueJugador = objPersonajeJugador.getMovementById('ataque-piromancia');
    let buttonText = ` ${objAtaqueJugador.icon} ${objAtaqueJugador.name} | ${objAtaqueJugador.cant} `;
    botonAtaqueFuego.innerHTML = buttonText; 
    movimientoTurnoJugador = objAtaqueJugador.name;
    console.log('elegiste', objAtaqueJugador.name)
    seleccionarMovimientoEnemigo();
    if (objAtaqueJugador.cant == 0) {
        botonAtaqueFuego.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}

function milagroAnularAtaque(){
    objDefensaJugador = objPersonajeJugador.getMovementById('milagro-de-paz');
    let buttonText = ` ${objDefensaJugador.icon} ${objDefensaJugador.name} | ${objDefensaJugador.cant} `;
    botonMilagroAnularAtaque.innerHTML = buttonText; 
    movimientoTurnoJugador = objDefensaJugador.name;
    console.log('elegiste', objDefensaJugador.name)
    seleccionarMovimientoEnemigo();
    if (objDefensaJugador.cant == 0) {
        botonMilagroAnularAtaque.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}

function milagroRestaurarPS(){
    objDefensaJugador = objPersonajeJugador.getMovementById('milagro-salud');
    let buttonText = ` ${objDefensaJugador.icon} ${objDefensaJugador.name} | ${objDefensaJugador.cant} `;
    botonMilagroSalud.innerHTML = buttonText; 
    movimientoTurnoJugador = objDefensaJugador.name;
    console.log('elegiste', objDefensaJugador.name)
    seleccionarMovimientoEnemigo();
    if (objDefensaJugador.cant == 0) {
        botonMilagroSalud.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}

function efectoIra(){
    objDefensaJugador = objPersonajeJugador.getMovementById('efecto-ira');
    let buttonText = ` ${objDefensaJugador.icon} ${objDefensaJugador.name} | ${objDefensaJugador.cant} `;
    botonEfectoIra.innerHTML = buttonText; 
    movimientoTurnoJugador = objDefensaJugador.name;
    console.log('elegiste', objDefensaJugador.name)
    seleccionarMovimientoEnemigo();
    if (objDefensaJugador.cant == 0) {
        botonEfectoIra.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}

function defensaEscMadera() {
    objDefensaJugador = objPersonajeJugador.getMovementById('defensa-escudo-madera');
    let buttonText = ` ${objDefensaJugador.icon} ${objDefensaJugador.name} | ${objDefensaJugador.cant} `;
    botonDefensaEscudoMadera.innerHTML = buttonText; 
    movimientoTurnoJugador = objDefensaJugador.name;
    console.log('elegiste', objDefensaJugador.name)
    seleccionarMovimientoEnemigo();
    if (objDefensaJugador.cant == 0) {
        botonDefensaEscudoMadera.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}
function defensaEscMagico() {
    objDefensaJugador = objPersonajeJugador.getMovementById('defensa-magica');
    let buttonText = ` ${objDefensaJugador.icon} ${objDefensaJugador.name} | ${objDefensaJugador.cant} `;
    botonDefensaEscudoMagico.innerHTML = buttonText; 
    movimientoTurnoJugador = objDefensaJugador.name;
    console.log('elegiste', objDefensaJugador.name)
    seleccionarMovimientoEnemigo();
    if (objDefensaJugador.cant == 0) {
        botonDefensaEscudoMagico.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}

function defensaEscMagicoOscuro() {
    objDefensaJugador = objPersonajeJugador.getMovementById('defensa-oscura');
    let buttonText = ` ${objDefensaJugador.icon} ${objDefensaJugador.name} | ${objDefensaJugador.cant} `;
    botonDefensaEscudoMagicoOscuro.innerHTML = buttonText; 
    movimientoTurnoJugador = objDefensaJugador.name;
    console.log('elegiste', objDefensaJugador.name)
    seleccionarMovimientoEnemigo();
    if (objDefensaJugador.cant == 0) {
        botonDefensaEscudoMagicoOscuro.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}

function defensaRodar() {
    objDefensaJugador = objPersonajeJugador.getMovementById('defensa-rodar');
    let buttonText = ` ${objDefensaJugador.icon} ${objDefensaJugador.name} | ${objDefensaJugador.cant} `;
    botonDefensaRodar.innerHTML = buttonText; 
    movimientoTurnoJugador = objDefensaJugador.name;
    console.log('elegiste', objDefensaJugador.name)
    seleccionarMovimientoEnemigo();
    if (objDefensaJugador.cant == 0) {
        botonDefensaRodar.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}
function ataqueRayo() {
    objAtaqueJugador = objPersonajeJugador.getMovementById('ataque-rayo');
    let buttonText = ` ${objAtaqueJugador.icon} ${objAtaqueJugador.name} | ${objAtaqueJugador.cant} `;
    botonAtaqueRayo.innerHTML = buttonText; 
    movimientoTurnoJugador = objAtaqueJugador.name;
    console.log('elegiste', objAtaqueJugador.name)
    seleccionarMovimientoEnemigo();
    if (objAtaqueJugador.cant == 0) {
        botonAtaqueRayo.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}

function ataqueDobleRayo() {
    objAtaqueJugador = objPersonajeJugador.getMovementById('doble-rayo');
    let buttonText = ` ${objAtaqueJugador.icon} ${objAtaqueJugador.name} | ${objAtaqueJugador.cant} `;
    botonAtaqueDobleRayo.innerHTML = buttonText; 
    movimientoTurnoJugador = objAtaqueJugador.name;
    console.log('elegiste', objAtaqueJugador.name)
    seleccionarMovimientoEnemigo();
    if (objAtaqueJugador.cant == 0) {
        botonAtaqueDobleRayo.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}

function ataqueA2Manos() {
    objAtaqueJugador = objPersonajeJugador.getMovementById('ataque-dos-manos');
    let buttonText = ` ${objAtaqueJugador.icon} ${objAtaqueJugador.name} | ${objAtaqueJugador.cant} `;
    botonAtaqueDosManos.innerHTML = buttonText; 
    movimientoTurnoJugador = objAtaqueJugador.name;
    console.log('elegiste', objAtaqueJugador.name)
    seleccionarMovimientoEnemigo();
    if (objAtaqueJugador.cant == 0) {
        botonAtaqueDosManos.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}

function ataqueFuerte() {
    objAtaqueJugador = objPersonajeJugador.getMovementById('ataque-fuerte');
    let buttonText = ` ${objAtaqueJugador.icon} ${objAtaqueJugador.name} | ${objAtaqueJugador.cant} `;
    botonAtaqueFuerte.innerHTML = buttonText; 
    movimientoTurnoJugador = objAtaqueJugador.name;
    console.log('elegiste', objAtaqueJugador.name)
    seleccionarMovimientoEnemigo();
    if (objAtaqueJugador.cant == 0) {
        botonAtaqueFuerte.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}
function ataqueDebil() {
    objAtaqueJugador = objPersonajeJugador.getMovementById('ataque-debil');
    let buttonText = ` ${objAtaqueJugador.icon} ${objAtaqueJugador.name} | ${objAtaqueJugador.cant} `;
    botonAtaqueDebil.innerHTML = buttonText; 
    movimientoTurnoJugador = objAtaqueJugador.name;
    console.log('elegiste', objAtaqueJugador.name)
    seleccionarMovimientoEnemigo();
    if (objAtaqueJugador.cant == 0) {
        botonAtaqueDebil.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}
function ataqueFlechaMagica() {
    objAtaqueJugador = objPersonajeJugador.getMovementById('flecha-magica');
    let buttonText = ` ${objAtaqueJugador.icon} ${objAtaqueJugador.name} | ${objAtaqueJugador.cant} `;
    botonAtaqueFlechaMagica.innerHTML = buttonText; 
    movimientoTurnoJugador = objAtaqueJugador.name;
    console.log('elegiste', objAtaqueJugador.name)
    seleccionarMovimientoEnemigo();
    if (objAtaqueJugador.cant == 0) {
        botonAtaqueFlechaMagica.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}
function ataqueRafagaMagica() {
    objAtaqueJugador = objPersonajeJugador.getMovementById('rafaga-magica');
    let buttonText = ` ${objAtaqueJugador.icon} ${objAtaqueJugador.name} | ${objAtaqueJugador.cant} `;
    botonAtaqueRafagaMagica.innerHTML = buttonText; 
    movimientoTurnoJugador = objAtaqueJugador.name;
    console.log('elegiste', objAtaqueJugador.name)
    seleccionarMovimientoEnemigo();
    if (objAtaqueJugador.cant == 0) {
        botonAtaqueRafagaMagica.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}
function ataqueDaga() {

    objAtaqueJugador = objPersonajeJugador.getMovementById('ataque-daga');
    let buttonText = ` ${objAtaqueJugador.icon} ${objAtaqueJugador.name} | ${objAtaqueJugador.cant} `;
    botonAtaqueDaga.innerHTML = buttonText; 
    movimientoTurnoJugador = objAtaqueJugador.name;
    console.log('elegiste', objAtaqueJugador.name)
    seleccionarMovimientoEnemigo();
    if (objAtaqueJugador.cant == 0) {
        botonAtaqueDaga.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}


function seleccionarMovimientoEnemigo() {

    if (arrayMovimientosEnemigo.length != 0) {
        
        let numRandom = Math.floor(Math.random() * (arrayMovimientosEnemigo.length - MIN_ATAQUES + 1));
        objMovimientoEnemigo = arrayMovimientosEnemigo[numRandom];
        objMovimientoEnemigo.cant--;
        movimientoTurnoEnemigo = objMovimientoEnemigo.name;
         //obtengo el boton para manipularlo luego
         let botonSeleccionado = document.getElementById(`enemigo-${objMovimientoEnemigo.id}`);

        // actualiza el texto del boton del enemigo
        let buttonText = ` ${objMovimientoEnemigo.icon} ${objMovimientoEnemigo.name} | ${objMovimientoEnemigo.cant} `;
        botonSeleccionado.innerHTML = buttonText;

        if (objMovimientoEnemigo.cant == 0) {
            // saca elemento del array
            let movEliminado = objPersonajeEnemigo.deleteElementById(objMovimientoEnemigo.id);
            // deshabilita boton 
            botonSeleccionado.disabled = true;
        }

        console.log('la PC elegio:', movimientoTurnoEnemigo)
        if (arrayMovimientosEnemigo.length == 0) {
            console.warn('El enemigo se quedo sin movimientos!!')
        }
    } else {
        console.warn('enemigo pasa el turno')
        objMovimientoEnemigo = null;
    }
    realizarCombate(objAtaqueJugador, objMovimientoEnemigo);
}

function checkIfAllAtacksAreDisabled(){
    // check si mis ataques estan agotados
    let myMovements = arrayMovimientosJugador.every((button) => button.disabled == true)
    
    // check if all the enemy movements are disabled
    let enemyMovements = arrayMovimientosEnemigo.length;
    console.log('----result', myMovements, 'ataques dispo Enemigo:', enemyMovements)
// todo: mejorar logica, llamados repetidos
    if (myMovements && enemyMovements == 0){
        determinateWhoWins();
    } else if (myMovements) {
        console.error('El jugador se queda sin movimientos')
        allowEnemyToAtackWithAllEnergy();
        determinateWhoWins();
    }
}
function determinateWhoWins (){
    console.log('determinando quien gano...')
    let resultado;
    let saludEnemigo = objPersonajeEnemigo.salud; 
    let saludJugador = objPersonajeJugador.salud;
    if(saludEnemigo == saludJugador){
        resultado = EMPATE;
    } else if (saludJugador > saludEnemigo){
        resultado = GANASTE;
    } else {
        resultado = PERDISTE;
    }
    crearMensajeFinDeJuego(resultado);
}
function allowEnemyToAtackWithAllEnergy(){
    let i = 0;
    while (objMovimientoEnemigo !== null && i<10){ // i es un comodin por las dudas...
        console.log('obj ataque', objMovimientoEnemigo)
        console.log('ataque extra numero: ', i)
        i++;
        seleccionarMovimientoEnemigo();
    }
}
// todo: modificar esta logica por completo, segun ataques y defensas
function realizarCombate(objAtaquePlayer, objMovimientoEnemigo) {
    numRonda == 1 ? console.log('arranca el combate!') : console.warn('================= ronda numero', numRonda ,'=================');
    let resultado;

    if (movimientoTurnoJugador == movimientoTurnoEnemigo) {
        resultado = EMPATE;
    } else if ((movimientoTurnoJugador == FUEGO && movimientoTurnoEnemigo == TIERRA)
        || (movimientoTurnoJugador == AGUA && movimientoTurnoEnemigo == FUEGO)
        || (movimientoTurnoJugador == TIERRA && movimientoTurnoEnemigo == AGUA)) {
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
    numRonda++;
}

function actualizarVidasPC() {
    vidasPC--;
    vidasEnemigo.innerHTML = vidasPC;
}

function actualizarVidasPlayer() {
    vidasPlayer--;
    vidasJugador.innerHTML = vidasPlayer;

}
async function crearPersonajes() {
    // todo: recibir de parametro cuantos guerreros diferentes crear
    PERSONAJES_ID = [ID_CABALLERO_NEGRO, ID_CABALLERO_REAL, ID_CABALLERO_TEMPLARIO, ID_HECHICERO_BADASS];

    await obtenerMovimientos();

    let caballeroNegro = new Personaje(ID_CABALLERO_NEGRO, 'Caballero Negro', 120,
        './../assets/img/personajes/caballero-negro.png', ataquesCaballeroNegro, defensasCaballeroNegro);

    let caballeroReal = new Personaje(ID_CABALLERO_REAL, 'Caballero Real', 100,
        './../assets/img/personajes/caballero-real.png', ataquesCaballeroReal, defensasCaballeroReal);

    let caballeroTemplario = new Personaje(ID_CABALLERO_TEMPLARIO, 'Caballero Templario', 110,
        './../assets/img/personajes/caballero_templario.png', ataquesCaballeroTemplario, defensasCaballeroTemplario);

    let hechiceroBadass = new Personaje(ID_HECHICERO_BADASS, 'Hechicero Badass', 90,
        './../assets/img/personajes/hechicero-badass.png', ataquesHechiceroBadass, defensasHechiceroBadass);


    personajesJugador = [caballeroNegro, caballeroReal, caballeroTemplario, hechiceroBadass];
    // clono el array para evitar conflictos en el combate
    //personajesEnemigo = structuredClone(personajesJugador);
    personajesEnemigo = JSON.parse(JSON.stringify(personajesJugador))
    TOTAL_GUERREROS = personajesJugador.length;

    console.log('Los guerreros esperan su destino...', personajesJugador, personajesEnemigo);

}

async function obtenerMovimientos() {

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

function crearMensajeFinDeJuego(mensaje) {
    let mensajeFinal = document.createElement('p');
    if (mensaje == GANASTE) {
        mensajeFinal.innerHTML = 'VAMOOO GANASTE!!'
        contadorRachasVictorias++;
    } else if (mensaje == PERDISTE) {
        mensajeFinal.innerHTML = 'Te derrotaron, vuelve a intentarlo, no te rindas!'
        contadorRachasDerrotas++;
    } else if (mensaje == EMPATE) {
        mensajeFinal.innerHTML = 'qUE RESULTADO CULIAO!'
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
    parrafoAtaqueJugador.innerHTML = movimientoTurnoJugador;
    parrafoAtaqueEnemigo.innerHTML = movimientoTurnoEnemigo;

    //editamos el relato
   // console.log(suceso)
    relato.innerHTML = obtenerFraseSegunSuceso(suceso)

    // creamos el elemento p
    let parrafo = document.createElement('p');
    /* parrafo.innerHTML = `Atacas con ${movimientoTurnoJugador}, y el enemigo se defiende con ${movimientoTurnoEnemigo} --> ${resultado}`; */
    parrafo.innerHTML = `YO: ${movimientoTurnoJugador} -- PC: ${movimientoTurnoEnemigo} --> ${resultado}`;
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
   // console.log(relato)
    return relato;
}

function reiniciarJuego() {
    location.reload();
}


