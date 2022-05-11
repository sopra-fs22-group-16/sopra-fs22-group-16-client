import PositionData from "./PositionData";

class HealthData {
    constructor(data = {}) {
        this.health = 0;
        this.unitPosition = new PositionData();

        Object.assign(this, data);
    }
}

export default HealthData;