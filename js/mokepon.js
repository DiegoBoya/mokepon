const HIPODOGE_ID = "hipodoge";
const CAPIPEPO_ID = "capipepo";
const RATIGUEYA_ID = "ratigueya";
const LANGOSTELVIS_ID = "langostelvis";
const TUCAPALMA_ID = "tucapalma";
const PYDOS_ID = "pydos";
const MOKEPONES_ID = [HIPODOGE_ID, CAPIPEPO_ID, RATIGUEYA_ID];
// para seleccionar el Mokepon de la PC
const MAX_ARRAY_MOKE = MOKEPONES_ID.length;
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

    // boton de reiniciar oculto por defecto
    let botonReiniciar = document.getElementById('boton-reiniciar');
    botonReiniciar.style.display = 'none';
    botonReiniciar.addEventListener('click', reiniciarJuego);

    // seccion de ataques oculta por defecto
    let seccionAtaques = document.getElementById('seleccionar-ataque');
    seccionAtaques.style.display = 'none';

}

function seleccionarMascotaJugador() {
    console.log('seleccionados')
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

        // oculto seccion elegit masctoa
        let seccionElegirMascota = document.getElementById('seleccionar-mascota');
        seccionElegirMascota.style.display ='none';
        
        // PC elige mokepon
        seleccionarMascotaPC();

        // habilito seccion para elegir ataques
        let seleccionAtaques = document.getElementById('seleccionar-ataque');
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
    console.log('Se elige el Mokepon de la PC');
    let numRandom = Math.floor(Math.random() * (MAX_ARRAY_MOKE - MIN_ARRAY_MOKE - 1) + MIN_ARRAY_MOKE)
    console.log('numero random', numRandom, ', mokepon=', MOKEPONES_ID[numRandom])
    let mascotaPC = formatearNombre(MOKEPONES_ID[numRandom]);
    document.getElementById('mascota-enemigo').innerHTML = mascotaPC;
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

    vidas = document.getElementById('barra-vidas-enemigo');
    vidas.innerHTML = vidasPC;
}

function actualizarVidasPlayer() {
    vidasPlayer--;

    vidas = document.getElementById('barra-vidas-jugador');
    vidas.innerHTML = vidasPlayer;

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
    let seccion = document.getElementById('mensaje-final')
    seccion.appendChild(mensajeFinal)
    

    // habilito boton reiniciar
    let botonReiniciar = document.getElementById('boton-reiniciar');
    botonReiniciar.style.display = 'block';
}

/**
 * Al finalizar el juego, inhabilita a todos los botones de ataques
 */
function deshabilitarBotonesDeAtaque(){
    console.warn('se inhabilitan los botones de ataque')
    let botonAtaqueFuego = document.getElementById('boton-fuego');
    botonAtaqueFuego.disabled = true;

    let botonAtaqueAgua = document.getElementById('boton-agua');
    botonAtaqueAgua.disabled = true;

    let botonAtaqueTierra = document.getElementById('boton-tierra');
    botonAtaqueTierra.disabled = true;

}

function crearMensajeCombate(resultado, suceso) {
    // actualiza valors tablas grid
    let parrafoAtaqueJugador = document.getElementById('ataque-jugador');
    parrafoAtaqueJugador.innerHTML = ataqueJugador;

    let parrafoAtaqueEnemigo = document.getElementById('ataque-enemigo');
    parrafoAtaqueEnemigo.innerHTML = ataquePC;

    //editamos el relato
    console.log(suceso)
    let relato = document.getElementById('relato')
    relato.innerHTML = obtenerFraseSegunSuceso(suceso)

    // creamos el elemento p
    let parrafo = document.createElement('p');
    parrafo.innerHTML = `Atacas con ${ataqueJugador}, y el enemigo se defiende con ${ataquePC} --> ${resultado}`;
    // insertamos el elemento en el HTML
    let sectionMensajes = document.getElementById('mensajes-combate');
    sectionMensajes.appendChild(parrafo);
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

// luego de que se carga todo el HTML, inicia el juego
window.addEventListener('load', iniciarJuego)

