class APIresponse{
    constructor(statusCode,message = "Success", data, success){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
export {APIresponse}