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

// tipos de movimientos
let tipoMovJugador;
let tipoMovEnemigo;
const ATAQUE = 'ATAQUE';
const DEFENSA = 'DEFENSA';
const RODAR = 'RODAR';
const EFECTO_ESPECIAL = 'EFECTO-ESPECIAL'
const PIEDAD = 'piedad... piedad!!';
const ERROR = '***** ERROR *****';


// contadores
let contadorRachasDerrotas = 0;
let contadorRachasVictorias = 0;
let numRonda = 1;
let partidaFinalizada = false;
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

const MIN_ATAQUES = 1;
/* let arrayIDsBotonesDeAtaqueEnPantalla = [];
let arrayIDsBotonesDeDefensaEnPantalla = []; */
const arrayMovimientosJugador = [];
let arrayMovimientosEnemigo = [];
let objMovimientoEnemigo;
let objMovimientoJugador;



//resultados
const EMPATE = 'empate 😐';
const GANASTE = 'ganaste! 😎';
const PERDISTE = 'perdiste 😕';
let resultadoFinal = null;

// elementos manipulables
//seccion 1
const botonPersonajeJugador = document.getElementById('boton-seleccionar-personaje');
const seccionElegirpersonaje = document.getElementById('seleccionar-personaje');
const contenedorPersonajes = document.getElementById('contenedor-personajes');

//seccion2
const seccionSeleccionarAtaques = document.getElementById('seleccionar-ataque');
const relato = document.getElementById('relato')
const divBotonesMovimientosPersonajes = document.getElementById('botones-jugadores');
const seccionBotonesAtaquesJugador = document.getElementById('seccion-botones-ataques-jugador');
const seccionCantidadAtaquesJugador = document.getElementById('seccion-cantidad-ataques-jugador');
const seccionBotonesDefensaJugador = document.getElementById('seccion-botones-defensa-jugador');
const seccionBotonesHabilidadEspecialJugador = document.getElementById('seccion-botones-habilidad-especial-jugador');
const seccionBotonesAtaquesEnemigo = document.getElementById('seccion-botones-ataques-enemigo');
const seccionBotonesDefensaEnemigo = document.getElementById('seccion-botones-defensa-enemigo');
const nombrePersonajeEnemigoDOM = document.getElementById('personaje-enemigo');
const nombrePersonajeJugadorDOM = document.getElementById('personaje-jugador');
const domBarraSaludEnemigo = document.getElementById('barra-vidas-enemigo');
const domBarraSaludJugador = document.getElementById('barra-vidas-jugador');
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
        //console.debug('Has seleccionado a', objPersonajeJugador)
        // oculto seccion elegir personaje
        seccionElegirpersonaje.style.display = 'none';

        domBarraSaludJugador.innerHTML = objPersonajeJugador.salud;
        // PC elige personaje
        seleccionarpersonajePC();

        // habilito seccion para elegir ataques
        seccionSeleccionarAtaques.style.display = 'flex';
    }
}

function seleccionarpersonajePC() {
    // console.debug('Se elige el guerrero de la PC de entre ', TOTAL_GUERREROS, ' disponibles.');
    let numRandom = Math.floor(Math.random() * (TOTAL_GUERREROS - MINIMO + 1))
    //let enemigo = personajesEnemigo[numRandom];
    //diego
    let enemigo = personajesEnemigo[0];
    objPersonajeEnemigo = new Personaje(enemigo.id, enemigo.nombre, enemigo.salud, enemigo.foto, enemigo.ataques, enemigo.defensas)
    nombrePersonajeEnemigoDOM.innerHTML = objPersonajeEnemigo.nombre;
    // console.debug('Tu enemigo sera el', objPersonajeEnemigo)

    arrayMovimientosEnemigo = objPersonajeEnemigo.movimientos;
    domBarraSaludEnemigo.innerHTML = objPersonajeEnemigo.salud;
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
        if (defense.id.includes('defensa-')) {
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
    botonEfectoIra = document.getElementById('efecto-ira')

    botonAtaqueDebil.addEventListener('click', () => { realizarMovimiento('ataque-debil') });
    botonAtaqueFuerte.addEventListener('click', () => { realizarMovimiento('ataque-fuerte') });
    botonAtaqueDosManos.addEventListener('click', () => { realizarMovimiento('ataque-dos-manos') });
    botonAtaqueDaga.addEventListener('click', () => { realizarMovimiento('ataque-daga') });
    botonAtaqueFuego.addEventListener('click', () => { realizarMovimiento('ataque-piromancia') });
    botonEfectoIra.addEventListener('click', () => { realizarMovimiento('efecto-ira') });

    botonDefensaEscudoMagico = document.getElementById('defensa-magica');
    botonDefensaRodar = document.getElementById('defensa-rodar');
    botonDefensaEscudoMagicoOscuro = document.getElementById('defensa-oscura');

    botonDefensaEscudoMagico.addEventListener('click', () => { realizarMovimiento('defensa-magica') });
    botonDefensaRodar.addEventListener('click', () => { realizarMovimiento('defensa-rodar') });
    botonDefensaEscudoMagicoOscuro.addEventListener('click', () => { realizarMovimiento('defensa-oscura') });

    arrayMovimientosJugador.push(botonAtaqueDaga, botonAtaqueDebil, botonAtaqueFuerte, botonAtaqueFuego, botonAtaqueDosManos, botonDefensaEscudoMagico, botonDefensaRodar, botonDefensaEscudoMagicoOscuro, botonEfectoIra);
    // console.log('diego', arrayMovimientosJugador);

}

function asociarBotonesCaballeroReal() {
    botonAtaqueRayo = document.getElementById('ataque-rayo');
    botonAtaqueDobleRayo = document.getElementById('ataque-doble-rayo');
    botonAtaqueFuerte = document.getElementById('ataque-fuerte');
    botonAtaqueRayo.addEventListener('click', () => { realizarMovimiento('ataque-rayo') });
    botonAtaqueDobleRayo.addEventListener('click', () => { realizarMovimiento('ataque-doble-rayo') });
    botonAtaqueFuerte.addEventListener('click', () => { realizarMovimiento('ataque-fuerte') });

    botonDefensaEscudoMagico = document.getElementById('defensa-magica');
    botonDefensaRodar = document.getElementById('defensa-rodar');
    botonDefensaEscudoMadera = document.getElementById('defensa-escudo-madera');
    botonDefensaEscudoMagico.addEventListener('click', () => { realizarMovimiento('defensa-magica') });
    botonDefensaRodar.addEventListener('click', () => { realizarMovimiento('defensa-rodar') });
    botonDefensaEscudoMadera.addEventListener('click', () => { realizarMovimiento('defensa-escudo-madera') });

    botonMilagroAnularAtaque = document.getElementById('milagro-de-paz')
    botonMilagroSalud = document.getElementById('milagro-salud')
    botonMilagroAnularAtaque.addEventListener('click', () => { realizarMovimiento('milagro-de-paz') });
    botonMilagroSalud.addEventListener('click', () => { realizarMovimiento('milagro-salud') });

    arrayMovimientosJugador.push(botonAtaqueRayo, botonAtaqueDobleRayo, botonAtaqueFuerte, botonDefensaEscudoMagico, botonDefensaEscudoMadera, botonDefensaRodar);
    //console.log('diego', arrayMovimientosJugador);
}

function asociarBotonesCaballeroTemplario() {
    botonAtaqueDebil = document.getElementById('ataque-debil');
    botonAtaqueDaga = document.getElementById('ataque-daga');
    botonAtaqueFuerte = document.getElementById('ataque-fuerte');
    botonAtaqueDosManos = document.getElementById('ataque-dos-manos');

    botonAtaqueDebil.addEventListener('click', () => { realizarMovimiento('ataque-debil') });
    botonAtaqueDaga.addEventListener('click', () => { realizarMovimiento('ataque-daga') });
    botonAtaqueFuerte.addEventListener('click', () => { realizarMovimiento('ataque-fuerte') });
    botonAtaqueDosManos.addEventListener('click', () => { realizarMovimiento('ataque-dos-manos') });



    botonDefensaEscudoMadera = document.getElementById('defensa-escudo-madera');
    botonDefensaRodar = document.getElementById('defensa-rodar');
    botonDefensaEscudoMadera.addEventListener('click', () => { realizarMovimiento('defensa-escudo-madera') });
    botonDefensaRodar.addEventListener('click', () => { realizarMovimiento('defensa-rodar') });

    arrayMovimientosJugador.push(botonAtaqueDaga, botonAtaqueDebil, botonAtaqueFuerte, botonAtaqueDosManos, botonDefensaEscudoMadera, botonDefensaRodar);
    //console.log('diego', arrayMovimientosJugador);
}

function asociarBotonesHechiceroBadass() {
    botonAtaqueFlechaMagica = document.getElementById('ataque-flecha-magica');
    botonAtaqueRafagaMagica = document.getElementById('ataque-rafaga-magica');
    botonAtaqueDaga = document.getElementById('ataque-daga');
    botonAtaqueFlechaMagica.addEventListener('click', () => { realizarMovimiento('ataque-flecha-magica') });
    botonAtaqueRafagaMagica.addEventListener('click', () => { realizarMovimiento('ataque-rafaga-magica') });
    botonAtaqueDaga.addEventListener('click', () => { realizarMovimiento('ataque-daga') });

    botonDefensaEscudoMagico = document.getElementById('defensa-magica');
    botonDefensaEscudoMadera = document.getElementById('defensa-escudo-madera');
    botonDefensaRodar = document.getElementById('defensa-rodar');
    botonDefensaEscudoMagico.addEventListener('click', () => { realizarMovimiento('defensa-magica') });
    botonDefensaEscudoMadera.addEventListener('click', () => { realizarMovimiento('defensa-escudo-madera') });
    botonDefensaRodar.addEventListener('click', () => { realizarMovimiento('defensa-rodar') });

    arrayMovimientosJugador.push(botonAtaqueFlechaMagica, botonAtaqueRafagaMagica, botonAtaqueDaga, botonDefensaEscudoMagico, botonDefensaRodar, botonDefensaEscudoMadera);
    //console.log('diego', arrayMovimientosJugador);
}

function realizarMovimiento(mov) {
    let botonSeleccionado;
    switch (mov) {
        case 'ataque-debil':
            objPersonajeJugador.objMovimientoSeleccionado = objPersonajeJugador.getMovementById('ataque-debil');
            objMovimientoJugador = objPersonajeJugador.objMovimientoSeleccionado;
            botonSeleccionado = botonAtaqueDebil;
            break;
        case 'ataque-fuerte':
            objPersonajeJugador.objMovimientoSeleccionado = objPersonajeJugador.getMovementById('ataque-fuerte');
            objMovimientoJugador = objPersonajeJugador.objMovimientoSeleccionado;
            botonSeleccionado = botonAtaqueFuerte;
            break;
        case 'ataque-daga':
            objPersonajeJugador.objMovimientoSeleccionado = objPersonajeJugador.getMovementById('ataque-daga');
            objMovimientoJugador = objPersonajeJugador.objMovimientoSeleccionado;
            botonSeleccionado = botonAtaqueDaga;
            break;
        case 'ataque-dos-manos':
            objPersonajeJugador.objMovimientoSeleccionado = objPersonajeJugador.getMovementById('ataque-dos-manos');
            objMovimientoJugador = objPersonajeJugador.objMovimientoSeleccionado;
            botonSeleccionado = botonAtaqueDosManos;
            break;
        case 'ataque-rafaga-magica':
            objPersonajeJugador.objMovimientoSeleccionado = objPersonajeJugador.getMovementById('ataque-rafaga-magica');
            objMovimientoJugador = objPersonajeJugador.objMovimientoSeleccionado;
            botonSeleccionado = botonAtaqueRafagaMagica;
            break;
        case 'ataque-flecha-magica':
            objPersonajeJugador.objMovimientoSeleccionado = objPersonajeJugador.getMovementById('ataque-flecha-magica');
            objMovimientoJugador = objPersonajeJugador.objMovimientoSeleccionado;
            botonSeleccionado = botonAtaqueFlechaMagica;
            break;
        case 'ataque-doble-rayo':
            objPersonajeJugador.objMovimientoSeleccionado = objPersonajeJugador.getMovementById('ataque-doble-rayo');
            objMovimientoJugador = objPersonajeJugador.objMovimientoSeleccionado;
            botonSeleccionado = botonAtaqueDobleRayo;
            break;
        case 'ataque-rayo':
            objPersonajeJugador.objMovimientoSeleccionado = objPersonajeJugador.getMovementById('ataque-rayo');
            objMovimientoJugador = objPersonajeJugador.objMovimientoSeleccionado;
            botonSeleccionado = botonAtaqueRayo;
            break;
        case 'ataque-piromancia':
            objPersonajeJugador.objMovimientoSeleccionado = objPersonajeJugador.getMovementById('ataque-piromancia');
            objMovimientoJugador = objPersonajeJugador.objMovimientoSeleccionado;
            botonSeleccionado = botonAtaqueFuego;
            break;
        case 'defensa-rodar':
            objPersonajeJugador.objMovimientoSeleccionado = objPersonajeJugador.getMovementById('defensa-rodar');
            objMovimientoJugador = objPersonajeJugador.objMovimientoSeleccionado;
            botonSeleccionado = botonDefensaRodar;
            break;
        case 'defensa-escudo-madera':
            objPersonajeJugador.objMovimientoSeleccionado = objPersonajeJugador.getMovementById('defensa-escudo-madera');
            objMovimientoJugador = objPersonajeJugador.objMovimientoSeleccionado;
            botonSeleccionado = botonDefensaEscudoMadera;
            break;
        case 'defensa-oscura':
            objPersonajeJugador.objMovimientoSeleccionado = objPersonajeJugador.getMovementById('defensa-oscura');
            objMovimientoJugador = objPersonajeJugador.objMovimientoSeleccionado;
            botonSeleccionado = botonDefensaEscudoMagicoOscuro;
            break;
        case 'defensa-magica':
            objPersonajeJugador.objMovimientoSeleccionado = objPersonajeJugador.getMovementById('defensa-magica');
            objMovimientoJugador = objPersonajeJugador.objMovimientoSeleccionado;
            botonSeleccionado = botonDefensaEscudoMagico;
            break;
        case 'efecto-ira':
            objPersonajeJugador.objMovimientoSeleccionado = objPersonajeJugador.getMovementById('efecto-ira');
            objMovimientoJugador = objPersonajeJugador.objMovimientoSeleccionado;
            botonSeleccionado = botonEfectoIra;
            break;
        case 'milagro-salud':
            objPersonajeJugador.objMovimientoSeleccionado = objPersonajeJugador.getMovementById('milagro-salud');
            objMovimientoJugador = objPersonajeJugador.objMovimientoSeleccionado;
            botonSeleccionado = botonMilagroSalud;
            break;
        case 'milagro-de-paz':
            objPersonajeJugador.objMovimientoSeleccionado = objPersonajeJugador.getMovementById('milagro-de-paz');
            objMovimientoJugador = objPersonajeJugador.objMovimientoSeleccionado;
            botonSeleccionado = botonMilagroAnularAtaque;
            break;
    }

    // parte general
    let buttonText = ` ${objMovimientoJugador.icon} ${objMovimientoJugador.name} | ${objMovimientoJugador.cant} `;
    botonSeleccionado.innerHTML = buttonText;
    console.warn(' mov jugador :', objPersonajeJugador.objMovimientoSeleccionado)
    movimientoTurnoJugador = objMovimientoJugador.name;
    seleccionarMovimientoEnemigo();
    if (objMovimientoJugador.cant == 0) {
        botonSeleccionado.disabled = true;
        checkIfAllMovementsAreDisabled()
    }
}

function seleccionarMovimientoEnemigo() {
    arrayMovimientosEnemigo = objPersonajeEnemigo.movimientos;

    if (arrayMovimientosEnemigo.length != 0) {
        // todo: si el jugador pide piedad, filtrar los ataques realizables de tipo ATAQUE nada mas, para que no pida piedad y que el enemigo haga un RODAR O UNA DEFENSA
        let numRandom = Math.floor(Math.random() * (arrayMovimientosEnemigo.length - MIN_ATAQUES + 1));
        objPersonajeEnemigo.objMovimientoSeleccionado = arrayMovimientosEnemigo[numRandom];
        objMovimientoEnemigo = objPersonajeEnemigo.objMovimientoSeleccionado;
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

        //console.debug('la PC elegio:', movimientoTurnoEnemigo)
        if (arrayMovimientosEnemigo.length == 0) {
            console.warn('El enemigo se quedo sin movimientos!!')
        }
    } else {
        console.warn('enemigo pasa el turno')
        objMovimientoEnemigo = null;
        movimientoTurnoEnemigo = PIEDAD // todo: incorporar un array de frases, y en cada turno imprimir una random
    }
    realizarCombate();
}

function checkIfAllMovementsAreDisabled() {
    // check si mis ataques estan agotados
    let myMovements = arrayMovimientosJugador.every((button) => button.disabled == true)

    // check if all the enemy movements are disabled
    let enemyMovements = arrayMovimientosEnemigo.length;
    console.log('----result', myMovements, 'ataques dispo Enemigo:', enemyMovements)
    // todo: mejorar logica, llamados repetidos
    if (myMovements && enemyMovements == 0) {
        console.warn(`=========================== ambos jugadores se quedaron sin movimientos ===========================`)
        determinateWhoWins();
    } else if (myMovements) {
        console.error('=========================== El jugador se queda sin movimientos ===========================')
        movimientoTurnoJugador = PIEDAD;
        objMovimientoJugador = null;
        allowEnemyToAtackWithAllEnergy();
        //determinateWhoWins();
    }
}

function allowEnemyToAtackWithAllEnergy() {
    let i = 0;
    while (movimientoTurnoEnemigo !== PIEDAD && i < 10 && !partidaFinalizada) { // i es un comodin por las dudas...
        console.log('--movimientoTurnoEnemigo', movimientoTurnoEnemigo)
        console.log('ataque extra numero: ', i)
        i++;
        seleccionarMovimientoEnemigo();
    }
}



function aumentarNumRonda() {
    if (numRonda > 1) {
        console.warn('================= ronda numero', numRonda, '=================');
    } else {
        console.warn('arranca el combate!');
    }
    numRonda++;
}

// todo: modificar esta logica por completo, segun ataques y defensas
// todo: revisar el orden de llamado a metodos y las validaciones
function realizarCombate() {

    aumentarNumRonda();

    // crea elemento con texto del combate
    crearMensajeCombate();

    // SI ENTRA ACA, ES QUE: 1. yo me quede sin ataques primero, y 2. la PC se termina sus ataques, pero no me baja a 0 la vida. Gana quien tenga mas PS
    if (movimientoTurnoEnemigo == PIEDAD && movimientoTurnoJugador == PIEDAD) {
        console.warn('nadie murio, tenemos un vencedor?')
        determinateWhoWins();
        return;
    }

    //let danioRecibido = actualizarSaludJugador();
    // el primer objeto es el Personaje que ataca, por ende, el dato devuelto es el danio que recibe el Personaje que defiende
    let danioJugador = actualizarSalud(objPersonajeEnemigo, objPersonajeJugador, 'defensor-ME');
    // 
    let danioEnemigo = actualizarSalud(objPersonajeJugador, objPersonajeEnemigo, 'defensor-Enemigo');

    console.error('saludJugador', objPersonajeJugador.salud, 'saludEnemigo', objPersonajeEnemigo.salud)

    if (objPersonajeJugador.salud <= 0 || objPersonajeEnemigo.salud <= 0) {
        console.error('alguien murio')
        determinateWhoWins();
    }
}

function determinateWhoWins() {
    let saludJugador = objPersonajeJugador.salud;
    let saludEnemigo = objPersonajeEnemigo.salud;

    console.log('determinando quien gano...')

    console.error('salud jugado', saludJugador, 'salud enemigo', saludEnemigo)

    // opc 1
    if (saludEnemigo == saludJugador) {
        resultadoFinal = EMPATE;
    } else if (saludJugador > saludEnemigo) {
        resultadoFinal = GANASTE;
    } else {
        resultadoFinal = PERDISTE;
    }

    console.warn(`***********${resultadoFinal}**********`)
    crearMensajeFinDeJuego(resultadoFinal);
}

function actualizarSalud(objPersonajeAtacante, objPersonajeDefensor, defensor) {
    // el DEFENSOR ES EL QUE RECIBE EL DAñO

    // ATACANTE
    let tipoAtaque;
    let puntosDeAtaque = 0;
    let tipoMov = objPersonajeAtacante.objMovimientoSeleccionado.movementType;
    /*
    danioRecibido = 0;
    danioAbsorbido = 0;
  */
    console.error('tipo ataque::', tipoMov)
    // DEFENSOR
    let porcResistencia = 0;
    let porcDebilidad = 0;
    let danioRecibido = 0;
    let danioAbsorbido = 0;
    let porcDefensaJugador;
    let resistencias;
    let debilidades;
    console.error(objPersonajeDefensor.objMovimientoSeleccionado.movementType)

    // se revisa el tipo de movimiento del jugador y del enemigo para popular los datos de la formula
    if (tipoMov == ATAQUE) {
        puntosDeAtaque = objPersonajeAtacante.objMovimientoSeleccionado.damage;
        tipoAtaque = objPersonajeAtacante.objMovimientoSeleccionado.type;
        if (objPersonajeDefensor.objMovimientoSeleccionado.movementType == DEFENSA) {
            const objDefensa = objPersonajeDefensor.objMovimientoSeleccionado;
            porcDefensaJugador = objDefensa.damageAbsorption;
            resistencias = objDefensa.resistance;
            debilidades = objDefensa.weakness;
            console.warn('----', 'tipoAtaque', tipoAtaque, ', resist', resistencias, ', debi', debilidades)
            porcResistencia = determinarPorcResistencia(tipoAtaque, resistencias);
            porcDebilidad = determinarPorcDebilidad(tipoAtaque, debilidades);
            console.log('eficiencia del escudo:', porcDefensaJugador, ' +', porcResistencia, ' -', porcDebilidad)
            danioAbsorbido = (puntosDeAtaque * ((porcDefensaJugador + porcResistencia - porcDebilidad) / 100))
            console.log('danio abs:', danioAbsorbido)
            danioRecibido = puntosDeAtaque - danioAbsorbido;
            console.log('danio reci:', danioRecibido)
            console.error('porcResistencia', porcResistencia, 'porcDebilidad', porcDebilidad)
            if (danioRecibido < 0) {
                danioRecibido = 0;
            }
        } else if (objPersonajeDefensor.objMovimientoSeleccionado.movementType == RODAR) {
            danioRecibido = 0;
        } else if (objPersonajeDefensor.objMovimientoSeleccionado.movementType == ATAQUE
            || objPersonajeDefensor.objMovimientoSeleccionado.movementType == PIEDAD) {
            danioRecibido = puntosDeAtaque
        }
    }

    console.error(puntosDeAtaque)

    if (objPersonajeDefensor.objMovimientoSeleccionado.movementType == EFECTO_ESPECIAL) {
        const objMovEspecial = objPersonajeDefensor.objMovimientoSeleccionado;
        let idMovEspecial = objMovEspecial.id;
        let movEspecial = objMovEspecial.specialEffect;
        console.log('diego', objMovEspecial)
        switch (idMovEspecial) {
            case 'efecto-ira':
                porcDefensaJugador = objMovEspecial.damageAbsorption;
                resistencias = objMovEspecial.resistance;
                debilidades = objMovEspecial.weakness;
                porcResistencia = determinarPorcResistencia(tipoAtaque, resistencias);
                porcDebilidad = determinarPorcDebilidad(tipoAtaque, debilidades);
                danioAbsorbido = (puntosDeAtaque * ((porcDefensaJugador + porcResistencia - porcDebilidad) / 100));
                console.error('se usa IRA')
                console.log(puntosDeAtaque, porcDefensaJugador, porcResistencia, porcDebilidad)
                console.log('danio abs:', danioAbsorbido)
                danioRecibido = puntosDeAtaque - danioAbsorbido - movEspecial.PS
                console.error(danioRecibido, puntosDeAtaque, danioAbsorbido, movEspecial.PS)
                break;
            case 'milagro-salud':
                // recupera 30 PS y abs el 50% del danio
                danioAbsorbido = puntosDeAtaque * (objMovEspecial.damageAbsorption / 100)
                console.log('cuenta milagro:', puntosDeAtaque, danioAbsorbido, movEspecial.PS)
                danioRecibido = puntosDeAtaque - danioAbsorbido - movEspecial.PS;
                break;
            case 'milagro-de-paz':
                danioRecibido = 0;
                break;
        }
    }

    console.warn('puntosDeAtaque', puntosDeAtaque)
    console.warn('danioAbs', danioAbsorbido)
    console.warn('danioRecibido', danioRecibido)
    objPersonajeDefensor.salud = objPersonajeDefensor.salud - danioRecibido
    console.log('vida restant =', objPersonajeDefensor.salud)

    // modifico el DOM segun corresponda
    if (defensor == 'defensor-Enemigo') {
        domBarraSaludEnemigo.innerHTML = objPersonajeDefensor.salud;
    } else {
        // defensor == yo
        domBarraSaludJugador.innerHTML = objPersonajeDefensor.salud;
    }
}


function determinarPorcResistencia(tipoAtaque, resistencias) {
    let valorResist = 0;
    // reviso si es un array
    let isArray = Array.isArray(resistencias);

    if (isArray) {
        //console.log('tiene un array de resistencias', resistencias)
        let arrayResist = resistencias.map(resistencia => determinarPorcResistencia(tipoAtaque, resistencia))
        let valorResistFiltrado = arrayResist.filter(value => value > 0);

        if (valorResistFiltrado.length > 0) {
            valorResist = valorResistFiltrado[0]
        }
    } else {
        //console.log('se revisa la resistencia puntual', resistencias)
        if (tipoAtaque == resistencias) {
            valorResist = 20;
        } else {
            valorResist = 0;
        }
    }
    console.log('valorResist', valorResist)
    return valorResist;
}

function determinarPorcDebilidad(tipoAtaque, debilidades) {
    //console.log('tipo ataque', tipoAtaque, ', debilidades', debilidades)
    let valorDebilidad;
    // reviso si es un array
    let isArray = Array.isArray(debilidades);

    if (isArray) {
        let arrayDebi = debilidades.map(debilidad => determinarPorcResistencia(tipoAtaque, debilidad))
        let valorDebilidadFiltrado = arrayDebi.filter(value => value > 0);

        if (valorDebilidadFiltrado.length > 0) {
            valorDebilidad = valorDebilidadFiltrado[0]
        }
    } else {
        if (tipoAtaque == debilidades) {
            valorDebilidad = 15;
        } else {
            valorDebilidad = 0;
        }
    }
    console.log('valor debi', valorDebilidad)
    return valorDebilidad;
}
/**
 * Aca se determina el tipo de movimiento seleccionado
 */
// todo: mejorar la semantica
function crearMensajeCombate() {
    let sucesoEnemigo;
    let sucesoJugador;

    // parte del player
    if (objMovimientoJugador == null) {
        sucesoJugador = 'estas agotado, comienza a rezar!'
        tipoMovJugador = PIEDAD;
    } else if (objMovimientoJugador.id.includes('ataque-')) {
        sucesoJugador = `atacas con ${movimientoTurnoJugador}`;
        tipoMovJugador = ATAQUE;
    } else if (objMovimientoJugador.id.includes('-rodar')) {
        sucesoJugador = 'ruedas para evitar morir,';
        tipoMovJugador = RODAR;
    } else if (objMovimientoJugador.id.includes('defensa-')) {
        sucesoJugador = `te cubris con ${movimientoTurnoJugador}`;
        tipoMovJugador = DEFENSA;
    } else if (objMovimientoJugador.id.includes('milagro-') || objMovimientoJugador.id.includes('efecto-')) {
        sucesoJugador = `utilizas ${movimientoTurnoJugador}`;
        tipoMovJugador = EFECTO_ESPECIAL;
    } else {
        console.error('contiene error ==============================');
        tipoMovJugador = ERROR;
    }

    // parte del enemigo
    if (objMovimientoEnemigo == null) {
        sucesoEnemigo = ' aunque te ruegan piedad!!'
        tipoMovEnemigo = PIEDAD;
    } else if (objMovimientoEnemigo.id.includes('ataque-')) {
        tipoMovEnemigo = ATAQUE;
        sucesoEnemigo = ` y te atacan con ${movimientoTurnoEnemigo}`
    } else if (objMovimientoEnemigo.id.includes('-rodar')) {
        tipoMovEnemigo = RODAR;
        sucesoEnemigo = `y tu enemigo te esquiva limpiamente...`
    } else if (objMovimientoEnemigo.id.includes('defensa-')) {
        tipoMovEnemigo = DEFENSA;
        sucesoEnemigo = `pero tu enemigo se cubre usando ${movimientoTurnoEnemigo}`
    } else if (objMovimientoEnemigo.id.includes('milagro-') || objMovimientoEnemigo.id.includes('efecto-')) {
        tipoMovEnemigo = EFECTO_ESPECIAL;
        sucesoEnemigo = `, pero tu oponente utiliza ${movimientoTurnoEnemigo}`
    } else {
        console.error('contiene error ==============================')
    }

    objPersonajeEnemigo.objMovimientoSeleccionado.movementType = tipoMovEnemigo;
    // diego 
    objPersonajeJugador.objMovimientoSeleccionado.movementType = tipoMovJugador;

    // TODO: validar opcion de SUCESO
    // el suceso sale de la convinacion de tipo de movimientos realizados
    // TODO: el suceso es la convinacion de los dos movimientos seleccionados. 
    // pendiente, funcion que compara ataques y determina que suceso salio.
    let frase = obtenerFraseSegunMovimientos(tipoMovJugador, tipoMovEnemigo);
    //editamos el relato
    relato.innerHTML = frase;

    // MODIFICAMOS EL DOM
    // creamos el elemento p
    let parrafo = document.createElement('p');
    //parrafo.innerHTML = `YO: ${movimientoTurnoJugador} -- PC: ${movimientoTurnoEnemigo} --> ${resultado}
    parrafo.innerHTML = `${sucesoJugador} ${sucesoEnemigo}`;
    // insertamos el elemento en el HTML
    mensajesCombate.appendChild(parrafo);

    // actualiza valors tablas grid
    parrafoAtaqueJugador.innerHTML = movimientoTurnoJugador;
    parrafoAtaqueEnemigo.innerHTML = movimientoTurnoEnemigo;
}

function obtenerFraseSegunMovimientos(movJ, movE) {
    let frase;
    console.warn('tipos de movimiento', movJ, movE)
    if (movJ == movE && movJ != ATAQUE) {
        frase = 'aumenta la tension...'
    } else if (movJ == ATAQUE && movJ == movE) {
        frase = 'Woo!! pero que cruce!!'
    } else if (movE == PIEDAD) {
        frase = 'Es tu oportunidad!! LIQUIDALO!!!';
    } else if (movJ == ATAQUE && movE == DEFENSA) {
        frase = 'La anticipaste mucho, te vieron venir...'
    } else if (movJ == ATAQUE && movE == RODAR) {
        frase = 'Te esquivaron limpiamente';
    } else if (movJ == ATAQUE && objMovimientoEnemigo.id == 'milagro-de-paz') {
        frase = 'JA! no cuentes con eso!'
    } else if (movJ == RODAR && movE == ATAQUE) {
        frase = 'Esquivaste justo! sigue asi!!';
    } else if (movJ == DEFENSA && movE == ATAQUE) {
        frase = 'Buen bloqueo! pero ten cuidado!!'
    } else if (movJ == PIEDAD) {
        frase = 'comienza a rezar...'
    } else if (objMovimientoEnemigo.id == 'efecto-ira' || objMovimientoJugador.id == 'efecto-ira') {
        frase = 'Se viene una fuerte! atentos!!';
    } else {
        frase = 'siga !! sigaaa!!! '
    }

    return frase;
}

function crearMensajeFinDeJuego(mensaje) {
    relato.innerHTML = 'Fue un gran combate, lo dejaron todo en el campo de batalla!!'
    let mensajeFinal = document.createElement('p');
    if (mensaje == GANASTE) {
        mensajeFinal.innerHTML = 'VICTORIA!! Vives un dia mas...'
        contadorRachasVictorias++;
    } else if (mensaje == PERDISTE) {
        mensajeFinal.innerHTML = 'Peleaste con honor! Este es un buen lugar para morir...'
        contadorRachasDerrotas++;
    } else if (mensaje == EMPATE) {
        mensajeFinal.innerHTML = 'Este es un resultado inesperado! Escapa o da el golpe final...'
        //todo: habilitar botn de escapar o liquidar -> nueva forma de combate, solo 3 movs con la vida que quedo: ataque debil, rodar, escudo
        contadorRachasDerrotas++;
    } else {
        console.error('entro aca, no deberia....')
        mensajeFinal.innerHTML = 'ERROR!!!!'
    }
    console.log(mensajeFinal)

    if (!partidaFinalizada) {
        seccionMensajeFinal.appendChild(mensajeFinal)
        deshabilitarBotonesDeMovimientos();
    }
    return;
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

function reiniciarJuego() {
    location.reload();
}

/**
 * Al finalizar el juego, inhabilita a todos los botones de ataques
 */
function deshabilitarBotonesDeMovimientos() {
    console.warn('se inhabilitan los botones de ataque')
    //seccionBotonesAtaquesJugador.style.display = 'none';
    divBotonesMovimientosPersonajes.style.display = 'none';


    parrafoAtaqueEnemigo.style.display = 'none';
    parrafoAtaqueJugador.style.display = 'none';

    // habilito boton reiniciar
    botonReiniciar.style.display = 'block';

    partidaFinalizada = true;
}

