<template>
  <div v-loading="processLoading" class="animated fadeIn editor-page">
    <section class="editor-whole-ctn">
      <quill-editor v-model="content"
                    class="editor-container"
                    ref="myQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)">
      </quill-editor>
      <div class="editor-split" :class="{'fixed': isEditorToolboxFixed}">

        <el-tooltip class="item" effect="dark" content="图片是否压缩, 压缩率为 0.8" placement="top-start">
          <el-switch
            v-model="isCompressImage"
            active-text="压缩"
            inactive-text="原图"
            inactive-color="#ff4949">
          </el-switch>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="插入图片分隔符,以分开相邻的图片避免成为轮播图" placement="top-start">
          <el-button type="danger" circle @click="showSplit()">hr</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="插入音频" placement="top-start">
          <el-button type="info" circle @click="joinAudio()"><i class="el-icon-phone-outline"></i></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="H1H2/H3H4分别为文字和图片标题, 图片标题正文不可见.相邻图片会转为轮播图, 需要分割相邻图片使用左侧 hr." placement="top-start">
          <el-button  type="warning" icon="el-icon-view" circle></el-button>
        </el-tooltip>
      </div>
      
    </section>
    <!-- Confirm -->
    <div class="my-3 d-flex justify-content-end">
        <el-upload
          id="uploadQuillImage"
          class="upload-quill-image upload-demo mr-2"
          :headers="uploadHeader"
          :action="uploadImage"
          :data="uploadImageData"
          :before-upload="handleImageBeforeUpdate"
          :on-progress="handleUploadProcess"
          :on-error="handleUploadError"
          :on-success="handleImageSuccess"
          multiple>
          <el-button size="small" type="primary">插入图片</el-button>
        </el-upload>
        <el-upload
          id="uploadQuillAudio"
          class="upload-quill-image upload-audio mr-2"
          :headers="uploadHeader"
          :action="uploadAudio"
          :data="uploadAudioData"
          :before-upload="handleBeforeUpdate"
          :on-progress="handleUploadProcess"
          :on-error="handleUploadError"
          :on-success="bindUploadAudioSuccess"
          multiple>
          <el-button size="small" type="primary">插入音频</el-button>
        </el-upload>
        <!-- <button class="btn btn-secondary" @click="cancel()">Clear</button> -->
        <button class="btn btn-primary" type="success" @click="confirmText()">PRVIEW</button>
    </div>
    <b-card class="mb-3 animated fadeIn ql-container ql-snow result-content" v-if="result">
      <div ref="resultContent"
      v-if="result && !contentArr"
      v-show="false"
      class="col-12 col-md-8 ql-editor" v-html="result"></div>
      <article class="col-12 col-md-8 ql-editor">
        <div v-for="(section, index) of contentArr" :key="index" :class="section.styleClass">
          <section v-if="section.styleClass === 'para-section'">
            <div class="section-header-ctn">
              <h1 v-if="section && section.header" v-bind:id="section.header.idx">{{section.header.name}}</h1>
              <h2 v-if="section && section.subheader" v-bind:id="section.subheader.idx">{{section.subheader.name}}</h2>
            </div>
            <div>
              <p v-for="(para, p_index) in section.para" :key="p_index" v-html="para.innerHTML"></p>
            </div>
          </section>
          <section v-else-if="section.styleClass === 'image-header-section'">
            <div class="section-header-ctn">
              <h1 v-if="section && section.header" v-bind:id="section.header.idx">{{section.header.name}}</h1>
              <h2 v-if="section && section.subheader" v-bind:id="section.subheader.idx">{{section.subheader.name}}</h2>
            </div>
          </section>
          <section v-else-if="section.styleClass === 'images-section'">
            <!-- v-for="(image, image_index) in section.images" :key="image_index"-->
            <el-carousel v-if="section.images.length > 1"
              :autoplay="section.images.length > 2 ? true : false"
              :loop="section.images.length > 2 ? true : false"
              ref="imageCarousel"
              :height="(parseInt(carouselWidth * section.height / section.width) || 400) + 'px'"
              indicator-position="outside">
              <el-carousel-item v-for="(image, image_index) in section.images" :key="image_index">
                <div class="para-image" v-html="image.innerHTML" ref="imgSize"></div>
              </el-carousel-item>
            </el-carousel>
            <div class="para-image" v-if="section.images.length == 1" v-html="section.images[0].innerHTML"></div>
          </section>
          <section v-else-if="section.styleClass === 'audios-section'">
            <div v-for="item in section.audioSrc" :key="item">
              <audio controls :src="item"></audio>
              <p class="audio-src">{{item}}</p>
            </div>
          </section>
          <section v-else-if="section.styleClass === 'videos-section'">
            <iframe class="ql-video" 
            style="margin: auto;"
            v-for="(item,v_index) in section.videoSrcs"
            :key="'section_' + index + 'video_' + v_index"
            frameborder="0" 
            width="540" height="310"
            allowfullscreen="true" 
            :src="item"></iframe>
          </section>
        </div>
      </article>
    </b-card>


  </div>
</template>


<script>
import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'

Vue.use(VueQuillEditor)

export default {
  name: 'text-editors',
  props: {
    formContent: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      result: '',
      contentArr: null,
      carouselData: [],
      isEditorToolboxFixed: false,
      isShowAddCarousel: false,
      uploadImage: `${this.Http.baseUrl}tools/upload-image/`,
      uploadAudio: `${this.Http.baseUrl}tools/upload-file/`,
      uploadImageData: {
        identifier: '',
        image_type: 'sun/content'
      },
      uploadAudioData: {
        file_type: 'sun/audio'
      },
      uploadHeader: {
        Authorization: `Token ${window.localStorage.token}`
      },
      isCompressImage: true,
      processLoading: false,
      startTimestamp: new Date(),
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'font': [] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image', 'video']
          ]
        }
      },
      content: `<h2 class="ql-align-center"><span class="ql-font-serif">Text content loading..</span></h2>`,
      carouselWidth: 0
    }
  },
  methods: {
    setSize: function () {
      if (this.$refs.imageCarousel && this.$refs.imageCarousel.length > 0) {
        this.carouselWidth = this.$refs.imageCarousel[0].$el.clientWidth
      }
    },
    formatContentNode () {
      let content = this.$refs.resultContent
      if (!content || !content.childNodes) return
      this.contentArr = this.Utils.formatProject(content.childNodes)
      console.log('contentArr - \n', this.contentArr)
      this.setSize()
    },
    showSplit () {
      let quill = this.$refs.myQuillEditor.quill
      let content = `\n------------- 图片分割 ------------- !&hr&! ------------- 图片分割 -------------\n`
      // 获取光标所在位置
      let length = quill.getSelection().index
      // 插入
      quill.insertText(length, content, {
        'color': '#F56C6C',
        'italic': true
      })
      // 调整光标到最后
      quill.setSelection(length + 1)
    },
    onEditorBlur (quill) {
      console.log('editor blur!', quill)
      this.confirmText('auto-save')
    },
    onEditorFocus (quill) {
      // console.log('editor focus!', quill)
    },
    onEditorReady (quill) {
      // console.log('editor ready!', quill)
    },
    onEditorChange ({ quill, html, text }) {
      console.log('editor change!', quill, html, text)
      this.content = html
    },
    showAddCarousel: function (params) {
      this.isShowAddCarousel = true
    },
    closeAddCarousel: function (params) {
      this.carouselData = []
      this.isShowAddCarousel = false
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.carouselData = []
          done()
        })
        .catch(_ => {})
    },
    handleBeforeUpdate (file) {
      this.uploadImageData.identifier = new Date().getTime()
      // 限制上传大小
    },
    handleImageBeforeUpdate (file) {
      this.uploadImageData.identifier = new Date().getTime()
      // 限制上传图片大小
      let originSize = file.size
      if (originSize > 15728640) {
        // 不能超过 15 M
        console.error('Image too large')
        this.$message.error('图片太大, 请先本地压缩')
        return false
      } else if (originSize > 0 && this.isCompressImage) {
        const vm = this
        return new Promise((resolve) => {
          const reader = new FileReader()
          const image = new Image()
          image.onload = (imageEvent) => {
            let dataUrl = vm.Utils.compressImage(image, file.type)
            let blobData = vm.Utils.dataURItoBlob(dataUrl, file.type)
            let compressedSize = blobData.size
            this.$notify({
              type: 'success',
              title: '压缩成功',
              message: `体积从 ${(originSize / 1024 / 1024).toFixed(2)}M 缩小到了 ${(compressedSize / 1024 / 1024).toFixed(2)}M`
            })
            resolve(blobData)
          }
          reader.onload = e => { image.src = e.target.result }
          reader.readAsDataURL(file)
        })
      }
    },
    handleUploadProcess () {
      this.processLoading = true
    },
    handleUploadError (res) {
      console.warn(res)
      // this.$message.error(res)
      this.processLoading = false
      this.$message.error('图片插入失败')
    },
    handleImageSuccess (res, file) {
      console.log(res, file)
      // this.imageUrl = URL.createObjectURL(file.raw)
      this.addImageToQuill(res)
      // this.addCarouselImage(res)
      this.processLoading = false
    },
    addImageToQuill: function (res) {
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res) {
        // 获取光标所在位置
        let length = quill.getSelection().index
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, 'image', res)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
      // loading动画消失
    },
    // 插入音频
    joinAudio: function (state) {
      // button is clicked
      // this.$refs.myQuillEditor.quill.root.children.push('<p>99999</p>')
      console.log(this.$refs.myQuillEditor.quill.root.children)
      document.querySelector('.upload-audio input').click()
      console.log('Btn', state)
    },
    bindUploadAudioSuccess: function (res, file) {
      console.log(res, file)
      this.addAudioToQuill(res)
      this.processLoading = false
    },
    addAudioToQuill: function (res) {
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res) {
        // 获取光标所在位置
        let length = quill.getSelection().index
        // 插入图片  res.info为服务器返回的图片地址
        // quill.insertEmbed(length, 'audio', res)
        let content = `<p><audio src="${res}" controls>你的浏览器不支持audio标签</audio></p>`
        // 插入
        quill.insertText(length, content, {
          'color': '#666666'
        })
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('音频插入失败')
      }
    },
    addCarouselImage: function (params) {
      let imgItem = {
        type: 'image',
        url: params
      }
      this.carouselData.push(imgItem)
      console.log(this.carouselData)
      this.carouselContext = this.buildCarouselCtx()
    },
    removeCarouselImage: function (index) {
      this.carouselData.splice(index, 1)
      console.log(this.carouselData)
      this.carouselContext = this.buildCarouselCtx()
    },
    buildCarouselCtx: function () {
      let ctx = `<el-carousel indicator-position="outside">`
      this.carouselData.forEach(each => {
        ctx = ctx + `<el-carousel-item>`
        if (each.type === 'image') {
          let itemCtx = `<img style="max-width:100%;max-height:100%;" src="${each.url}" /></el-carousel-item>`
          ctx = ctx + itemCtx
        } else {
          let itemCtx = `<h3>${each}</h3>`
          ctx = ctx + itemCtx
        }
        ctx = ctx + `</el-carousel-item>`
      })
      ctx = ctx + `</el-carousel>`
      return ctx
    },
    confirmCarouselText: function (params) {
      this.content = this.content + '<br/>' + this.carouselContext
      console.log(this.content)
      console.log(this.carouselContext)
      this.closeAddCarousel()
    },
    confirmText: function (params) {
      this.result = this.content
      setTimeout(() => {
        this.formatContentNode()
      }, 200)
      this.$emit('confirmEditorRichText', {
        content: this.content,
        isAutoSave: params === 'auto-save'
      })
    },
    cancel: function (params) {
      this.result = ''
      this.content = ''
    },
    imgHandler: function (state) {
      if (state) {
        // button is clicked
        console.log(document.querySelector('.upload-demo input'))
        document.querySelector('.upload-demo input').click()
        console.log('Btn', state)
      } else {
        console.log('????', state)
        this.quill.format('image', false)
      }
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  mounted () {
    console.log('this is current quill instance object', this.editor)
    setTimeout(() => {
      this.content = this.formContent || ''
    }, 1300)
    var vm = this
    vm.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
    // vm.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('audio', this.audioHandler)
  }
}
</script>
<style lang="scss" scoped>
.upload-quill-image {
  display: none;
}
.editor-whole-ctn {
  position: relative;
  .editor-container {
    position: initial;
  }
  .editor-split {
    position: absolute;
    top: 90px;
    right: 20px;
  }
}
.quill-editor {
  // min-height: 500px;
  .ql-container {
    height: 500px
  }
}
.result-content img { width: 100%; height: auto;max-width: 100%; display: block; }
</style>
<style lang="scss">
  @import '../style/project.scss';
</style>

<style lang="scss" >
.editor-container {
  .ql-snow {
    .ql-editor {
      // min-height: 500px;
      height: 70vh;
      overflow-y: auto;
      img {
        max-width: 30%;
      }
    }
  }
}
</style>
