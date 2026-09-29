class expressError extends Error{
    constructor(status, message){
        super();
        this.staus = status;
        this.message = message
    }
};

module.exports = expressError;