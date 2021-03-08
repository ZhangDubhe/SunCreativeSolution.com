<template>
  <div class="folders">
    <el-tag class="tag" :effect="active === 0 ? 'dark' : 'light'"
    @click="select()">全部</el-tag>
    <div class="tag"
    :key="tag.id"
    v-for="tag in folders">
      <el-tag v-if="!tag.editing"
        :closable="editing"
        :effect="active === tag.id ? 'dark' : 'light'"
        :disable-transitions="false"
        @click="select(tag)"
        @close="handleClose(tag)">
        {{tag.name}}({{tag.medias}})
      </el-tag>
      <el-input v-else v-model="tag.name" class="tag-input" />
    </div>

    <el-input
      class="input-new-tag"
      v-if="isShowCreate"
      v-model="form.name"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="postFolder"
    >
      <el-button slot="append" @click="postFolder">new</el-button>
    </el-input>
    <el-button v-else class="button-new-tag" size="small" 
    @click="showCreate">+ New Folder</el-button>

    <el-button v-if="!editing" size="small" 
    @click="handleDbClick">Edit</el-button>
    <el-button v-else size="small" type="success"
    @click="endEdit">Done</el-button>

  </div>
</template>

<script>
export default {
  name: 'MediaFolders',
  data() {
    return {
      editing: false,
      folders: [],
      isShowCreate: false,
      active: null,
      form: {
        name: null
      }
    }
  },
  created() {
    this.initFolder()
  },
  methods: {
    async initFolder() {
      await this.fetchFolders()
      if (this.$route.query.folder_id) {
        let selectedOne = this.folders.filter((tag) => tag.id === +this.$route.query.folder_id)[0]
        this.select(selectedOne)
      }
    },
    async fetchFolders() {
      let res = await this.Http.Get('sun-create/media-folders/')
      this.folders = res
      this.$store.commit('SET_MEDIA_FOLDERS', res)
    },
    handleDbClick() {
      this.editing = true
    },
    endEdit() {
      this.editing = false
      this.isShowCreate = false
      this.folders.forEach((e) => {
        delete e.editing
      })
    },
    showCreate() {
      this.isShowCreate = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async postFolder() {
      if (!this.form.name) return this.$message.error('亲 请输入文件夹名')
      try {
        await this.Http.Post('sun-create/media-folders/', {}, {
          ...this.form
        })
        this.isShowCreate = false
        this.fetchFolders()
      } catch (error) {
        console.log(error)
        // this.$message.error(error)
      }
    },
    select(item) {
      if (this.editing && item) {
        item.editing = true
        console.log(item)
        return
      }
      if (!item) {
        this.active = 0
        this.$emit('change', null)
        return
      }
      this.active = item.id
      this.$emit('change', item)
    },
    async handleClose(item) {
      await this.$confirm(`确认删除文件夹【${item.name}】? 该文件夹下文件不会被清除，但文件夹会被清空`)
      await this.Http.Delete(`sun-create/media-folder/${item.name}/`)
      this.fetchFolders()
    },
  }
}
</script>

<style lang="scss" scoped>
.folders {
  padding: 12px 0;
  display: flex;
  flex-flow: row wrap;
  .tag + .tag,
  .el-tag + .el-tag,
  .el-input + .el-button {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 120px;
    margin-left: 10px;
    vertical-align: bottom;
    /deep/ .el-input-group__append {
      padding-left: 5px;
      padding-right: 5px;
    }
  }
}
</style>