class PositionData {
    constructor(data = {}) {
        this.x = null;
        this.y = null;
        Object.assign(this, data);
    }
}
export default PositionData;
