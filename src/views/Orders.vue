<template>
  <div class="orders-container">
    <div class="order-layout">
  <div class="order-main">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="我的订单" name="myOrders">
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
      <el-table-column prop="id" label="订单编号" ></el-table-column>
      <el-table-column prop="goodName" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="purchaseNum" width="180" label="交易数量"></el-table-column>
      <el-table-column prop="total" width="180"  label="总金额"></el-table-column>
      <el-table-column prop="status" width="180" label="状态" :formatter="formatStatus"></el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleView(scope.row)">查看</el-button>
          <el-button 
            size="mini" 
            type="primary" 
            @click="handlePay(scope.row)"
            v-if="scope.row.status === '待支付'">
            支付
          </el-button>
          <el-button 
            size="mini" 
            type="danger" 
            @click="handleCancel(scope.row)"
            v-if="scope.row.status === '待支付'">
            取消
          </el-button>
          <el-button 
            size="mini" 
            type="danger" 
            @click="handleGet(scope.row)"
            v-if="scope.row.status === '待收货'">
            确认收货
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
      </el-tab-pane>
      
      <el-tab-pane label="商品订单" name="productOrders">
        <!-- 商品订单内容 -->
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
        
        <el-table :data="productOrderList" border style="width: 100%" class="order-table">
          <el-table-column prop="id" label="订单编号" ></el-table-column>
      <el-table-column prop="goodName" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="purchaseNum"width="180" label="交易数量"></el-table-column>
      <el-table-column prop="total" width="180" label="总金额"></el-table-column>
      <el-table-column prop="status" width="180" label="状态" :formatter="formatStatus"></el-table-column>
        <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleView(scope.row)">查看</el-button>
              <el-button 
                size="mini" 
                type="primary" 
                @click="handleSend(scope.row)"
                v-if="scope.row.status === '待发货'">
                发货
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.current"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
      </el-tab-pane>
      
      <el-tab-pane label="收货信息" name="addressInfo">
        <el-button type="primary" @click="showAddressDialog = true" style="margin-bottom: 20px">新增收货信息</el-button>
        <el-table :data="addressList" border style="width: 100%" class="order-table">
          <el-table-column prop="receiverName" label="收货人" width="180"></el-table-column>
          <el-table-column prop="receiverPhone" label="联系电话" width="180"></el-table-column>
          <el-table-column prop="receiverAddress" label="收货地址"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEditAddress({...scope.row, id: scope.row.id})">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDeleteAddress(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 新增收货信息对话框 -->
        <el-dialog title="新增收货信息" :visible.sync="showAddressDialog" width="50%">
          <address-info v-model="currentAddressInfo" @close="handleAddressClose" />
          <span slot="footer" class="dialog-footer">
            <el-button @click="showAddressDialog = false">取消</el-button>
          </span>
        </el-dialog>
        
        <!-- 编辑收货信息对话框 -->
        <edit-address-dialog ref="editAddressDialog" />
      </el-tab-pane>
    </el-tabs>
  </div>
  
  
</div>

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
import AddressInfo from './AddressInfo.vue'
import EditAddressDialog from './EditAddressDialog.vue'

export default {
  name: 'Orders',
  components: {
    OrderDetail,
    AddressInfo,
    EditAddressDialog
  },
  data() {
    return {
      activeTab: 'myOrders',
      filterForm: {
        status: ''
      },
      orderList: [],
      productOrderList: [],
      addressList: [],
      orderStatusOptions: [
        { value: 0, label: '待支付' },
        { value: 1, label: '待发货' },
        { value: 2, label: '待收货' },
        { value: 3, label: '已完成' },
        { value: 4, label: '已取消' }
      ],
      pagination: {
        current: 1,
        size: 10,
        total: 0
      },
      dialogVisible: false,
      currentOrderId: '',
      currentAddressInfo: {
        receiverName: '',
        receiverPhone: '',
        receiverAddress: ''
      },
      showAddressDialog: false
    }
  },
  created() {
    this.fetchOrderList()
  },
  watch: {
    activeTab(newVal) {
      if (newVal === 'addressInfo') {
        this.fetchDeliveryInfo()
      } else if (newVal === 'productOrders') {
        this.fetchOrderList()
      }
    }
  },
  methods: {
    handleAddressClose() {
      this.showAddressDialog = false;
    },
    handleEditAddress(row) {
      
      this.$refs.editAddressDialog.dialogVisible = true;
    
      this.$refs.editAddressDialog.form = {
        id: row.id,
        receiverName: row.receiverName,
        receiverPhone: row.receiverPhone,
        receiverRegion: row.receiverAddress.split(','),
        receiverDetailAddress: row.receiverAddress.split(',').slice(3).join(' ')
      };
      console.log(row.id)
      console.log(this.$refs.editAddressDialog.form)
      this.$refs.editAddressDialog.dialogTitle = '编辑收货信息';
      this.$refs.editAddressDialog.$emit('update:visible', true);
    },
    

    handleDeleteAddress(row) {
      this.$confirm('确定要删除该收货地址吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('收货地址已删除');
        this.addressList = this.addressList.filter(item => item !== row);
      }).catch(() => {
        this.$message.info('已取消操作');
      });
    },
    fetchOrderList() {
      if (this.activeTab === 'myOrders') {
        this.$http.post('/order/list/page/own', {
          pageNum: this.pagination.current,
          pageSize: this.pagination.size,
          sortBy: "",
          isAsc: false,
          userId: null,
          businessId: null,
          status: this.filterForm.status
        }).then(response => {
          if (response.code === 200) {
            this.orderList = response.data.items
            this.pagination.total = response.data.total
          }
        }).catch(error => {
          this.$message.error('获取订单列表失败：' + error.message)
        })
      } else if (this.activeTab === 'productOrders') {
        this.$http.post('/order/list/page/client', {
          pageNum: this.pagination.current,
          pageSize: this.pagination.size,
          sortBy: "",
          isAsc: false,
          userId: null,
          businessId: null,
          status: this.filterForm.status
        }).then(response => {
          if (response.code === 200) {
            this.productOrderList = response.data.items
            this.pagination.total = response.data.total
          }
        }).catch(error => {
          this.$message.error('获取商品订单列表失败：' + error.message)
        })
      }
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
      this.currentOrderId = row.id
      this.dialogVisible = true
    },
    handlePay(row) {
      this.$confirm('确定要支付该订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.put('/order/update/shipping', null, {
          params: {
            id: String(row.id)
          }
        }).then(response => {
          if (response.code === 200) {
            this.$message.success('订单支付成功')
            row.status = 'paid'
          } else {
            this.$message.error(response.message || '支付失败')
          }
        }).catch(error => {
          this.$message.error('支付失败：' + error.message)
        })
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
    },
    handleSend(row) {
      this.$confirm('确定要发货吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.put('/order/update/receiving', null, {
          params: {
            id: String(row.id)
          }
        }).then(response => {
          if (response.code === 200) {
            this.$message.success('发货成功')
            row.status = 'paid'
          } else {
            this.$message.error(response.message || '发货失败')
          }
        }).catch(error => {
          this.$message.error('支付失败：' + error.message)
        })
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    handleGet(row) {
      this.$confirm('确定要确认收货吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.put('/order/update/completed', null, {
          params: {
            id: String(row.id)
          }
        }).then(response => {
          if (response.code === 200) {
            this.$message.success('收货成功')
            row.status = 'paid'
          } else {
            this.$message.error(response.message || '收货失败')
          }
        }).catch(error => {
          this.$message.error('支付失败：' + error.message)
        })
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    handleCancel(row) {
      this.$confirm('确定要取消该订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.put('/order/update/canceled', null, {
          params: {
            id: String(row.id)
          }
        }).then(response => {
          if (response.code === 200) {
            this.$message.success('订单取消成功')
            row.status = 'cancelled'
          } else {
            this.$message.error(response.message || '取消失败')
          }
        }).catch(error => {
          this.$message.error('取消失败：' + error.message)
        })
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    
    fetchDeliveryInfo() {
      this.$http.get('/delivery/list').then(response => {
        if (response.code === 200 && response.data.length > 0) {
          // 使用第一条作为默认收货地址
          const delivery = response.data[0]
          this.currentAddressInfo = {
            receiverName: delivery.consigneeName || '',
            receiverPhone: delivery.phone || '',
            receiverAddress: `${delivery.province || ''}${delivery.city || ''}${delivery.county || ''}${delivery.address || ''}`
          }
          // 存储所有收货地址
          this.addressList = response.data.map(item => ({
            id: item.id,
            receiverName: item.consigneeName || '',
            receiverPhone: item.phone || '',
            receiverAddress: `${item.province || ''}${item.city || ''}${item.county || ''}${item.address || ''}`
          }))
        }
      }).catch(error => {
        this.$message.error('获取收货信息失败：' + error.message)
      })
    },

    saveAddress(addressInfo) {
      this.$http.post('/delivery/save/id', {
        consigneeName: addressInfo.receiverName,
        phone: addressInfo.receiverPhone,
        provinceId: addressInfo.receiverAddress[0],
        cityId: addressInfo.receiverAddress[1],
        countyId: addressInfo.receiverAddress[2],
        address: addressInfo.receiverDetailAddress
      }).then(response => {
        this.$message.success('收货信息保存成功')
        this.$emit('input', addressInfo)
      }).catch(error => {
        this.$message.error('保存失败：' + error.message)
      })
    }
  }
}
</script>

<style scoped>
.orders-container {
  padding: 20px;
  padding-bottom: 70px; /* 为底部导航栏留出空间 */
}

.order-layout {
  display: flex;
  gap: 20px;
}

.order-main {
  flex: 1;
}

.address-info {
  width: 300px;
}

.address-info .el-card {
  height: 100%;
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