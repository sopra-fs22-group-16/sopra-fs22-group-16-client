class RegisteredUserModel {
    constructor(data = {}) {
        this.id = null;
        this.username = null;
        this.creationDate = null;
        this.token = null;
        Object.assign(this, data);
    }
}
export default RegisteredUserModel;
