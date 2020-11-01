import Vue from 'vue'

export default Vue.extend({
  data: function () {
    return {
      isAutoSaved: false,
      isAutoSaving: false,
      autoSaveTime: null
    }
  },
  methods: {
    postAutoSave (func) {
      new Promise((resolve, reject) => {
        try {
          resolve(func())
        } catch (e) {
          reject(e)
        }
      }).then((res) => {
        this.isAutoSaved = true
        this.autoSaveTime = new Date()
        this.afterAutoSaving()
      }).catch((err) => {
        this.isAutoSaved = false
        console.error('Err', err)
      })
    },
    afterAutoSaving () {
      let autoSaveTimeout = setTimeout(() => {
        this.isAutoSaved = false
        clearTimeout(autoSaveTimeout)
      }, 5000)
    }
  }
})
