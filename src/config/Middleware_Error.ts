export class Middleware_Error extends Error{

    constructor(error: string) {
        super(error);
        this.message = error
        Object.setPrototypeOf(this, Middleware_Error.prototype);
    }

}
