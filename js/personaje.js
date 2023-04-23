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
   }


   getAtackById(_atackID) {
      console.log('ataques INICIAL', this.ataques)
      console.log('se busca', _atackID)
      let ataque = this.ataques.find(atack => atack.id.includes(_atackID))
      console.log('opciones', ataque)
      ataque.cant --;
      //this.removeFirst(ataque)
      console.log('se elimina el ataque seleccionado')
      console.log(this.ataques)
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
