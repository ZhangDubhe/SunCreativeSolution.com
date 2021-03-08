<template>
  <div class="app" ref="full-page">
    <AppHeader/>
    <div class="app-body"
    :class="{'full-height': name === 'Project', 'active-header': headerActive}"
    >
    <!-- v-scroll="onScroll" -->
      <!-- <Sidebar :navItems="nav"/> -->
      <main class="main">
        <div class="container-fluid">
          <router-view :scroll-top="position.scrollTop"></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import bus from '@/router/bus'
import { Header as AppHeader, Sidebar, Aside as AppAside } from '../components/'

export default {
  name: 'full',
  components: {
    AppHeader,
    Sidebar,
    AppAside
  },
  data () {
    return {
      previousTop: 0,
      position: {},
      headerActive: true
    }
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched
    }
  },
  created () {
    bus.$on('animate-info', animateInfo => {
      this.headerActive = animateInfo.headerActive
    })
  },
  methods: {
    onScroll: function (e, position) {}
  }
}
</script>
<style>
.header-fixed .app-body.full-height {
    margin-top: 0;
    padding-top: 0;
    height: 100vh;
    transition: all 200ms ease;
}
.header-fixed .app-body.full-height.active-header {
    padding-top: 66px;
    height: 100vh;
}
</style>
