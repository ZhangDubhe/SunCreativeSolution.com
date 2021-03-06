import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    mediaFolders: [],
    mediaUpdateCount: 0
  },
  mutations: {
    SET_MEDIA_FOLDERS: (state, folders) => {
      state.mediaFolders = folders
    },
    MediaUpdate: (state) => {
      state.mediaUpdateCount++
    }
  }
})

export default store
