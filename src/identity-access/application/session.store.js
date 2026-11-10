import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {isUserRole} from "../domain/model/user-role.js";

const useSessionStore = defineStore('session', () => {
    const role = ref(null);

    const isAuthenticated = computed(() => role.value !== null);

    function signIn(selectedRole) {
        if (!isUserRole(selectedRole)) throw new Error(`Unknown role: ${selectedRole}`);
        role.value = selectedRole;
    }

    function signOut() {
        role.value = null;
    }

    return {role, isAuthenticated, signIn, signOut};
});

export {useSessionStore};
