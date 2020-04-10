<template>
  <el-container class="all-article">
    <el-header style="height: 30px">
      <div class="title">
        <zsw-title>
          <h1>所有文章</h1>
          <el-button type="info" size="mini">写文章</el-button>
        </zsw-title>
      </div>
    </el-header>
    <el-main>
      <div class="search-box">
        <div class="search-wrapper">
          <el-select
            v-model="categoryValue"
            placeholder="请选择"
            clearable
            @change="handleCategory"
            @clear="handleCategory"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-model="statusValue" placeholder="请选择" clearable @change="handleStatus" @clear="handleStatus">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <search-input-btn v-model="keyWord" :search-icon="true" @click="handleSearch" />
        </div>
        <div class="content">
          <el-table
            ref="articleTable"
            v-loading="articleLoading"
            :data="articleData"
            border
            width="100%"
            :max-height="700"
            row-key="id"
            element-loading-text="拼命加载中"
          >

            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              label="移动"
              width="80"
              prop="title"
            >
              <template slot-scope="{row}">
                <el-button type="text" icon="el-icon-arrow-up" @click="handleUp(row)" />
                <el-button type="text" icon="el-icon-arrow-down" @click="handleDown(row)" />
              </template>
            </el-table-column>
            <el-table-column
              label="标题"
              :min-width="120"
              prop="title"
            />
            <el-table-column
              label="作者"
              :min-width="120"
              prop="username"
            />
            <el-table-column
              label="分类"
              :min-width="120"
            >
              <template slot-scope="{row}">
                <span v-if="row.category == 1">未分类</span>
                <span v-if="row.category == 2">奇趣事</span>
                <span v-if="row.category == 3">会生活</span>
                <span v-if="row.category == 4">爱旅行</span>
              </template>
            </el-table-column>
            <el-table-column
              :min-width="120"
              label="发表时间"
            >
              <template slot-scope="{row}">
                {{ new Date(row.created)|format }}
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              :min-width="120"
            >
              <template slot-scope="{row}">
                <span v-if="row.status == 'drafted'"> 草稿</span>
                <span v-if="row.status == 'published'"> 已发布</span>
                <span v-if="row.status == 'trashed'"> 回收站</span>
              </template>
            </el-table-column>
            <el-table-column
              label="编辑"
              :min-width="120"
            >
              <template slot-scope="{row}">
                <el-button size="small" icon="el-icon-edit" @click="toEditArticle(row)">
                  编辑
                </el-button>
                <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelArticle(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-main>
    <el-footer>
      <Pagination
        :page-index.sync="pageIndex"
        :page-size.sync="pageSize"
        :total="total"
        @change="handleQuery"
      />
    </el-footer>
  </el-container>
</template>

<script>

import SearchInputBtn from '../../components/SearchInputBtn/SearchInputBtn'
import Pagination from '../../components/Pagination/Pagination'
import zswTitle from '../../components/title/title'

import Sortable from 'sortablejs'

import { formatDate } from 'element-ui/src/utils/date-util'
import { delArticle, getAllArticle } from '../../api/article'

export default {
  name: 'AllArticle',
  components: { SearchInputBtn, Pagination, zswTitle },
  filters: {
    format(val) {
      const date = new Date(val)
      return formatDate(date, 'yyyy年M月d日')
    }
  },
  data() {
    return {
      categoryValue: 0,
      categoryOptions: [
        {
          value: 0,
          label: '所有分类'
        },
        {
          value: 1,
          label: '未分类'
        },
        {
          value: 2,
          label: '奇趣事'
        },
        {
          value: 3,
          label: '会生活'
        },
        {
          value: 4,
          label: '爱旅行'
        }
      ],
      statusValue: 'allstate',
      statusOptions: [
        {
          value: 'allstate',
          label: '所有状态'
        },
        {
          value: 'drafted',
          label: '草稿'
        },
        {
          value: 'published',
          label: '已发布'
        },
        {
          value: 'trashed',
          label: '回收站'
        }
      ],
      keyWord: '',
      articleData: [],
      articleLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: null
    }
  },
  created() {
    this.handleQuery()
    this.$nextTick(() => {
      this.setSort()
    })
  },
  methods: {
    setSort() {
      const el = this.$refs.articleTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)

          // for show the changes, you can delete in you code
          const tempIndex = this.articleData.splice(evt.oldIndex, 1)[0]
          this.articleData.splice(evt.newIndex, 0, tempIndex)
        }
      })
    },
    handleDown(row) {
      for (let i = 0; i < this.articleData.length; i++) {
        if (this.articleData[i].id === row.id && this.articleData[i + 1]) {
          const temp = this.articleData[i]
          this.$set(this.articleData, i, this.articleData[i + 1])
          this.$set(this.articleData, i + 1, temp)
          return
        }
      }
    },
    handleUp(row) {
      for (let i = 0; i < this.articleData.length; i++) {
        if (this.articleData[i].id === row.id && this.articleData[i - 1]) {
          const temp = this.articleData[i]
          this.$set(this.articleData, i, this.articleData[i - 1])
          this.$set(this.articleData, i - 1, temp)
          return
        }
      }
    },
    handleSearch(event) {
      this.pageIndex = 1
      this.handleQuery(this.categoryValue, this.statusValue)
    },
    handleCategory(val = 0) {
      this.handleQuery(val)
    },
    handleStatus(val = 'allstate') {
      this.handleQuery(this.categoryValue, val)
    },
    handleQuery(categoryId = null, statusId = null) {
      const params = {
        pageSize: this.pageSize,
        currentPage: this.pageIndex,
        categoryId: categoryId === null ? 0 : this.categoryValue,
        statusId: statusId === 'allstate' ? null : this.statusValue,
        keyWord: this.keyWord
      }
      getAllArticle(params).then(res => {
        this.total = res.data.total
        this.articleData = res.data.postsList
      })
    },
    handleDelArticle(row) {
      console.log('row：', row)
      const params = {
        id: row.id
      }
      delArticle(params).then(res => {
        console.log('res：', res)
        if (res.data) {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          // 重新刷新表格
          this.handleSearch()
        }
      })
    },
    toEditArticle(row) {
      this.$router.push({ name: 'EditArticle', params: { label: '编辑文章', id: row.id }})
    }
  }

}
</script>

<style scoped lang="scss">
  .all-article {
    color: black;
    padding: 15px;

    .title {
      position: relative;
      margin-top: -10px;

      h1 {
        display: inline;
        font-weight: 500;
        vertical-align: bottom;
        font-size: px(18);
      }

      button {
        margin-left: 10px;
        height: 25px;
      }
    }

    .search-box {
      .search-wrapper {
        /deep/ .el-select {
          margin-right: 15px;
          width: 150px;
        }
      }

      .content {
        margin-top: 15px;
      }
    }
    /deep/ .el-button{
      margin-left: 0;
    }

  }

</style>
