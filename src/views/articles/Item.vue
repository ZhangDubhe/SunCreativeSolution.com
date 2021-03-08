<template>
  <el-card :body-style="{ padding: '0px' }"
  style="margin-bottom: 10px;min-height: 306px">
    <img
    @click="handleView(item)"
    :src="item.thumbnail + '?x-oss-process=style/400wh'"
    class="image thumbnail"
    :class="{'can-go': item.state === 3}" />
    <div style="border-top: 10px solid"
    :style="{ padding: '14px', borderColor: item.theme_color }">
      <span>{{index+1}}. {{item.title}}</span>
      <p class="text-overflow">{{item.explanation}}</p>

      <p class="d-flex">
        <time class="time mr-auto">{{ item.date }}</time>
        <el-tag :type="tagType" size="small">{{item.category}}</el-tag>
      </p>

      <div v-if="item.state === 3" class="bottom clearfix d-flex">
        <!-- board 展示板：修改｜回到草稿｜埋进历史｜删除 -->

        <el-button class="mr-auto" @click="handleEdit(item)" type="text" size="small">修改</el-button>
        <el-button type="text" @click="stateChange(item, 1)" size="mini">回到草稿</el-button>
        <el-button type="text" @click="stateChange(item, 4)" size="mini" style="color:#000;">埋进历史</el-button>

        <el-button type="text" @click="stateChange(item, 2)" size="mini">删除</el-button>
      </div>
      <div v-if="item.state === 1" class="bottom clearfix d-flex">
        <!-- 草稿夹：修改｜发布｜删除 -->
        <el-button class="mr-auto" @click="handleEdit(item)" type="text" size="small">修改</el-button>
        <el-button type="text" @click="stateChange(item, 3)" size="mini">发布</el-button>
        <el-button type="text" @click="stateChange(item, 2)" size="mini">删除</el-button>
      </div>

      <div v-if="item.state === 2" class="bottom clearfix">
        <!-- 回收站：复原至草稿夹/展示板/黑历史｜彻底删除 -->
        <p style="margin:0;">复原至</p>
        <div class="d-flex">
          <el-button type="text" @click="stateChange(item, 1)" size="mini">草稿</el-button>
          <el-button type="text" @click="stateChange(item, 3)" size="mini">展示板</el-button>
          <el-button type="text" @click="stateChange(item, 4)" size="mini"  style="color:#000;">黑历史</el-button>

          <el-button @click="showDeleteConfirm(item.uuid)" class="ml-auto" type="text" style="color: #F56C6C" size="small">彻底删除</el-button>
        </div>
      </div>
      <div v-if="item.state === 4" class="bottom clearfix d-flex">
        <!-- 黑历史：洗白试试｜删除 -->
        <el-button @click="stateChange(item, 1)" class="mr-auto" type="text" size="mini">洗白试试</el-button>
        <el-button @click="stateChange(item, 2)" type="text"  size="mini">删除</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { ArticleStateDesc } from '@/config/article'

import ArticleMixins from '@/mixins/admin-article'
export default {
  props: {
    item: Object,
    index: Number
  },
  mixins: [ArticleMixins],
  computed: {
    tagType() {
      return {
        'art': 'primary',
        'research': 'success',
        'commercial': 'danger',
      }[this.item.category] || 'info'
    }
  },
  methods: {
    async stateChange(item, state = 1) {
      let nextState = ArticleStateDesc[state]
      await this.$confirm(`确认移入【${nextState}】?`)
      await this.Http.Post('sun-create/admin/article/state/', {}, {
        article: item.uuid,
        state
      })
      this.$store.commit('ARTICLE_UPDATE')
    }
  }
}
</script>

<style lang="scss" scoped>
img.thumbnail {
  width: 100%;
  object-fit: cover;
  height: 140px;
  -webkit-user-drag: none;
  &.can-go {
    cursor: pointer;
  }
}
.text-overflow {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>