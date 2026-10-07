import axios from "axios";

const fabricApiUrl = import.meta.env.VITE_FABRIC_API_URL || import.meta.env.VITE_FABRIC_API_URL || 'http://localhost:3000';

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