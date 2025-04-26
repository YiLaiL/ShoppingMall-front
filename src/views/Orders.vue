<template>
  <div class="orders-container">
    <!-- 订单筛选 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="订单状态">
          <el-select v-model="filterForm.status" placeholder="请选择订单状态" clearable>
            <el-option
              v-for="status in orderStatusOptions"
              :key="status.value"
              :label="status.label"
              :value="status.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 订单列表 -->
    <el-table :data="orderList" border style="width: 100%" class="order-table">
      <el-table-column prop="orderNo" label="订单编号" width="180"></el-table-column>
      <el-table-column prop="createTime" label="下单时间" width="180"></el-table-column>
      <el-table-column prop="totalAmount" label="总金额"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="formatStatus"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleView(scope.row)">查看</el-button>
          <el-button 
            size="mini" 
            type="danger" 
            @click="handleCancel(scope.row)"
            v-if="scope.row.status === 'pending'">
            取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.current"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pagination.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
    
    <!-- 订单详情对话框 -->
    <el-dialog title="订单详情" :visible.sync="dialogVisible" width="70%">
      <order-detail :order-id="currentOrderId" v-if="dialogVisible" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 底部导航栏 -->
    <div class="bottom-nav">
      <div class="nav-item" @click="$router.push('/home')">
        <i class="el-icon-s-home"></i>
        <span>首页</span>
      </div>
      <div class="nav-item active">
        <i class="el-icon-tickets"></i>
        <span>订单</span>
      </div>
      <div class="nav-item" @click="$router.push('/profile')">
        <i class="el-icon-user"></i>
        <span>我的</span>
      </div>
    </div>
  </div>
</template>

<script>
import OrderDetail from './OrderDetail.vue'

export default {
  name: 'Orders',
  components: {
    OrderDetail
  },
  data() {
    return {
      filterForm: {
        status: ''
      },
      orderList: [],
      orderStatusOptions: [
        { value: 'pending', label: '待支付' },
        { value: 'paid', label: '已支付' },
        { value: 'shipped', label: '已发货' },
        { value: 'completed', label: '已完成' },
        { value: 'cancelled', label: '已取消' }
      ],
      pagination: {
        current: 1,
        size: 10,
        total: 0
      },
      dialogVisible: false,
      currentOrderId: ''
    }
  },
  created() {
    this.fetchOrderList()
  },
  methods: {
    fetchOrderList() {
      // 模拟获取订单列表数据
      this.orderList = [
        {
          orderNo: '202306010001',
          createTime: '2023-06-01 10:00:00',
          totalAmount: 199.99,
          status: 'paid'
        },
        {
          orderNo: '202306010002',
          createTime: '2023-06-01 11:00:00',
          totalAmount: 299.99,
          status: 'shipped'
        }
      ]
      this.pagination.total = 2
    },
    handleFilter() {
      this.pagination.current = 1
      this.fetchOrderList()
    },
    resetFilter() {
      this.filterForm = {
        status: ''
      }
      this.handleFilter()
    },
    formatStatus(row) {
      const statusMap = {
        'pending': '待支付',
        'paid': '已支付',
        'shipped': '已发货',
        'completed': '已完成',
        'cancelled': '已取消'
      }
      return statusMap[row.status] || row.status
    },
    handleView(row) {
      this.currentOrderId = row.orderNo
      this.dialogVisible = true
    },
    handleCancel(row) {
      this.$confirm('确定要取消该订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('订单已取消')
        row.status = 'cancelled'
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    handleSizeChange(val) {
      this.pagination.size = val
      this.fetchOrderList()
    },
    handleCurrentChange(val) {
      this.pagination.current = val
      this.fetchOrderList()
    }
  }
}
</script>

<style scoped>
.orders-container {
  padding: 20px;
  padding-bottom: 70px; /* 为底部导航栏留出空间 */
}
.filter-card {
  margin-bottom: 20px;
}
.order-table {
  margin-bottom: 20px;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  cursor: pointer;
}

.nav-item.active {
  color: #409EFF;
}

.nav-item i {
  font-size: 20px;
}

.nav-item span {
  font-size: 12px;
  margin-top: 2px;
}
</style>