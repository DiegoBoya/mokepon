export class Personaje {
   constructor(id, nombre, salud, foto, ataques, defensas) {
      this.id = id;
      this.nombre = nombre;
      this.salud = salud;
      this.foto = foto;
      this.ataques = ataques;
      this.defensas = defensas;
      this.resistencias = null;
      this.debilidades = null;
      //this.sepecialEffect
   }


   getAtackById(_atackID) {
      console.log('ataques disponibles jugador:', this.ataques)
      console.log('se busca', _atackID)
      let ataque = this.ataques.find(atack => atack.id == _atackID)
      ataque.cant --;
      return ataque;
   }

   getDefenseById(_defenseID) {
      console.log('defensas disponibles jugador:', this.defensas)
      console.log('se busca', _defenseID)
      let defense = this.defensas.find(def => def.id == _defenseID)
      defense.cant --;
      return defense;
   }

   deleteElementById(_atackID){
      console.log('se eliminara:', _atackID);
      let ataque = this.ataques.find(atack => atack.id == _atackID);
      this.removeFirst(ataque);
      console.log('ataques disponibles:', this.ataques);
      return ataque;
   }

   removeFirst(target) {
      let index = this.ataques.indexOf(target);
      if (index > -1) {
         this.ataques.splice(index, 1);
      }
      return this.ataques;
   }


}
