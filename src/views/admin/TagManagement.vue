<template>
  <div class="tag-management">
    <el-card>
      <div slot="header">
        <span>标签管理</span>
        <el-button type="primary" size="mini" style="float: right" @click="handleAdd">新增标签</el-button>
      </div>
      
      <el-table :data="tagList" border style="width: 100%" cell-style="{textAlign: 'center'}">
        <el-table-column :prop="'id'" label="ID" width="180">
          <template slot-scope="scope">
            {{ String(scope.row.id) }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="标签名称">
          <template slot-scope="scope">
            {{ scope.row.tagName === "NULL" ? '-' : scope.row.tagName }}
          </template>
        </el-table-column>
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
      <el-form :model="tagForm" :rules="rules" ref="tagForm" label-width="100px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="tagForm.name"></el-input>
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
  name: 'TagManagement',
  data() {
    return {
      tagList: [],
      pagination: {
        current: 1,
        size: 10,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '',
      tagForm: {
        id: '',
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getTagList();
  },
  methods: {
    getTagList() {
      this.$http.post('/tag/list/page', {
        pageNum: this.pagination.current,
        pageSize: this.pagination.size,
        sortBy: "",
        isAsc: false,
        tagName: "",
        type: "0"
      }).then(res => {
        if (res.code === 200) {
          this.tagList = res.data.items.map(item => ({ ...item, id: String(item.id) }));
          this.pagination.total = res.data.total;
        }
      });
    },
    handleAdd() {
      this.dialogTitle = '新增标签';
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.tagForm.resetFields();
      });
    },
    handleEdit(row) {
      this.dialogTitle = '编辑标签';
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.tagForm = Object.assign({}, row);
        this.tagForm.id = String(row.id);
      });
    },
    handleDelete(row) {
      this.$confirm('确定要删除该标签吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/tag/delete', { params: { id: String(row.id) } }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.getTagList();
          }
        });
      });
    },
    submitForm() {
      this.$refs.tagForm.validate(valid => {
        if (valid) {
          const api = this.tagForm.id ? '/tag/update' : '/tag/save';
          const httpMethod = this.tagForm.id ? 'put' : 'post';
          const data = this.tagForm.id ? 
            { 
              id: String(this.tagForm.id),
              tagName: this.tagForm.name,
              type: 0 
            } : 
            { 
              tagName: this.tagForm.name,
              type: 0 
            };
          this.$http[httpMethod](api, data).then(res => {
            if (res.code === 200) {
              this.$message.success('操作成功');
              this.dialogVisible = false;
              this.getTagList();
            }
          });
        }
      });
    },
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getTagList();
    },
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getTagList();
    }
  }
}
</script>

<style scoped>
.tag-management {
  padding: 20px;
}
</style>