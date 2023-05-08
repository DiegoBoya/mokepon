export class Ataque {
    constructor(id, name, type, damage, icon, specialEffect, cant, movementType) {
        this.id = id; // el id del boton del ataque
        this.name = name;
        this.type = type;
        this.damage = damage;
        this.icon = icon;
        this.specialEffect = specialEffect;
        this.cant = cant;
        this.movementType = movementType;
    }

}