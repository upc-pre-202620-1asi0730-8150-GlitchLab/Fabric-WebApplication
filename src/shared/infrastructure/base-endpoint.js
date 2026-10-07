import { http } from './base-api';

export class BaseEndpoint {
    constructor(endpointPath) {
        this.endpoint = endpointPath;
    }

    getAll() {
        return http.get(this.endpoint);
    }

    getById(id) {
        return http.get(`${this.endpoint}/${id}`);
    }

    create(resource) {
        return http.post(this.endpoint, resource);
    }

    update(id, resource) {
        return http.put(`${this.endpoint}/${id}`, resource);
    }

    delete(id) {
        return http.delete(`${this.endpoint}/${id}`);
    }
}