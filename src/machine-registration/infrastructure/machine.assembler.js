import {Machine} from "../domain/model/machine.entity.js";

export class MachineAssembler{
    static toEntityFromResource(resource){
        return new Machine({...resource});
    }

    static toEntitiesFromResponse(response){
        if(response.status !== 200){
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }

        let resources = response.data instanceof Array ? response.data : response.data['machines'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}