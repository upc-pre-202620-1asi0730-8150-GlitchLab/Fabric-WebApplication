<script setup>
import {useRouter} from "vue-router";
import Layout from "./shared/presentation/components/layout.vue";
import {useSessionStore} from "./identity-access/application/session.store.js";

const router = useRouter();
const session = useSessionStore();

const logOut = () => {
  session.signOut();
  router.push({name: 'role-selection'});
};
</script>

<template>
  <layout @logout="logOut"/>
</template>
