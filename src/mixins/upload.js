import Vue from 'vue'

export default Vue.mixin({
  data() {
    return {
      uploadFile: {
        identifier: '',
        type: 'image',
        folder_name: 'default'
      },
      processLoading: false,
      uploadHeader: {
        Authorization: `Token ${window.localStorage.token}`
      },
      uploadAction: `${this.Http.baseUrl}sun-create/medias/`
    }
  },
  methods: {
    handleBeforeUpdate(file) {
      if (!this.uploadFile.identifier) {
        this.$message.error('请输入素材名称')
        return false
      }
    },
    handleUploadProcess () {
      this.processLoading = true
    },
    handleUploadError (res) {
      console.warn(res)
      console.warn(res.message)

      // this.$message.error(res)
      this.processLoading = false
      this.$message.error(res.message || '图片插入失败')
    },
    handleUploadSuccess (res, file) {
      console.log(res, file)
      // this.imageUrl = URL.createObjectURL(file.raw)
      // this.addCarouselImage(res)
      this.processLoading = false
      this.$emit('success')
    },
  }
})
