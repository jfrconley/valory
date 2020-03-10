import {Logger} from "pino";

/**
 * Base class for route controllers. Not required, but provides useful functionality.
 */
export class Controller {
    /**
     * Holds the request logger
     */
    public logger: Logger;
    private statusCode: number = 200;
    private headers = {} as { [name: string]: string | undefined };

    /**
     * Set the returned status code.
     */
    public setStatus(statusCode: number) {
        this.statusCode = statusCode;
    }

    /**
     * Get the current status code.
     */
    public getStatus() {
        return this.statusCode;
    }

    /**
     * Set a header to a given value
     */
    public setHeader(name: string, value?: string) {
        this.headers[name.toLowerCase()] = value;
    }

    /**
     * Get the current value of a header
     */
    public getHeader(name: string) {
        return this.headers[name];
    }

    /**
     * Get the current set of headers
     */
    public getHeaders() {
        return this.headers;
    }

    /**
     * Reset the status code to 200. Used internally.
     */
    public clearStatus() {
        this.statusCode = 200;
    }

    /**
     * Reset the headers map. Used internally.
     */
    public clearHeaders() {
        this.headers = {};
    }
}
