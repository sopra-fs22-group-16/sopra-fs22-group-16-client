class RegisteredUserModel {
    constructor(data = {}) {
        this.id = null;
        this.username = null;
        this.rankedScore = null;
        this.wins = null;
        this.losses = null;
        Object.assign(this, data);
    }
}
export default RegisteredUserModel;
