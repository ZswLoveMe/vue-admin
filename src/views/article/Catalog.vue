<template>
  <el-container class="catalog">
    <el-main>
      <div class="left-content">
        <zsw-title>分类目录<span slot="hint" class="hint">添加新分类目录</span></zsw-title>

        <el-form ref="catalogFrom" :model="catalogFrom" :rules="rulesCatalogFrom">
          <el-form-item label="名称" prop="name" require>
            <el-input v-model="catalogFrom.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="别名" prop="slug" require>
            <el-input v-model="catalogFrom.slug" placeholder="请输入别名" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="right-content">
        <el-table
          width="100%"
          style="margin-top: 60px"
          :data="catalogTable"
          border
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="name"
            label="名称"
          />
          <el-table-column
            prop="slug"
            label="别名"
          />
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.row)"
              >编辑
              </el-button>
              <!-- 编辑 功能弹窗-->
              <el-dialog
                title="编辑分类"
                :visible.sync="catelogDialogVisible"
                width="30%"
                :before-close="handleClose"
              >
                <el-form ref="editFrom" :model="editFrom" :rules="rulesCatalogFrom">
                  <el-form-item label="名称" prop="name" require>
                    <el-input v-model="editFrom.name" placeholder="请输入名称" />
                  </el-form-item>
                  <el-form-item label="别名" prop="slug" require>
                    <el-input v-model="editFrom.slug" placeholder="请输入别名" />
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="handleClose">取 消</el-button>
                  <el-button type="primary" @click="updateCategories">确 定</el-button>
                </span>
              </el-dialog>

              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>
</template>

<script>

import { addCategories, getCategories, getCategoriesById, updateCategories } from '../../api/article'
import ZswTitle from '../../components/title/title'

export default {
  name: 'Catalog',
  components: { ZswTitle },
  data() {
    return {
      catelogDialogVisible: false,
      catalogFrom: {
        name: null,
        slug: null
      },
      editFrom: {
        id: null,
        name: null,
        slug: null
      },
      catalogTable: [],
      rulesCatalogFrom: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        slug: [
          { required: true, message: '请输入别名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    getCategories().then(res => {
      this.catalogTable = res.data || []
    })
  },
  methods: {
    handleClose() {
      this.catelogDialogVisible = false
      Object.keys(this.editFrom).forEach(key => {
        this.editFrom[key] = null
      })
    },
    async handleEdit(row) {
      /*
        * 更具Id 查询当前分类
        * */
      await getCategoriesById({ id: row.id }).then(res => {
        console.log('res：', res)
        Object.keys(this.editFrom).forEach(key => {
          this.editFrom[key] = res.data[key]
        })
      })
      this.catelogDialogVisible = true
    },
    async updateCategories() {
      this.$refs.editFrom.validate(async valid => {
        console.log('valid：', valid)
        if (valid) {
          /* 验证通过 */
          await updateCategories(this.editFrom).then(async res => {
            if (res.data) {
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              })
              // 刷新列表页面
              await getCategories().then(res => {
                this.catalogTable = res.data || []
              })
            }
          })
          this.editFrom.name = null
          this.editFrom.slug = null
          this.catelogDialogVisible = false
        }
      })
    },
    handleDelete() {

    },
    onSubmit() {
      this.$refs.catalogFrom.validate(async valid => {
        if (valid) {
          /* 验证通过 */
          addCategories(this.catalogFrom).then(async res => {
            if (res.data) {
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              })
              // 刷新列表页面
              await getCategories().then(res => {
                this.catalogTable = res.data || []
              })
              this.catalogFrom.name = null
              this.catalogFrom.slug = null
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .catalog {
    width: 100%;

    .el-main {
      display: flex;
      flex-direction: row;

      .left-content {
        width: 600px;
        margin-right: 15px;

        .hint {
          color: #ccc;
          font-size: 14px;
          margin-left: 15px;
        }
      }

      .right-content {
        flex: 1;
      }
    }

  }
</style>
