<template>
  <div class="permission-management">
    <el-card>
      <div slot="header">
        <span>权限管理</span>
        <el-button type="primary" size="mini" style="float: right" @click="handleAdd">新增权限</el-button>
      </div>
      
      <el-table :data="permissionList" border style="width: 100%">
        <el-table-column :prop="'id'" label="ID" width="80">
        <template slot-scope="scope">
        {{ String(scope.row.id) }}
        </template>
        </el-table-column>
        <el-table-column prop="permissionName" label="权限名称"></el-table-column>
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
      <el-form :model="permissionForm" :rules="rules" ref="permissionForm" label-width="100px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="permissionForm.name"></el-input>
        </el-form-item>
        <el-form-item label="权限编码" prop="code">
          <el-input v-model="permissionForm.code"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="permissionForm.description"></el-input>
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
  name: 'PermissionManagement',
  data() {
    return {
      permissionList: [],
      pagination: {
        current: 1,
        size: 10,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '',
      permissionForm: {
        id: '',
        name: '',
        code: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入权限编码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getPermissionList();
  },
  methods: {
    getPermissionList() {
      // 获取权限列表API
      this.$http.get('/permission/list', {
        params: {
          page: this.pagination.current,
          size: this.pagination.size
        }
      }).then(res => {
        if (res.code === 200) {
          this.permissionList = res.data.records.map(item => ({ ...item, id: String(item.id) }));
          this.pagination.total = res.data.total;
        }
      });
    },
    handleAdd() {
      this.dialogTitle = '新增权限';
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.permissionForm.resetFields();
      });
    },
    handleEdit(row) {
      this.dialogTitle = '编辑权限';
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.permissionForm = Object.assign({}, row);
        this.permissionForm.id = String(row.id);
      });
    },
    handleDelete(row) {
      this.$confirm('确定要删除该权限吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`/permission/${String(row.id)}`).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.getPermissionList();
          }
        });
      });
    },
    submitForm() {
      this.$refs.permissionForm.validate(valid => {
        if (valid) {
          const api = this.permissionForm.id ? '/permission/update' : '/permission/add';
          const data = { ...this.permissionForm, id: String(this.permissionForm.id) };
          this.$http.post(api, data).then(res => {
            if (res.code === 200) {
              this.$message.success('操作成功');
              this.dialogVisible = false;
              this.getPermissionList();
            }
          });
        }
      });
    },
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getPermissionList();
    },
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getPermissionList();
    }
  }
}
</script>

<style scoped>
.permission-management {
  padding: 20px;
}
</style>