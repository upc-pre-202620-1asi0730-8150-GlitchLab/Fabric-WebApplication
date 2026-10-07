import axios from "axios";

const fabricApiUrl = import.meta.env.VITE_FABRIC_API_URL;

export class BaseApi {
    #http;

    constructor() {
        this.#http = axios.create({
            baseURL: fabricApiUrl,
            headers: {'Content-Type': 'application/json'}
        });
    }

    get http() {
        return this.#http;
    }
}