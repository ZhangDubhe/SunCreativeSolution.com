import Vue from 'vue'
import { ArticleStateDesc } from '../config/article'

export default Vue.extend({
  data() {
    return {
      recordListLoading: false,
    }
  },
  computed: {
    itemState() {
      return ArticleStateDesc[this.item.state]
    }
  },
  methods: {
    handleView (row) {
      this.$router.push({
        name: 'Project',
        params: {
          uuid: row.url_params
        }
      })
    },
    handleEdit (row) {
      this.$router.push({
        name: 'Edit',
        params: {
          uuid: row.uuid
        }
      })
    },
    showDeleteConfirm (uuid) {
      this.$confirm('此操作将永久删除该页面, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleClickDelete(uuid)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleClickDelete (uuid) {
      this.recordListLoading = true
      this.Http.Delete(`sun-create/article-admin/${uuid}/`, {}).then(res => {
        this.recordListLoading = false
        this.$notify({
          title: '成功',
          message: '你已成功删除.',
          type: 'success'
        })
        this.loadArtcleList()
      }).catch(_ => {
        this.recordListLoading = false
      })
    },
  }
})
