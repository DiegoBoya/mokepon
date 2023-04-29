//ataques sueltos
export class Constants {
    constructor() {
        this.espada;
    }
}



Constants.espadaSimple = 'espada 🗡';
Constants.espadaDoble = 'espada doble ⚔';
Constants.daga = 'daga 🔪';
Constants.rodar = 'defensa-rodar 🔄';
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


// Caballero Real    
Constants.ataquesCaballeroReal = Constants.ataquesBase.concat([Constants.espada, Constants.rayo, Constants.milagro, Constants.arcoFlecha]);
Constants.defensasCaballeroReal = Constants.defensaBase.concat([Constants.milagro2, Constants.escudoMagico]);

// Caballero Templario    
Constants.ataquesCaballeroTemplario = Constants.ataquesBase.concat([Constants.espadaDoble, Constants.espadaDoble, Constants.arcoFlecha, Constants.arcoFlecha, Constants.daga]);
Constants.defensasCaballeroTemplario = Constants.defensaBase.concat([Constants.rodar, Constants.escudoMadera, Constants.escudoMagico]);

// Caballero Hechicero
Constants.ataquesHechiceroBadass = Constants.ataquesBase.concat([Constants.flechaMagica, Constants.flechaMagica, Constants.flechaMagica, Constants.daga, Constants.daga]);
Constants.defensasHechiceroBadass = Constants.defensaBase.concat([Constants.rodar, Constants.rodar, Constants.escudoMadera, Constants.escudoMagico, Constants.escudoMagico]);

// ids de los botones
/* 

ataques
   "id": "ataque-rayo-1",
    "id": "ataque-rayo-2",
       "id": "ataque-fuerte-1",
          "id": "ataque-fuerte-2
 "id": "ataque-daga",
 rafaga-magica
 "id": "flecha-magica",

defensas
"id": "defensa-magica-1"
"id": "defensa-rodar",
"id": "defensa-escudo-madera",
"id": "milagro-salud",
"id": "milagro-1", 






*/