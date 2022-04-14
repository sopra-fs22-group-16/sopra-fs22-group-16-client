import LobbyModel from "./LobbyModel";

class UserModel {
    constructor(data = {}) {
        this.token = null;
        this.lobby = new LobbyModel(data.lobby);
        Object.assign(this, data);
    }
}
export default UserModel;
