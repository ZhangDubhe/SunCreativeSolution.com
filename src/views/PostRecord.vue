<template>
  <el-container class="page-post-record pt-2">
    <el-header class="mt-2">
      <h3 class="d-flex">{{pageTitle}}</h3>
      <div class="d-flex">

      </div>
      <div class="d-flex">
        <el-select
        v-model="viewCategory" 
        @change="changeSelectCategory"
        clearable
        size="small"
        placeholder="请选择类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <section class="ml-auto">
          <i class="manage-icon el-icon-menu" :class="[{'active': viewType === 'thumbnail'}]"  @click="handleViewChange('thumbnail')"></i>
          <i class="manage-icon el-icon-tickets" :class="[{'active': viewType === 'list'}]" @click="handleViewChange('list')"></i>
        </section>
      </div>
    </el-header>
    <el-main v-if="viewType === 'list'" v-loading="recordListLoading">
      <el-table
        :data="articleList"
        border
        stripe
        height="500"
        style="width: 100%">
        <el-table-column
          fixed
          prop="date"
          label="日期"
          width="120">
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="140">
        </el-table-column>
        <el-table-column
          prop="explanation"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="category"
          label="分类"
          width="140">
        </el-table-column>
        <el-table-column
          prop="sort_index"
          label="排序"
          sortable
          width="60">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handleClickEdit(scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <hr/>
      <el-button type="primary" round @click="handlePostNewArticle">发布新文章</el-button>
    </el-main>
    <el-main v-if="viewType === 'thumbnail'" v-loading="recordListLoading">
      <isotope v-if="articleList && articleList.length" ref="cpt" :options="getOptions()" :list="articleList">
        <div v-for="(item, index) in articleList"
        :key="item.uuid"
        class="grid-item grid-sizer">
          <article-item :item="item" :index="index" />
        </div>
      </isotope>
      <!-- <section class="container masonry-arr">
      </section> -->
      <hr/>
      <el-button type="primary" round @click="handlePostNewArticle">发布新文章</el-button>
    </el-main>
  </el-container>
</template>
<script>
import { mapState } from 'vuex'
import categoryConfig from '@/config/category'
import { ArticleStateDesc } from '@/config/article'
import isotope from 'vueisotope'
import ArticleItem from './articles/Item.vue'

export default {
  name: 'PostRecord',
  components: {
    isotope,
    ArticleItem
  },
  props: {
    pageState: Number
  },
  data: function () {
    return {
      recordListLoading: true,
      viewCategory: '',
      options: [],
      viewType: 'thumbnail', // list
      articleList: [],
      saveArticleList: [],
      lastSaveTime: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    }
  },
  created () {
    if (!window.localStorage.token) {
      this.$router.push({
        name: 'LoginPage'
      })
    }
    document.body.classList.remove('sidebar-hidden')
  },
  mounted () {
    this.loadCategoryConfig()
    this.loadArtcleList()
  },
  computed: {
    ...mapState(['articleUpdateCount']),
    pageTitle() {
      return ArticleStateDesc[this.pageState]
    }
  },
  watch: {
    pageState(val) {
      let pState = val || 3
      this.$store.commit('SET_PAGE_STATE', pState)
      this.loadArtcleList()
    },
    articleUpdateCount() {
      this.loadArtcleList()
    }
  },
  methods: {
    getOptions () {
      return {
        itemSelector: '.grid-item',
        layoutMode: 'masonry',
        masonry: {
          gutter: 10, // 间距
          columnWidth: '.grid-sizer'
        },
        getFilterData: {
          isEven: function (itemElem) {
            return itemElem.id % 2 === 0
          },
          isOdd: function (itemElem) {
            return itemElem.id % 2 !== 0
          },
          filterByText: function (itemElem) {
            return itemElem.title.toLowerCase().includes(this.filterText.toLowerCase())
          }
        },
        getSortData: {
          id: 'group',
          name: function (itemElem) {
            return itemElem.title.toLowerCase()
          }
        }
      }
    },
    changeSelectCategory (val) {
      if (val) {
        this.articleList = this.saveArticleList.filter(item => item.category === val)
      } else {
        this.articleList = this.saveArticleList
      }
    },
    loadCategoryConfig () {
      this.options = [{
        value: 'Default',
        label: 'Default'
      }]
      categoryConfig.forEach(each => {
        this.options.push({
          value: each,
          label: each
        })
      })
    },
    handleViewChange (type) {
      this.viewType = type
    },
    loadArtcleList: function (params) {
      this.recordListLoading = true
      this.Http.Get('sun-create/article-admin/', {
        state: this.pageState
      }).then(res => {
        window.localStorage.setItem('articles_length', res.length)
        this.recordListLoading = false
        this.articleList = res.map(item => {
          return {
            date: new Date(item.created_at).toDateString(),
            ...item,
            header_image: item.header_image ? item.header_image.replace('http://', 'https://') : ''
          }
        })
        this.saveArticleList = this.articleList
      }, err => {
        this.recordListLoading = false
        console.error('GETADMIN', err)
        // this.$router.push({
        //   name: 'LoginPage'
        // })
      })
    },
    handleClick (row) {
      console.log(row)
      this.$router.push({
        name: 'Project',
        params: {
          uuid: row.url_params
        }
      })
    },
    handleClickEdit (row) {
      this.$router.push({
        name: 'Edit',
        params: {
          uuid: row.uuid
        }
      })
    },
    handlePostNewArticle: function (params) {
      // 引入 or 跳转 editor 页面
      this.$router.push({
        name: 'Post'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.thumbnail {
  width: 100%;
}
.manage-icon {
  width: 32px;
  height: 32px;

  &.active {
    color: #409EFF
  }
}
.page-post-record {
  .container {
    min-height: 660px;
    padding-bottom: 2rem;
    // max-width: calc(100% - 132px);
  }
  .masonry-arr>div {
    min-height: 660px;
  }
  .grid-item,
  .grid-sizer {
    width: calc(33.3% - 9px);
  }
  .grid-item img.thumbnail {
    width: 100%;
    object-fit: cover;
    height: 140px;
  }
  .text-overflow {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  @media (max-width: 768px) {
    // .main .container-fluid {
      
    // }
    .grid-item,
    .grid-sizer {
      width: 100%;
    }
  }
}

</style>
