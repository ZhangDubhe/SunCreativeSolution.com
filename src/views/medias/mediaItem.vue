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
    <hr/>
    <div v-if="!editVisible">
      <strong>{{media.name}}</strong>
      <el-button @click="startEdit" type="text" icon="el-icon-edit" size="mini"></el-button>
    </div>
    <div v-else class="input-wrapper">
      <el-input size="mini" v-model="media.name"></el-input>
    </div>
    <el-tag size="mini" v-if="media.folder" class="path">{{media.folder.name}}</el-tag>
    <el-tag size="mini" type="warning">{{media.type}}</el-tag>
  </div>
</template>

<script>
export default {
  name: 'MediaItem',
  props: {
    media: Object
  },
  data() {
    return {
      editVisible: false
    }
  },
  methods: {
    startEdit() {
      this.editVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
$size: 140px;
.media-item {
  width: $size;
  padding: 8px 0;
  p {
    margin: 0;
  }
  .input-wrapper {
    .el-input {
      margin: 0;
    }
  }
  .media-entity {
    width: $size;
    height: $size;
    display: block;

    video, audio {
      width: 100%;
      height: 100%;
    }
  }
}
</style>