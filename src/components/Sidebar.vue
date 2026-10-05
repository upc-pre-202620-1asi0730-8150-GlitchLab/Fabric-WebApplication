<script setup>
defineProps({
  currentPage: {
    type: String,
    default: 'dashboard'
  }
})

const emit = defineEmits(['change-page'])

const changePage = (page) => {
  emit('change-page', page)
}
</script>

<template>
  <aside class="sidebar">

    <div class="brand">

      <div class="brand-logo">
        FAB
      </div>

      <span>
        FABRIC
      </span>

    </div>


    <nav class="navigation">

      <a
          class="nav-item"
          :class="{ active: currentPage === 'dashboard' }"
          @click="changePage('dashboard')"
      >
        Dashboard
      </a>


      <a
          class="nav-item"
          :class="{ active: currentPage === 'batches' }"
          @click="changePage('batches')"
      >
        Production Batches
      </a>


      <a
          class="nav-item"
          :class="{ active: currentPage === 'quality' }"
          @click="changePage('quality')"
      >
        Quality
      </a>


      <a
          class="nav-item"
          :class="{ active: currentPage === 'machinery' }"
          @click="changePage('machinery')"
      >
        Machinery
      </a>


      <a
          class="nav-item"
          :class="{ active: currentPage === 'alerts' }"
          @click="changePage('alerts')"
      >
        Alerts
      </a>

    </nav>


    <div class="sidebar-bottom">

      <div class="profile">

        <div class="avatar">
          RS
        </div>

        <div class="profile-info">

          <strong>
            Rosangela Silva
          </strong>

          <span>
            Supervisor
          </span>

          <small>
            View Profile
          </small>

        </div>

      </div>


      <button class="logout">
        Log Out
      </button>

    </div>

  </aside>
</template>