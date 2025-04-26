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
          <span class="label">下单时间：</span>
          <span>{{ orderInfo.createTime }}</span>
        </div>
        <div class="info-item">
          <span class="label">订单状态：</span>
          <span>{{ formattedStatus }}</span>
        </div>
        <div class="info-item">
          <span class="label">总金额：</span>
          <span>¥{{ orderInfo.totalAmount }}</span>
        </div>
      </div>
      
      <el-divider></el-divider>
      
      <div class="order-goods-info">
        <h3>商品信息</h3>
        <el-table :data="orderInfo.goodsList" border style="width: 100%">
          <el-table-column prop="goodsName" label="商品名称"></el-table-column>
          <el-table-column prop="price" label="单价" width="120"></el-table-column>
          <el-table-column prop="quantity" label="数量" width="80"></el-table-column>
          <el-table-column prop="subtotal" label="小计" width="120"></el-table-column>
        </el-table>
      </div>
      
      <el-divider></el-divider>
      
      <div class="order-address-info">
        <h3>收货信息</h3>
        <div class="info-item">
          <span class="label">收货人：</span>
          <span>{{ orderInfo.receiverName }}</span>
        </div>
        <div class="info-item">
          <span class="label">联系电话：</span>
          <span>{{ orderInfo.receiverPhone }}</span>
        </div>
        <div class="info-item">
          <span class="label">收货地址：</span>
          <span>{{ orderInfo.receiverAddress }}</span>
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
        orderNo: '',
        createTime: '',
        totalAmount: 0,
        status: '',
        goodsList: [],
        receiverName: '',
        receiverPhone: '',
        receiverAddress: ''
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
      // 模拟获取订单详情数据
      this.orderInfo = {
        orderNo: this.orderId,
        createTime: '2023-06-01 10:00:00',
        totalAmount: 199.99,
        status: 'paid',
        goodsList: [
          {
            goodsName: '示例商品1',
            price: 99.99,
            quantity: 1,
            subtotal: 99.99
          },
          {
            goodsName: '示例商品2',
            price: 50.00,
            quantity: 2,
            subtotal: 100.00
          }
        ],
        receiverName: '张三',
        receiverPhone: '13800138000',
        receiverAddress: '北京市海淀区中关村大街1号'
      }
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