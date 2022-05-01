import {TileIndicatorType} from "../components/fragments/game/tile/types/TileIndicatorType";
import { ArrowPartType } from "../components/fragments/game/tile/types/ArrowPartType";
import {Direction} from "../components/fragments/game/unit/Direction";

class TileModel {
    constructor(y, x, data = {}) {
        this.y = y;
        this.x = x;
        this.type = null;
        this.variant = null;
        this.traversable = null;
        this.traversingCost = null;
        this.indicatorType = TileIndicatorType.none;
        this.unit = null;
        this.arrowPart = ArrowPartType.none;
        this.arrowDirection = Direction.north;
        Object.assign(this, data);
    }
}

export default TileModel;
