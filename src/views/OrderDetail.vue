<template>
  <div class="order-detail-container">
    <el-card class="order-info-card">
      <div class="order-header">
        <h2>订单编号：{{ orderInfo.orderNo }}</h2>
        <el-tag :type="statusTagType">{{ formattedStatus }}</el-tag>
      </div>
      
      <el-divider></el-divider>
      
      <div class="order-base-info">
        <div class="info-item">
          <span class="label">订单状态：</span>
          <span>{{ formattedStatus }}</span>
        </div>
        <div class="info-item">
          <span class="label">总金额：</span>
          <span>¥{{ orderInfo.total }}</span>
        </div>
      </div>
      
      <el-divider></el-divider>
      
      <div class="order-goods-info">
        <h3>商品信息</h3>
        <el-table :data="[orderInfo]" border style="width: 100%">
          <el-table-column prop="goodName" label="单价"></el-table-column>
          <el-table-column prop="price" label="单价" width="180"></el-table-column>
          <el-table-column prop="purchaseNum" label="数量" width="180"></el-table-column>
         
        </el-table>
      </div>
      
      <el-divider></el-divider>
      
      <div class="order-address-info">
        <h3>收货信息</h3>
        <div class="info-item">
          <span class="label">收货人：</span>
          <span>{{ orderInfo.consigneeName }}</span>
        </div>
        <div class="info-item">
          <span class="label">联系电话：</span>
          <span>{{ orderInfo.phone }}</span>
        </div>
        <div class="info-item">
          <span class="label">收货地址：</span>
          <span>{{ orderInfo.province }} {{ orderInfo.city }} {{ orderInfo.county }} {{ orderInfo.address }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'OrderDetail',
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      orderInfo: {
        id: '',
        total:'',
        status: '',  
        price:'',    
        purchaseNum:'',
        consigneeName: '',
        phone: '',
        province: '',
        city: '',
        county: '',
        address: ''
      }
    }
  },
  computed: {
    formattedStatus() {
      const statusMap = {
        'pending': '待支付',
        'paid': '已支付',
        'shipped': '已发货',
        'completed': '已完成',
        'cancelled': '已取消'
      }
      return statusMap[this.orderInfo.status] || this.orderInfo.status
    },
    statusTagType() {
      const typeMap = {
        'pending': 'warning',
        'paid': 'success',
        'shipped': '',
        'completed': 'info',
        'cancelled': 'danger'
      }
      return typeMap[this.orderInfo.status] || ''
    }
  },
  created() {
    this.fetchOrderDetail()
  },
  methods: {
    fetchOrderDetail() {
      this.$http.get(`/order/detail`, { params: { id: this.orderId } }).then(response => {
        if (response && response.code === 200) {
          console.log('订单详情API返回数据:', response.data)
          this.orderInfo = response.data
          console.log('订单详情API返回数据:', response.data)
        } else {
          const errorMsg = response?.message || '未知错误'
          this.$message.error('获取订单详情失败：' + errorMsg)
        }
      }).catch(error => {
        const errorMsg = error?.response?.data?.message || error?.message || '网络错误'
        this.$message.error('获取订单详情失败：' + errorMsg)
      })
    }
  }
}
</script>

<style scoped>
.order-detail-container {
  padding: 20px;
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.info-item {
  margin-bottom: 10px;
}
.label {
  display: inline-block;
  width: 80px;
  color: #909399;
}
</style>