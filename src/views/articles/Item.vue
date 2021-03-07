<template>
  <el-card :body-style="{ padding: '0px' }"
  style="margin-bottom: 10px;min-height: 306px">
    <img :src="item.thumbnail + '?x-oss-process=style/400wh'" class="image thumbnail">
    <div style="border-top: 10px solid"
    :style="{ padding: '14px', borderColor: item.theme_color }">
      <span>{{index+1}}. {{item.title}}</span>
      <p class="text-overflow">{{item.explanation}}</p>

      <p class="d-flex">
        <time class="time mr-auto">{{ item.date }}</time>
        <el-tag size="small" v-if="item.category === 'art'">art</el-tag>
        <el-tag size="small" v-else-if="item.category === 'research'" type="success">research</el-tag>
        <el-tag size="small" v-else-if="item.category === 'commercial'" type="danger">commercial</el-tag>
        <el-tag size="small" v-else type="info">{{item.category}}</el-tag>
      </p>
      <p>
        <strong>{{itemState}}</strong>
      </p>
      <div class="bottom clearfix d-flex">
        <el-button @click="handleView(item)" type="text" size="small">查看</el-button>
        <el-button class="ml-auto" @click="handleEdit(item)" type="text" size="small">编辑</el-button>
        <el-button type="success" @click="stateChange(item, 3)" size="mini">发布</el-button>
        <el-button type="success" @click="stateChange(item, 4)" size="mini">拉黑</el-button>
        <el-button @click="showDeleteConfirm(item.uuid)" type="text" style="color: #F56C6C" size="small">删除</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import ArticleMixins from '@/mixins/admin-article'
export default {
  props: {
    item: Object,
    index: Number
  },
  mixins: [ArticleMixins],
  methods: {
    stateChange(item, state = 1) {
      this.Http.Post('sun-create/admin/article/state/', {}, {
        article: item.uuid,
        state
      })
    }
  }
}
</script>

<style lang="scss" scoped>
img.thumbnail {
  width: 100%;
  object-fit: cover;
  height: 140px;
}
.text-overflow {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>