
function iniciarJuego(){
    // reacciona al elegir al mokepon
    console.log('cargo OK el juego')
    let botonMascotaJugador = document.getElementById('boton-seleccionar-mascota');
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)
}

function seleccionarMascotaJugador(){
    console.log('se selecciono')
    alert("se selecciono tu mascota")
}

// luego de que se carga todo el HTML, inicia el juego
window.addEventListener('load', iniciarJuego)