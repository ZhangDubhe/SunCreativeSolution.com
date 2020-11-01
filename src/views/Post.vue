<template>
<div class="post-page">
  <div>
    <strong>案例编辑</strong> / 1. 选择分类 2. 输入标题 3. 输入内容 4. Preview 后提交
  </div>
  <b-card 
  v-loading="processLoading"
  class="post-header">
    <el-form ref="form" :model="form" label-width="60px">
      <el-form-item label="标题">
        <el-input v-model="form.title" @change="inputTitle"></el-input>
      </el-form-item>
      <el-form-item v-if="form.uuid" label="url 地址">
        <el-input v-model="form.url_params"></el-input>
      </el-form-item>
      <el-form-item label="简介">
        <el-input type="textarea" v-model="form.explanation"></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="主题色">
            <el-color-picker v-model="form.theme_color"></el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="类型">
            <el-select v-model="form.category" placeholder="请选择类型">
            <el-option v-for="item in categoryConfig" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="排序">
            <el-select v-model="form.sort_index" placeholder="默认传入 0, 长度为当前文章数量">
              <el-option
                v-for="item in sortArr"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item v-if="this.form.title" label="缩略图">
            <el-upload
              class="avatar-uploader"
              :headers="uploadHeader"
              :action="uploadImage"
              :data="uploadThumbImageData"
              :show-file-list="false"
              :on-progress="uploadProcess"
              :on-error="handleUploadError"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="form.thumbnail" :src="form.thumbnail" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="this.form.title" label="头部图">
            <el-upload
              class="avatar-uploader"
              :headers="uploadHeader"
              :action="uploadImage"
              :data="uploadHeaderImageData"
              :show-file-list="false"
              :on-progress="uploadProcess"
              :on-error="handleUploadError"
              :on-success="handleHeaderSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="form.header_image" :src="form.header_image" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>    
  </b-card>
  <p v-if="isAutoSaved">已于{{autoSaveTime}}自动保存</p>
  <Editor 
  v-loading="processLoading"
  v-if="!articleUuid || (articleUuid && form.content)"
  @confirmEditorRichText="confirmText" :form-content="form.content"></Editor>

  <b-card 
  v-loading="processLoading"
  class="post-foot">
    <button @click="cancelPost" class="btn btn-light" type="clear">{{!articleUuid ? '取消':'返回'}}</button>
    <button @click="beforeConfirmPost" v-if="editStatus.indexOf('edit') >= 0 && form.content" class="btn btn-primary" :class="{'btn-primary': articleUuid }" type="submit">{{!articleUuid ? '提交':'修改'}}</button>
  </b-card>
</div>
</template>



<script>
import Editor from './Editor'
import categoryConfig from '../config/category'
import AutoSaveMixins from '@/mixins/autoSave'
export default {
  name: 'dashboard',
  mixins: [AutoSaveMixins],
  components: {
    Editor
  },
  data: function () {
    return {
      processLoading: false,
      editStatus: 'editing', // saved
      uploadHeaderImageData: {
        identifier: new Date().getTime(),
        image_type: 'sun/header'
      },
      headerImageUrl: '',
      uploadThumbImageData: {
        identifier: new Date().getTime(),
        image_type: 'sun/thumbnail'
      },
      ThumbImageUrl: '',
      uploadHeader: {
        Authorization: `Token ${window.localStorage.token}`
      },
      articleUuid: null,
      uploadImage: `${this.Http.baseUrl}tools/upload-image/`,
      sortArr: [0, 1, 2],
      form: {
        sort_index: 0,
        theme_color: '#409EFF',
        // category: 'art',
        // explanation: 'hhhhh',
        header_image: 'https://static.dubheee.cn/sun/header-image/default.png',
        thumbnail: 'https://static.dubheee.cn/sun/thumbnail-image/default.png',
        title: ''
      },
      categoryConfig: categoryConfig,
      lastSaveTime: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    }
  },
  created () {
    let uuid = this.$router.history.current.params.uuid
    let articleLength = localStorage.getItem('articles_length') || 10
    this.sortArr = []
    while (articleLength >= 0) {
      this.sortArr.push(articleLength)
      articleLength--
    }
    if (uuid) {
      console.log('article uuid - ', uuid)
      this.editStatus = 'editing'
      this.articleUuid = uuid
      this.loadArticleDetail(uuid)
    }
  },
  mounted () {
    // console.log(categoryConfig)
    // app header-fixed sidebar-fixed aside-menu-fixed aside-menu-hidden
    // app header-fixed sidebar-fixed aside-menu-fixed aside-menu-hidden sidebar-minimized brand-minimized
    document.body.classList.add('sidebar-minimized')
    document.body.classList.add('brand-minimized')
  },
  methods: {
    loadArticleDetail: function (uuid) {
      this.processLoading = true
      this.Http.Get(`sun-create/article-admin/${uuid}/`).then(res => {
        this.form = res
        setTimeout(() => {
          this.$set(this.form, 'url_params', res.url_params)
          // this.formatTitleMenu()
          // this.formatContentNode()
          this.processLoading = false
        }, 1000)
      })
    },
    loadTime: function (params) {
      this.lastSaveTime = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    },
    inputTitle (val) {
      // console.log(val)
      this.uploadThumbImageData.identifier = this.form.title.replace(/\s+/g, '')
      this.uploadHeaderImageData.identifier = this.form.title.replace(/\s+/g, '')
    },
    confirmText (data) {
      this.$set(this.form, 'content', data.content)
      // this.form.content = data
      this.$nextTick().then(() => {
        if (data.isAutoSave) {
          this.isAutoSaving = true
          this.postAutoSave(() => {
            this.beforeConfirmPost()
            console.log('auto save')
          })
        } else {
          this.isAutoSaving = false
        }
      })

      console.log(this.form)
    },
    handleHeaderSuccess (res, file) {
      console.log(res, file)
      // this.imageUrl = URL.createObjectURL(file.raw)
      this.form.header_image = res
      this.processLoading = false
    },

    handleUploadError (res) {
      console.error(res)
      this.$message.error('上传图片失败')
      this.processLoading = false
    },

    handleAvatarSuccess (res, file) {
      console.log(res, file)
      // this.imageUrl = URL.createObjectURL(file.raw)
      this.form.thumbnail = res
      this.processLoading = false
    },
    uploadProcess () {
      this.processLoading = true
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      // const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG / PNG / GIF 格式!')
      }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!')
      // }
      return isJPG
    },
    cancelPost () {
      if (this.articleUuid) {
        this.$router.push({
          name: 'Admin'
        })
        return
      }
      this.$alert('取消后将不会保存已编辑内容, 确认返回历史页', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.$router.push({
            name: 'Admin'
          })
        }
      })
    },
    beforeConfirmPost () {
      if (this.articleUuid) {
        this.confirmUpdate()
      } else {
        this.confirmPost()
      }
    },
    confirmUpdate () {
      if (!this.form.title) {
        this.$message.error('请填写题目')
        return
      }
      if (!this.form.content) {
        this.$message.error('请编辑内容')
        return
      }
      this.processLoading = true
      this.Http.Patch(`sun-create/article-admin/${this.articleUuid}/`, {}, this.form)
        .then(res => {
          this.processLoading = false
          this.editStatus = 'edited'
          if (this.isAutoSaving) return
          this.$alert('你已成功修改', '成功', {
            confirmButtonText: '跳转查看',
            cancelButtonText: '继续修改',
            showCancelButton: true,
            callback: action => {
              console.log('action', action)
              if (action === 'confirm') {
                this.$notify({
                  title: '成功',
                  message: '修改已保存',
                  type: 'success'
                })
                this.$router.push({
                  name: 'Project',
                  params: {
                    uuid: res.url_params
                  }
                })
              } else {
                this.$message({
                  type: 'info',
                  message: `继续修改`
                })
              }
            }
          })
        })
    },
    confirmPost () {
      if (!this.form.title) {
        this.$message.error('请填写题目')
        return
      }
      if (!this.form.content) {
        this.$message.error('请编辑内容')
        return
      }
      this.processLoading = true

      // console.log(this.form)
      this.Http.Post('sun-create/article-admin/', {}, this.form)
        .then(res => {
          this.processLoading = false
          this.articleUuid = res.uuid
          this.form = res
          this.editStatus = 'editing'
          if (this.isAutoSaving) return
          this.$notify({
            title: '成功',
            message: '你已成功保存.',
            type: 'success'
          })
          console.log(res)
        })
        .catch(err => {
          this.processLoading = false
          console.error('Error', err)
          this.$message.error('报错啦')
        })
    }
  }
}
</script>
<style>
.post-page {
  height: calc(100vh - 62px);
}
.post-page .post-header {
  /* height: 5rem; */
  margin-top: 2rem;
  background: #fafafa;
}
.post-page .post-header .row{
  /* height: 5rem; */
  margin-bottom: 10px;
}
.post-page .post-body {
  min-height: 40rem;
}
.post-page .post-foot {
  min-height: 5rem;
  text-align: right;
  background: #fafafa;
}
.post-page .time-tips {
  margin-right: 2rem;
}
.post-page .post-title {
  margin-right: 2rem;
}
.post-page .post-input {
  width: 60%;
  max-width: 100rem;
  margin-left: 10px;
}
.post-page .post-article {
  width: 100%;
  height: 100%;
  display: block;
  margin: auto;
}
.post-page .post-article:focus,
.post-page .post-article:active {
  outline: none;
}
</style>
<style lang="scss" scoped>
.post-page {
  .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: url(https://static.dubheee.cn/sun/static/cursor_pointer.png),pointer;
  position: relative;
}
.el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 400px;
  height: 300px;
  line-height: 300px;
  text-align: center;
  background: white;
}
img.avatar { 
  width: 100%; height: auto; max-width: 80%; display: block; 
}
.avatar {
  display: block;
}
}
</style>
