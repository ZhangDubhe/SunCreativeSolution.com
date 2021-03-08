<template>
  <div class="page-dashboard animated fadeIn">
    <h5 v-if="welcome" class="my-4">{{ welcome[hourIndex] }}</h5>
    <video ref="catVideo" class="dash-video" src="https://static.dubheee.cn/sun/medias/cat/haq.mp4" @load="handleLoad" loop/>

    <div @click="startEdit" class="text-center">
      <logo class="mx-auto" topBg="black" bottomBg="white"/>
    </div>
  </div>
</template>

<script>
import bus from '@/router/bus'
import Logo from '../components/Logo.vue'

export default {
  components: { Logo },
  name: 'dashboard',
  data () {
    return {
      hour: new Date().getHours(),
      hourIndex: 0,
      windowWith: 0,
      windowHeight: 0,
      welcome: [
        'Good Morning! Have breakfast?',
        'Good Afternoon! Have Lunch?',
        'Good Evening! Sun~',
        '还不睡觉, 干啥呢'
      ]
    }
  },
  mounted () {
    if (this.hour < 12 && this.hour >= 6) {
      this.hourIndex = 0
    } else if (this.hour < 18 && this.hour >= 12) {
      this.hourIndex = 1
    } else if (this.hour < 24 && this.hour >= 18) {
      this.hourIndex = 2
    } else if (this.hour < 6) {
      this.hourIndex = 3
    }
    this.handleLoad()
  },
  methods: {
    clickSimpleLine () {
      console.log(window.scrollY)
      bus.$emit('home-go-down', true)
    },
    handleLoad() {
      this.$refs.catVideo.play()
    },
    startEdit() {
      this.$router.push({
        name: 'Post'
      })
    }
  }
}
</script>

<style>
.page-dashboard {
  color: #000;
  width: 720px;
  margin-left: auto;
  margin-right: auto;
}

.dash-video {
  width: 100%;
}

</style>
