<template>
  <div class="pagination-wrapper" :style="'height:' +height+'px'">
    <el-pagination
      :current-page.sync="currentPageIndex"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    // 当前页码
    pageIndex: {
      type: [String, Number],
      default: 1
    },
    // 一页展示多少条
    pageSize: {
      type: [String, Number],
      default: 10
    },
    // 总条数
    total: {
      type: [String, Number],
      default: 0
    },
    // 是否需要单独使用，是-->只提供分页模块，否-->自带底部div+居中样式
    // singleUse: {
    //   type: Boolean,
    //   default: false
    // },
    height: {
      type: [String, Number],
      default: '60'
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 30, 50, 100]
      }
    }
  },
  data() {
    return {
      currentPageIndex: 1
    }
  },
  watch: {
    pageIndex(value) {
      this.currentPageIndex = value
    }
  },
  created() {
    this.currentPageIndex = this.pageIndex || 1
  },
  methods: {
    /**
         * 最大展示条数切换
         */
    handleSizeChange(size) {
      this.$emit('update:pageSize', size)
      this.$emit('update:pageIndex', 1)
      this.$emit('change', this.pageIndex, size)
    },
    /**
         * 页码切换
         */
    handleCurrentChange(pageIndex) {
      this.$emit('update:pageIndex', pageIndex)
      this.$emit('change', pageIndex, this.pageSize)
    }
  }
}
</script>

<style scoped lang="scss">
  .pagination-wrapper{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    background-color: rgb(244,247,249);
    /deep/ .el-pagination{
      position: absolute;
      top:30px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
