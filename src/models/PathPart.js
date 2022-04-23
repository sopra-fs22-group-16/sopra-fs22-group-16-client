import {ArrowPartType} from "../components/fragments/game/tile/types/ArrowPartType";
import {Direction} from "../components/fragments/game/unit/Direction";

class PathPart {
    constructor() {
        this.type = ArrowPartType.none;
        this.direction = Direction.north;
    }
}

export default PathPart;