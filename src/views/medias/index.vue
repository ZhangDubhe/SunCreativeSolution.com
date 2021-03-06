<template>
  <div class="media-page">
    <header class="media-header d-flex align-items-center">
      <h3>素材库</h3>
      <el-input class="form-input ml-1" v-model="params.search" placeholder="输入名称或文件夹查询" size="small" @change="fetchMedias" />

      <div class="ml-auto">
        <el-button type="primary" @click="showUpload">上传</el-button>
      </div>
    </header>

    <Folders ref="folder" @change="handleFolderChange"/>
    <section class="list-view">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item, index) in medias" :key="index">
          <media-item :media="item" />
        </el-col>
      </el-row>

      <el-pagination
      class="mt-4"
      layout='prev, pager, next, jumper, ->, sizes, total'
      :page-sizes="[6, 12, 18, 24]"
      :total="total"
      :page-size="params.size"
      :current-page.sync="params.page"
      @size-change="sizeChange"
      @current-change="fetchMedias"
      />
    </section>

    <upload-dialog
    :visible.sync="isShowUploadDialog"
    :folder="selectedFolder"
    @success="handleSuccess"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Folders from './Folders.vue'
import mediaItem from './mediaItem.vue'
import UploadDialog from './UploadDialog.vue'
export default {
  components: { mediaItem, UploadDialog, Folders },
  name: 'MediaLibrary',
  data() {
    return {
      params: {
        search: null,
        size: 18,
        page: 1
      },
      total: 0,
      medias: [],
      isShowUploadDialog: false,
      selectedFolder: null
    }
  },
  computed: {
    ...mapState(['mediaUpdateCount'])
  },
  watch: {
    mediaUpdateCount() {
      this.handleSuccess()
    }
  },
  mounted() {
    this.fetchMedias()
  },
  methods: {
    sizeChange(v) {
      this.params.size = v
      this.fetchMedias()
    },
    fetchMedias() {
      let query = {
        ...this.params,
      }
      if (this.selectedFolder) {
        query.folder = this.selectedFolder.id
      }
      this.Http.Get('sun-create/medias/', query).then((res) => {
        const {list, total} = res
        this.total = total
        this.medias = list
      })
    },
    handleFolderChange(item) {
      if (!item) {
        this.$router.push({
          path: this.$route.path,
        })
        this.selectedFolder = null
        this.fetchMedias()
        return
      }
      this.$router.push({
        path: this.$route.path,
        query: {
          folder_id: item.id
        }
      })
      this.selectedFolder = item
      this.fetchMedias()
    },
    showUpload() {
      this.isShowUploadDialog = true
    },
    handleSuccess() {
      this.isShowUploadDialog = false
      this.fetchMedias()
      this.$refs.folder.fetchFolders()
    }
  }
}
</script>

<style lang="scss" scoped>
h1, h2, h3, h4, h5 {
  margin: 0;
}
.media-page {
  max-width: 1080px;
  margin: auto;
  .list-view {
    padding: 12px 0;
  }
}
.media-page .media-header {
  /* height: 5rem; */
  margin-top: 1rem;
  .form-input {
    width: 180px;
  }
}
</style>