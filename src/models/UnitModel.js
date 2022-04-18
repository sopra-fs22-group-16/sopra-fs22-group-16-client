import {UnitViewDirection} from "../components/fragments/game/unit/UnitViewDirection";
import {UnitTypes} from "../components/fragments/game/unit/data/UnitTypes";

class UnitModel {
    constructor(x,y,data = {}) {
        this.x = x;
        this.y = y;
        this.type = null;
        this.health = 0;
        this.defense = 0;
        this.attackDamage = 0;
        this.attackRange = 0;
        this.movementRange = 0;
        this.commands = [];
        this.teamId = null;
        this.userId = null;
        Object.assign(this, data);
        // if teamId === 0 (red) look southWest/west else teamId === 1 (blue) look southEast/east
        if(this.type === UnitTypes.war_elephant){
            this.viewDirection = this.teamId ? UnitViewDirection.west : UnitViewDirection.east;
        }else{
            this.viewDirection = this.teamId ? UnitViewDirection.southWest : UnitViewDirection.southEast;
        }

    }
}

export default UnitModel;
