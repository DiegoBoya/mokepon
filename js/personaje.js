export class Personaje{
   constructor(id, nombre, salud, foto, ataques, defensas){
    this.id = id;
    this.nombre = nombre;
    this.salud = salud;
    this.foto = foto;
    this.ataques = ataques;
    this.defensas = defensas;
    this.resistencias = null;
    this.debilidades = null;
   }

}