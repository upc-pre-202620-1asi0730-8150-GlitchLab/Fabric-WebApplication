<script setup>
import {computed} from "vue";
import {useRouter} from "vue-router";
import Layout from "./shared/presentation/components/layout.vue";
import {useSessionStore} from "./identity-access/application/session.store.js";
import {navItemsFor} from "./identity-access/presentation/role-navigation.js";

const router = useRouter();
const session = useSessionStore();
const navItems = computed(() => navItemsFor(session.role));

const logOut = () => {
  session.signOut();
  router.push({name: 'role-selection'});
};
</script>

<template>
  <layout :nav-items="navItems" @logout="logOut"/>
</template>
