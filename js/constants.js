//ataques sueltos
export class Constants {
    constructor(){  
       this.espada;
    }
}

function constantes(){
    this.espada = 'espada';
}

Constants.espadaSimple = 'espada 🗡';
Constants.espadaDoble = 'espada doble ⚔';
Constants.daga = 'daga 🔪';
Constants.rodar = 'rodar 🔄';
Constants.arcoFlecha = 'Flecha de madera 🏹';
Constants.rayo = 'rayo ⚡';
Constants.piromancia = 'fuego 🔥';
Constants.milagro = 'anular ataque 🎇';
Constants.milagro2 = 'restaurar PS 🌟';
Constants.flechaMagica = 'flecha de alma 🌠';
Constants.escudoMadera = 'escudo simple 🛡';
Constants.escudoMagico = 'escudo magico 🌀'
Constants.escudoMagicoOscuro = 'defensa magica oscura 🎆';
//⚔🗡🔪🛡🏹🛡🔄☄⚡🔥🌟🌀☄🌠🎇🎆
    
// Caballero Negro    
Constants.ataquesCaballeroNegro = [Constants.espadaSimple, Constants.espadaSimple, Constants.espadaDoble];
Constants.defensasCaballeroNegro = [Constants.rodar, Constants.rodar, Constants.rodar, Constants.escudoMagicoOscuro, Constants.escudoMagico];
