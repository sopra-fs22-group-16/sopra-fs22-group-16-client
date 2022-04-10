/**
 * Lobby model
 */
class LobbyModel {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.gameMode = null;
    this.gameType = null;
    this.hostId = null;
    this.invitationCode = null;
    this.players = null;
    this.visibility = null;
    Object.assign(this, data);
  }
}
export default LobbyModel;