import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    mediaFolders: [],
    mediaUpdateCount: 0,

    articlePageState: 3,
    articleUpdateCount: 0,
  },
  mutations: {
    SET_MEDIA_FOLDERS: (state, folders) => {
      state.mediaFolders = folders
    },
    MediaUpdate: (state) => {
      state.mediaUpdateCount++
    },
    SET_PAGE_STATE: (state, val) => {
      state.articlePageState = val
    },
    ARTICLE_UPDATE: (state) => {
      state.articleUpdateCount++
    }
  }
})

export default store
