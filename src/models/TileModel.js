import {TileIndicatorType} from "../components/fragments/game/tile/TileIndicatorType";

class TileModel {
    constructor(x, y, unit, data = {}) {
        this.x = x;
        this.y = y;
        this.type = null;
        this.variant = null;
        this.traversable = null;
        this.traversingCost = null;
        this.indicatorType = TileIndicatorType.none;
        this.unit = unit;
        Object.assign(this, data);
    }
}

export default TileModel;
