<template>
  <el-container>
    <el-header>
      <div class="">
        <zsw-title>写文章</zsw-title>
      </div>
    </el-header>
    <div class="EditArticle">
      <el-form :model="articleFrom" label-position="top">
        <div class="left-content">
          <div class="left-title">
            <el-form-item label="标题:">
              <el-input v-model="articleFrom.title" />
            </el-form-item>
          </div>
          <el-form-item label="内容:">
            <tinymce v-model="articleFrom.content" :height="300" />
          </el-form-item>
        </div>
        <div class="right-content">
          <el-form-item label="别名:">
            <el-input v-model="articleFrom.slug" placeholder="别名" />
          </el-form-item>
          <el-form-item label="特色图像:">
            <el-upload
              class="upload-demo"
              action="zsw/upload/uploadImage"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="articleFrom.fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="articleFrom.status" placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间:"><br>
            <el-date-picker
              v-model="articleFrom.created"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="所属分类:">
            <el-select v-model="articleFrom.categoryId" placeholder="请选择">
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-button v-if="saveBtn" type="primary" size="medium" @click="saveArticle">保存</el-button>
          <el-button v-else type="primary" size="medium" @click="editArticle">保存</el-button>
        </div>
      </el-form>
    </div>
  </el-container>
</template>

<script>
import tinymce from '../../components/Tinymce'
import zswTitle from '../../components/title/title'
import { addArticle, getArticle, updateArticle } from '../../api/article'

export default {
  name: 'EditArticle',
  components: {
    tinymce,
    zswTitle
  },
  data() {
    return {
      saveBtn: true,
      height: 600,
      articleFrom: {
        content: '',
        title: '',
        fileList: [],
        created: null,
        status: 'allstate',
        slug: '',
        categoryId: 0
      },
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
      ]
    }
  },
  created() {
    const id = this.$route.params.id
    if (id) {
      // 显示编辑按钮
      this.saveBtn = false
      getArticle({ id }).then(res => {
        console.log('res：', res)
        Object.keys(this.articleFrom).forEach(key => {
          if (key === 'fileList') {
            const feature = res.data['feature']
            console.log('feature：', feature)
            if (feature && feature.startsWith('http')) {
              this.$set(this.articleFrom.fileList, 0, {
                url: res.data['feature'], name: res.data['title']
              })
            } else {
              this.$set(this.articleFrom.fileList, 0, {
                url: 'zsw' + res.data['feature'], name: res.data['title']
              })
            }
          } else {
            this.articleFrom[key] = res.data[key]
          }
        })
      })
    } else {
      this.saveBtn = true
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.articleFrom.fileList.splice(0, 1)
    },
    handleSuccess(response, file, fileList) {
      file.key = response.data.key
      this.articleFrom.fileList.push(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`最多选择一张图片`)
    },
    verify() {
      const obj = {
        flag: true,
        params: {}
      }
      Object.keys(this.articleFrom).forEach(key => {
        if (obj.flag) {
          if (this.articleFrom[key] === null || this.articleFrom[key] === '' || this.articleFrom[key].legend === 0 || this.articleFrom[key] === undefined) {
            this.$message('请先完善信息')
            obj.flag = false
          }
          if (key === 'fileList') {
            obj.params.feature = this.articleFrom[key][0].key
            return
          }
          obj.params[key] = this.articleFrom[key]
        }
      })
      return obj
    },
    editArticle() {
      const obj = this.verify()
      if (obj.flag) {
        const id = this.$route.params.id
        if (id) {
          obj.params.id = id
        }
        updateArticle(obj.params).then(res => {
          if (res.data) {
            // 编辑成功  跳转到列表页面
            this.$message({
              message: '编辑成功', type: 'success'
            })
            this.$router.push({ name: 'AllArticle', meta: { title: '所有文章', icon: 'table' }})
          }
        })
      }
    },
    async   saveArticle() {
      const obj = this.verify()
      if (obj.flag) {
        await addArticle(obj.params).then(res => {
          if (res.data) {
            // 编辑成功  跳转到列表页面
            this.$message({
              message: '新增成功', type: 'success'
            })
            this.$router.push({ name: 'AllArticle', meta: { title: '所有文章', icon: 'table' }})
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .el-container {
    width: 100%;
    height: 100%;

    .EditArticle {
      width: 100%;
      height: 100%;
      padding-left: 15px;

      .el-form {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;

        .left-content {
          flex: 1;
          height: 100%;
          margin-right: 15px;
          display: flex;
          flex-direction: column;

          .left-title {
            height: 120px;
          }

          /deep/ .el-textarea > textarea {
            height: 600px;
          }
        }

        .right-content {
          width: 500px;
          padding-le: 0 15px;
          margin-right: 15px;

          /deep/ .el-select {
            position: relative;
            display: block;

            .el-input__suffix {
              position: absolute;
              height: 40px;
              line-height: 120px;
            }
          }
        }
      }

    }
  }
</style>
