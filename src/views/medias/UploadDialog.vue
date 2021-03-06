<template>
  <el-dialog :visible="visible"
  :close-on-click-modal="processLoading"
  @close="$emit('update:visible', false)">
    <el-radio-group v-model="selectType">
      <el-radio :label="item.type" v-for="(item, index) in typeConfigs" :key="index">
        {{item.title}}
      </el-radio>
    </el-radio-group>
    <hr>
    <h5>{{selectTypeObj.title}}</h5>
    <el-form :form="uploadFile">
      <el-form-item label="素材名">
        <el-input v-model="uploadFile.identifier" />
      </el-form-item>
      <el-form-item label="上传至">
        <el-input disabled v-model="uploadFile.folder_name" />
      </el-form-item>
    </el-form>

    <el-upload slot="footer"
      v-loading="processLoading"
      id="uploadQuillImage"
      class="upload-quill-image upload-demo mr-2"
      :headers="uploadHeader"
      :action="uploadAction"
      :data="uploadFile"
      :before-upload="handleBeforeUpdate"
      :on-progress="handleUploadProcess"
      :on-error="handleUploadError"
      :on-success="handleUploadSuccess"
      :accept="selectTypeObj.accept">
      <el-button size="small" type="primary">上传{{selectTypeObj.title}}</el-button>
    </el-upload>
  </el-dialog>
</template>

<script>
import UploadMixins from '@/mixins/upload'

export default {
  mixins: { UploadMixins },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    folder: {
      type: Object
    }
  },
  watch: {
    selectType(to) {
      this.uploadFile.type = to
    },
    folder: {
      deep: true,
      handler(to) {
        if (to) {
          const {id, name} = to
          this.uploadFile.folder_id = id
          this.uploadFile.folder_name = name
        } else {
          delete this.uploadFile.folder_id
          this.uploadFile.folder_name = 'default'
        }
      }
    }
  },
  data() {
    return {
      selectType: 'image',
      typeConfigs: [{
        type: 'image',
        title: '图片',
        body: '',
        limit: '10MB',
        accept: 'image/png, image/jpg, image/jpeg, image/gif'
      }, {
        type: 'audio',
        title: '音频',
        body: '',
        limit: '100MB',
        accept: 'audio/mp3, audio/acc'
      }, {
        type: 'video',
        title: '视频',
        body: '',
        limit: '600MB',
        accept: 'video/mp4, video/mov'
      }]
    }
  },
  computed: {
    typeMaps() {
      return Object.assign({}, ...this.typeConfigs.map((item) => ({
        [item.type]: item
      })))
    },
    selectTypeObj() {
      return this.typeMaps[this.selectType]
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>