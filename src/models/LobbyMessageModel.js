/**
 * Lobby Message Model model
 */
class LobbyMessageModel {
    constructor(data = {}) {
        this.removedPlayerIdList = null;
        this.nameChangedOfPlayerWithId = null;
        this.redirectToGame = null;
        this.pullUpdate = null;
        Object.assign(this, data);
    }
}
export default LobbyMessageModel;