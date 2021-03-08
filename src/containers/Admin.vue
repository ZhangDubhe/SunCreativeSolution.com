<template>
  <div class="app">
    <!-- <AdminHeader/> -->
    <div class="app-body admin-body">
      <Sidebar class="admin-sidebar" :navItems="nav"/>
      <main class="main">
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>
<style lang="scss">
  // Import Main styles for this application
  @import '../../scss/admin.scss';
</style>
<style scoped>
.app {
  overflow: hidden;
}
.app-body.admin-body{
  margin-top: 0;
}
.sidebar-fixed .admin-body .sidebar {
  height: 100vh;
}
</style>

<script>
import nav from './_adminNav'
import AdminHeader from '../components/AdminHeader'
import { Sidebar, Aside as AppAside } from '../components/'

export default {
  name: 'full',
  components: {
    AdminHeader,
    Sidebar,
    AppAside
  },
  data () {
    return {
      nav: nav.items
    }
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched
    }
  }
}
</script>
