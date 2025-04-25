<template>
  <div class="location-management">
    <el-card>
      <div slot="header">
        <span>地点管理</span>
        <el-button type="primary" size="mini" style="float: right" @click="handleAdd">新增地点</el-button>
      </div>
      
      <el-table :data="locationList" border style="width: 100%">
        <el-table-column :prop="'id'" label="ID" width="80">
        <template slot-scope="scope">
        {{ String(scope.row.id) }}
        </template>
        </el-table-column>
        <el-table-column prop="locationName" label="地点名称"></el-table-column>
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
      <el-form :model="locationForm" :rules="rules" ref="locationForm" label-width="100px">
        <el-form-item label="地点名称" prop="name">
          <el-input v-model="locationForm.name"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="locationForm.address"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="locationForm.description"></el-input>
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
  name: 'LocationManagement',
  data() {
    return {
      locationList: [],
      pagination: {
        current: 1,
        size: 10,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '',
      locationForm: {
        id: '',
        name: '',
        address: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入地点名称', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getLocationList();
  },
  methods: {
    getLocationList() {
      this.$http.get('/location/list', {
        params: {
          page: this.pagination.current,
          size: this.pagination.size
        }
      }).then(res => {
        if (res.code === 200) {
          this.locationList = res.data.records;
          this.pagination.total = res.data.total;
        }
      });
    },
    handleAdd() {
      this.dialogTitle = '新增地点';
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.locationForm.resetFields();
      });
    },
    handleEdit(row) {
      this.dialogTitle = '编辑地点';
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.locationForm = Object.assign({}, row);
        this.locationForm.id = String(row.id);
      });
    },
    handleDelete(row) {
      this.$confirm('确定要删除该地点吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`/location/${String(row.id)}`).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.getLocationList();
          }
        });
      });
    },
    submitForm() {
      this.$refs.locationForm.validate(valid => {
        if (valid) {
          const api = this.locationForm.id ? '/location/update' : '/location/add';
          const data = { ...this.locationForm, id: String(this.locationForm.id) };
          this.$http.post(api, data).then(res => {
            if (res.code === 200) {
              this.$message.success('操作成功');
              this.dialogVisible = false;
              this.getLocationList();
            }
          });
        }
      });
    },
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getLocationList();
    },
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getLocationList();
    }
  }
}
</script>

<style scoped>
.location-management {
  padding: 20px;
}
</style>