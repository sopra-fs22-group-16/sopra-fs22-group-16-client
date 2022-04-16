import {TileIndicatorType} from "../components/fragments/game/tile/TileIndicatorType";
import LobbyModel from "./LobbyModel";
import UnitModel from "./UnitModel";

class TileModel {
    constructor(x, y, data = {}) {
        this.x = x;
        this.y = y;
        this.type = null;
        this.variant = null;
        this.traversable = null;
        this.traversingCost = null;
        this.indicatorType = TileIndicatorType.none;
        if (data.unit) {
            this.unit = new UnitModel(x, y, data.unit);
            delete data.unit
        }
        Object.assign(this, data);
    }
}

export default TileModel;