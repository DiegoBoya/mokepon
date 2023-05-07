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
      this.movimientos = [...this.ataques, ...this.defensas];
      this.objMovimientoSeleccionado = null;
   }   

   getMovementById(_movimientoID){
      console.log('movimientos disponibles jugador:', this.movimientos)
      let mov = this.movimientos.find(mov => mov.id == _movimientoID)
      mov.cant --; // el get no deberia restar
      return mov;
   }

   getAtackById(_atackID) {
      console.log('ataques disponibles jugador:', this.ataques)
      console.log('se busca', _atackID)
      let ataque = this.ataques.find(atack => atack.id == _atackID)
      ataque.cant --; // el get no deberia restar
      return ataque;
   }

   getDefenseById(_defenseID) {
      console.log('defensas disponibles jugador:', this.defensas)
      console.log('se busca', _defenseID)
      let defense = this.defensas.find(def => def.id == _defenseID)
      defense.cant --; // todo : el get no deberia restar
      return defense;
   }

   deleteElementById(_movimientoID){
    //  console.warn('se eliminara:', _movimientoID);
      let movimiento = this.movimientos.find(mov => mov.id == _movimientoID)
      this.removeFirst(movimiento);
      return movimiento;
   }

   removeFirst(movTarget) {
      let index = this.movimientos.indexOf(movTarget);
      if (index > -1) {
         this.movimientos.splice(index, 1);
      }
      console.warn(`Se elimino a ${movTarget.id}, ataques restantes enemigo`,this.movimientos)
      return this.movimientos;
   }


}

