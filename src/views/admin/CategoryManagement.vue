<template>
  <div class="category-management">
    <el-card>
      <div slot="header">
        <span>分类管理</span>
        <el-button type="primary" size="mini" style="float: right" @click="handleAdd">新增分类</el-button>
      </div>
      
      <el-table :data="categoryList" border style="width: 100%">
        <el-table-column :prop="'id'" label="ID" width="80">
        <template slot-scope="scope">
        {{ String(scope.row.id) }}
        </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="分类名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </el-card>
    
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <el-form :model="categoryForm" :rules="rules" ref="categoryForm" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="categoryForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CategoryManagement',
  data() {
    return {
      categoryList: [],
      pagination: {
        current: 1,
        size: 10,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '',
      categoryForm: {
        id: '',
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    getCategoryList() {
      this.$http.get('/category/list', {
        params: {
          page: this.pagination.current,
          size: this.pagination.size
        }
      }).then(res => {
        if (res.code === 200) {
          this.categoryList = res.data.records.map(item => ({ ...item, id: String(item.id) }));
          this.pagination.total = res.data.total;
        }
      });
    },
    handleAdd() {
      this.dialogTitle = '新增分类';
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.categoryForm.resetFields();
      });
    },
    handleEdit(row) {
      this.dialogTitle = '编辑分类';
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.categoryForm = Object.assign({}, row);
        this.categoryForm.id = String(row.id);
      });
    },
    handleDelete(row) {
      this.$confirm('确定要删除该分类吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`/category/${String(row.id)}`).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.getCategoryList();
          }
        });
      });
    },
    submitForm() {
      this.$refs.categoryForm.validate(valid => {
        if (valid) {
          const api = this.categoryForm.id ? '/category/update' : '/category/add';
          const data = { ...this.categoryForm, id: String(this.categoryForm.id) };
          this.$http.post(api, data).then(res => {
            if (res.code === 200) {
              this.$message.success('操作成功');
              this.dialogVisible = false;
              this.getCategoryList();
            }
          });
        }
      });
    },
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getCategoryList();
    },
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getCategoryList();
    }
  }
}
</script>

<style scoped>
.category-management {
  padding: 20px;
}
</style>