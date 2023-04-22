//ataques sueltos
export class Constants {
    constructor(){  
       this.espada;
    }
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
Constants.escudoMagicoOscuro = 'escudo magico oscuro 🎆';
//⚔🗡🔪🛡🏹🛡🔄☄⚡🔥🌟🌀☄🌠🎇🎆

// arrays base
Constants.ataquesBase = [Constants.espadaSimple, Constants.espadaSimple, Constants.daga]
Constants.defensaBase = [Constants.rodar, Constants.rodar, Constants.escudoMadera, Constants.escudoMadera]

/* CONCATENACIONES DE ARRAYS */
// Caballero Negro    
Constants.ataquesCaballeroNegro = Constants.ataquesBase.concat([Constants.espadaDoble, Constants.piromancia]);
Constants.defensasCaballeroNegro = Constants.defensaBase.concat([Constants.escudoMagicoOscuro, Constants.escudoMagico]);

// Caballero Real    
Constants.ataquesCaballeroReal = Constants.ataquesBase.concat([Constants.espada, Constants.rayo, Constants.milagro, Constants.arcoFlecha]);
Constants.defensasCaballeroReal = Constants.defensaBase.concat([Constants.milagro2, Constants.escudoMagico]);

// Caballero Real    
Constants.ataquesCaballeroTemplario = Constants.ataquesBase.concat([Constants.espadaDoble, Constants.espadaDoble, Constants.arcoFlecha, Constants.arcoFlecha, Constants.daga]);
Constants.defensasCaballeroTemplario = Constants.defensaBase.concat([Constants.rodar, Constants.escudoMadera, Constants.escudoMagico]);

// Caballero Hechicero
Constants.ataquesHechiceroBadass = Constants.ataquesBase.concat([Constants.flechaMagica, Constants.flechaMagica, Constants.flechaMagica, Constants.daga, Constants.daga]);
Constants.defensasHechiceroBadass = Constants.defensaBase.concat([Constants.rodar, Constants.rodar,  Constants.escudoMadera, Constants.escudoMagico, Constants.escudoMagico]);
