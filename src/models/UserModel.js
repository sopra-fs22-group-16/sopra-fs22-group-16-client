class UserModel {
    constructor(data = {}) {
        this.id = null;
        this.name = null;
        this.ready = null;
        this.team = null;
        this.token = null
        Object.assign(this, data);
    }
}

export default UserModel;
