<template>
  <div class="location-management">
    <el-card>
      <div slot="header">
        <span>地点管理</span>
        <el-button type="primary" size="mini" style="float: right" @click="handleAdd">新增地点</el-button>
      </div>
      <el-input
        v-model="searchForm.addressName"
        placeholder="请输入地点名称"
        style="width: 200px; margin-bottom: 20px"
        clearable
        @clear="handleSearchClear"
      >
        <el-button slot="append" icon="el-icon-search" @click="getLocationList" />
      </el-input>
      
      <el-table :data="locationList" border style="width: 100%" :cell-style="{textAlign: 'center'}">
        <el-table-column :prop="'id'" label="ID" width="180">
        <template slot-scope="scope">
        {{ String(scope.row.id) }}
        </template>
        </el-table-column>
        <el-table-column prop="locationName" label="地点名称">
          <template slot-scope="scope">
            {{ scope.row.addressName || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="locationName" label="父级地点">
          <template slot-scope="scope">
            {{ scope.row.parentName === "NULL" ? '-' : scope.row.parentName }}
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
      <el-form :model="locationForm" :rules="rules" ref="locationForm" label-width="100px">
        <el-form-item label="地点名称" prop="name">
          <el-input v-model="locationForm.name"></el-input>
        </el-form-item>
        <el-form-item label="父级地点" prop="parentId">
          <AddressCascader v-model="locationForm.parentId" />
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
import AddressCascader from '@/components/AddressCascader';

export default {
  name: 'LocationManagement',
  components: {
    AddressCascader
  },
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
      searchForm: {
        addressName: null
      },
      locationForm: {
        id: '',
        name: '',
        parentId: [],
        address: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入地点名称', trigger: 'blur' }],
        parentId: [{ required: false }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        description: [{ required: false }]
      }
    }
  },
  created() {
    this.getLocationList();
  },
  methods: {
    getLocationList() {
      this.$http.post('/address/list/page', {
        pageNum: this.pagination.current,
        pageSize: this.pagination.size,
        sortBy: "",
        isAsc: false,
        addressName: this.searchForm.addressName || "",
        type: null
      }).then(res => {
        if (res.code === 200) {
          this.locationList = res.data.items;
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
        this.$http.delete(`/address/delete`, { params: { id: String(row.id) } }).then(res => {
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
          const api = this.locationForm.id ? '/address/update' : '/address/save';
          const data = {
            parentId: this.locationForm.parentId[this.locationForm.parentId.length-1],
            addressName: this.locationForm.name,
            type: 0
          };
          if (this.locationForm.id) {
            data.id = String(this.locationForm.id);
          }
          delete data.parentName;
          const httpMethod = this.locationForm.id ? 'put' : 'post';
          this.$http[httpMethod](api, data).then(res => {
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
    },
    handleSearchClear() {
      this.searchForm.addressName = null;
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