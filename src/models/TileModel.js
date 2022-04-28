import {TileIndicatorType} from "../components/fragments/game/tile/types/TileIndicatorType";
import PathPart from "./PathPart";
import { ArrowPartType } from "../components/fragments/game/tile/types/ArrowPartType";
import { DropdownType } from "../components/fragments/game/tile/types/DropdownType";
import {Direction} from "../components/fragments/game/unit/Direction";
import { DropDownType } from "components/fragments/game/elements/dropDownType";

class TileModel {
    constructor(y, x, data = {}) {
        this.y = y;
        this.x = x;
        this.type = null;
        this.variant = null;
        this.traversable = null;
        this.traversingCost = null;
        this.dropdown = DropdownType.none;
        this.onClick = null;
        this.indicatorType = TileIndicatorType.none;
        this.unit = null;
        this.arrowPart = ArrowPartType.none;
        this.arrowDirection = Direction.north;
        this.dropdown = DropdownType.none;
        Object.assign(this, data);
    }
}

export default TileModel;
