<template>
  <div v-if="media" class="media-item">
    <template v-if="media.type === 'image'">
      <el-image class="media-entity"
        :src="media.url"
        :preview-src-list="[media.url]">
      </el-image>
    </template>
    <template v-if="media.type === 'audio'">
      <div class="media-entity audio">
        <audio controls>
          <source :src="media.url" type="audio/ogg">
          <source :src="media.url" type="audio/mpeg">
          Your browser does not support the audio tag.
        </audio>
      </div>
    </template>
    <template v-if="media.type === 'video'">
      <div class="media-entity audio">
        <video controls>
          <source :src="media.url" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
    </template>
    <!-- <p>{{media.type}}</p> -->
    <div class="space"></div>
    <div v-if="!editVisible">
      <strong>{{media.name}}</strong>
      <el-button @click="startEdit" type="text" icon="el-icon-edit" size="mini"></el-button>
    </div>
    <div v-else class="input-wrapper">
      <el-input size="mini" v-model="media.name">
        <el-button slot="append" @click="updateName" icon="el-icon-check"></el-button>
      </el-input>
    </div>
    <el-tag size="mini" v-if="media.folder" class="path">{{media.folder.name}}</el-tag>

    <el-button size="mini" type="text" @click="showFolders" icon="el-icon-more"></el-button>

    <el-dialog
    title="修改文件夹"
    v-if="isShowModify"
    :visible.sync="isShowModify"
    center>
      <el-radio-group v-model="folder">
        <el-radio :label="item.id" v-for="(item, index) in mediaFolders" :key="index"
        border size="small">
          {{item.name}}
        </el-radio>
      </el-radio-group>
      <div slot="footer">
        <el-button size="small" @click="isShowModify = false">取消</el-button>
        <el-button size="small" type="primary" @click="updateFolder">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'MediaItem',
  props: {
    media: Object
  },
  data() {
    return {
      editVisible: false,
      isShowModify: false,
      folder: this.media.folder && this.media.folder.id
    }
  },
  computed: {
    ...mapState(['mediaFolders']),
  },
  methods: {
    startEdit() {
      this.editVisible = true
    },
    updateName() {
      this.handlePatch({
        name: this.media.name
      })
    },
    updateFolder() {
      this.handlePatch({
        folder: this.folder
      })
    },
    async handlePatch(params) {
      await this.Http.Patch(`sun-create/media/${this.media.uuid}/`, {}, {
        ...params
      })
      this.$message.success('success!')
      this.editVisible = false
      this.isShowModify = false
      this.$store.commit('MediaUpdate')
    },
    showFolders() {
      this.isShowModify = true
    }
  }
}
</script>

<style lang="scss" scoped>
$size: 140px;
.media-item {
  width: $size;
  padding: 8px 0;
  margin: 0 6px 18px;
  .space {
    height: 8px;
  }
  p {
    margin: 0;
  }
  .input-wrapper {
    .el-input {
      margin: 0;
      /deep/ .el-input-group__append {
        padding-left: 5px;
        padding-right: 5px;
      }
    }
  }
  .media-entity {
    width: $size;
    height: $size;
    display: block;
    /deep/ .el-image__inner {
      object-fit: contain;
      background: #fafafa;
    }
    video, audio {
      width: 100%;
      height: 100%;
    }
  }
}
</style>