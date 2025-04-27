<template>
  <div class="goods-detail-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
    
    <div class="goods-detail-content">
      <div class="goods-image-container">
        <el-image 
          :src="goodsDetail.coverUrl" 
          :preview-src-list="[goodsDetail.coverUrl]"
          fit="cover"
          class="main-image"
        />
      </div>
      
      <div class="goods-info-container">
        <h1 class="goods-title">{{ goodsDetail.goodName }}</h1>
        <div class="goods-price">¥{{ goodsDetail.price }}</div>
        
        <div class="goods-meta">
          <div class="meta-item">
            <span class="meta-label">库存:</span>
            <span class="meta-value">{{ goodsDetail.stockNum }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">销量:</span>
            <span class="meta-value">{{ goodsDetail.saleNum }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">状态:</span>
            <el-tag :type="goodsDetail.status === '在售' ? 'success' : 'danger'">
              {{ goodsDetail.status }}
            </el-tag>
          </div>
        </div>
        
        <div class="goods-category">
          <span class="category-label">分类:</span>
          <el-tag>{{ goodsDetail.categoryName }}</el-tag>
        </div>
        
        <div class="goods-tag">
          <span class="tag-label">标签:</span>
          <el-tag>{{ goodsDetail.tagName }}</el-tag>
        </div>
        
        <div class="goods-description">
          <h3>商品描述</h3>
          <p>{{ goodsDetail.description }}</p>
        </div>
        
        <div class="goods-actions">
          <el-button 
            v-if="goodsDetail.creatorId != currentUser.id"
            type="success" 
            size="large" 
            @click="handleBuyNow">
            立即购买
          </el-button>
          
          <el-dialog title="购买商品" :visible.sync="dialogVisible" width="30%">
            <div style="margin-bottom: 20px">
              <span style="margin-right: 10px">购买数量：</span>
              <el-input-number 
                v-model="quantity" 
                :min="1" 
                :max="goodsDetail.stockNum" 
                @change="calculateTotal"
              />
            </div>
            
            <div style="margin-bottom: 20px">
              <span style="margin-right: 10px">配送地址：</span>
              <el-select v-model="selectedAddressId" placeholder="请选择配送地址" style="width: 100%">
                <el-option
                  v-for="address in addressList"
                  :key="address.id"
                  :label="`${address.province} ${address.city} ${address.county}`"
                  :value="address.id">
                </el-option>
              </el-select>
            </div>
            
            <div style="margin-bottom: 20px; font-size: 16px">
              总价：¥{{ totalPrice }}
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="handleConfirmBuy">确认购买</el-button>
            </span>
          </el-dialog>
          <el-button 
            v-if="goodsDetail.creatorId == currentUser.id"
            type="primary" 
            size="large" 
            @click="handleEditGoods">
            编辑商品
          </el-button>
        </div>
      </div>
    </div>
    
    <div class="goods-detail-section">
      <h3>商品详情</h3>
      <div v-html="goodsDetail.detail"></div>
    </div>
    
    <div class="seller-info">
      <h3>卖家信息</h3>
      <div class="seller-content">
        <el-avatar :size="60" :src="goodsDetail.creatorAvatar" />
        <div class="seller-text">
          <div class="seller-name">{{ goodsDetail.creatorName }}</div>
          <div class="seller-id">ID: {{ goodsDetail.creatorId }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsDetail',
  data() {
    return {
      goodsDetail: {
        id: '',
        goodName: '',
        coverUrl: '',
        price: 0,
        stockNum: 0,
        saleNum: 0,
        status: '',
        type: '',
        creatorId: '',
        creatorName: '',
        creatorAvatar: '',
        categoryName: '',
        tagName: '',
        description: '',
        detail: ''
      },
      currentUser: '',
      dialogVisible: false,
      quantity: 1,
      totalPrice: 0,
      selectedAddressId: '',
      addressList: []
    };
  },
  created() {
    try {
      this.currentUser = JSON.parse(localStorage.getItem('userInfo')) || {};
    } catch (error) {
      this.currentUser = {};
      console.error('解析用户信息失败', error);
    }
    this.getGoodsDetail();
  },
  methods: {
    getGoodsDetail() {
      const goodsId = String(this.$route.params.id);
      this.$http.get('/good/detail', { params: { id: goodsId } })
        .then(res => {
          if (res.code === 200) {
            // 确保所有id相关字段为字符串
            const data = res.data;
            data.id = String(data.id);
            data.creatorId = String(data.creatorId);
            this.goodsDetail = data;
          }
        })
        .catch(err => {
          this.$message.error('获取商品详情失败');
          console.error(err);
        });
    },
    handleAddToCart() {
      // 加入购物车逻辑
      this.$message.success('已加入购物车');
    },
    handleBuyNow() {
      this.dialogVisible = true;
      this.quantity = 1;
      this.calculateTotal();
      this.getAddressList();
    },
    
    getAddressList() {
      this.$http.get('/delivery/list')
        .then(res => {
          if (res.code === 200) {
            this.addressList = res.data;
          }
        })
        .catch(err => {
          this.$message.error('获取地址列表失败');
          console.error(err);
        });
    },
    calculateTotal() {
      this.totalPrice = this.quantity * this.goodsDetail.price;
    },
    handleConfirmBuy() {
      if (this.quantity > this.goodsDetail.stockNum) {
        this.$message.error('购买数量不能超过库存');
        return;
      }
      
      this.$http.post('/order/save', {
        goodId: this.goodsDetail.id,
        deliveryId: this.selectedAddressId,
        purchaseNum: this.quantity,
      }).then(res => {
        if (res.code === 200) {
          this.dialogVisible = false;
          this.$message.success(`订单已创建，总价¥${this.totalPrice}`);
          // 这里可以添加支付确认弹窗逻辑
        } else {
          this.$message.error(res.message || '创建订单失败');
        }
      }).catch(err => {
        this.$message.error('创建订单失败');
        console.error(err);
      });
    },
    handleEditGoods() {
      // 编辑商品逻辑
      this.$message.success('编辑商品');
    }
  }
};
</script>

<style scoped>
.goods-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.goods-detail-content {
  display: flex;
  margin-top: 20px;
  gap: 40px;
}

.goods-image-container {
  flex: 1;
}

.main-image {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.goods-info-container {
  flex: 1;
}

.goods-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.goods-price {
  font-size: 28px;
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 20px;
}

.goods-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-label {
  color: #909399;
}

.meta-value {
  font-weight: 500;
}

.goods-category,
.goods-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.category-label,
.tag-label {
  color: #909399;
}

.goods-description {
  margin: 30px 0;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.goods-description h3 {
  margin-bottom: 10px;
}

.goods-actions {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.goods-detail-section {
  margin-top: 40px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.seller-info {
  margin-top: 40px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.seller-content {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.seller-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.seller-id {
  color: #909399;
  font-size: 14px;
}
</style>