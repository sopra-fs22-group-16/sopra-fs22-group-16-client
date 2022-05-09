
class TurnData {
    constructor(data = {}) {
        this.turn = 0;
        this.playerId = 0;
        Object.assign(this, data);
    }
}


export default TurnData;