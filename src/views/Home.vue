<template>
  <div class="home-container">
    <!-- 顶部搜索栏 -->
    <div class="search-bar">
      <el-input
        placeholder="搜索商品"
        prefix-icon="el-icon-search"
        v-model="searchKeyword"
        @keyup.enter.native="searchProducts"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchProducts"></el-button>
      </el-input>
    </div>
    
    <!-- 商品分类 -->
    <div class="category-tabs">
      <el-tabs v-model="activeCategory" @tab-click="handleCategoryChange">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="数码产品" name="digital"></el-tab-pane>
        <el-tab-pane label="服装" name="clothing"></el-tab-pane>
        <el-tab-pane label="家居" name="home"></el-tab-pane>
        <el-tab-pane label="图书" name="books"></el-tab-pane>
      </el-tabs>
    </div>
    
    <!-- 商品列表 -->
    <div class="product-list">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="8" :md="6" :lg="6" v-for="(product, index) in products" :key="index">
          <el-card class="product-card" shadow="hover">
            <div class="product-img">
              <img :src="product.image" alt="商品图片">
            </div>
            <div class="product-info">
              <h3 class="product-title">{{ product.title }}</h3>
              <p class="product-price">¥{{ product.price }}</p>
              <p class="product-location">
                <i class="el-icon-location"></i> {{ product.location }}
              </p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 加载更多 -->
    <div class="load-more" v-if="products.length > 0">
      <el-button type="text" @click="loadMore">加载更多</el-button>
    </div>
    
    <!-- 底部导航栏 -->
    <div class="bottom-nav">
      <div class="nav-item active">
        <i class="el-icon-s-home"></i>
        <span>首页</span>
      </div>
      <div class="nav-item" @click="$router.push('/profile')">
        <i class="el-icon-user"></i>
        <span>我的</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      searchKeyword: '',
      activeCategory: 'all',
      products: [
        {
          id: 1,
          title: 'iPhone 12 Pro Max 256GB 海蓝色',
          price: 6999,
          image: 'https://via.placeholder.com/200x200?text=iPhone',
          location: '上海'
        },
        {
          id: 2,
          title: 'MacBook Pro 2021 M1芯片',
          price: 12999,
          image: 'https://via.placeholder.com/200x200?text=MacBook',
          location: '北京'
        },
        {
          id: 3,
          title: 'AirPods Pro 降噪耳机',
          price: 1499,
          image: 'https://via.placeholder.com/200x200?text=AirPods',
          location: '广州'
        },
        {
          id: 4,
          title: '华为 Mate 40 Pro 5G手机',
          price: 5999,
          image: 'https://via.placeholder.com/200x200?text=Huawei',
          location: '深圳'
        },
        {
          id: 5,
          title: '小米11 Ultra 至尊版',
          price: 5499,
          image: 'https://via.placeholder.com/200x200?text=Xiaomi',
          location: '武汉'
        },
        {
          id: 6,
          title: '索尼 WH-1000XM4 无线降噪耳机',
          price: 2299,
          image: 'https://via.placeholder.com/200x200?text=Sony',
          location: '成都'
        },
        {
          id: 7,
          title: 'iPad Pro 2021 12.9英寸',
          price: 7999,
          image: 'https://via.placeholder.com/200x200?text=iPad',
          location: '杭州'
        },
        {
          id: 8,
          title: '任天堂 Switch 游戏机',
          price: 2099,
          image: 'https://via.placeholder.com/200x200?text=Switch',
          location: '南京'
        }
      ],
      page: 1,
      pageSize: 8
    }
  },
  methods: {
    searchProducts() {
      // 实际开发中这里会调用API进行搜索
      if (this.searchKeyword.trim()) {
        this.$message.success(`正在搜索: ${this.searchKeyword}`)
        // 模拟搜索结果
        this.products = this.products.filter(product => 
          product.title.toLowerCase().includes(this.searchKeyword.toLowerCase())
        )
      }
    },
    handleCategoryChange() {
      // 实际开发中这里会根据分类调用API获取商品
      this.$message.success(`切换到分类: ${this.activeCategory}`)
      // 重置页码
      this.page = 1
      // 模拟不同分类的商品
      if (this.activeCategory === 'all') {
        // 恢复所有商品
        this.loadProducts()
      } else {
        // 根据分类筛选商品
        this.filterProductsByCategory(this.activeCategory)
      }
    },
    loadMore() {
      // 实际开发中这里会调用API加载更多商品
      this.page++
      this.$message.success(`加载更多商品，当前页: ${this.page}`)
      // 模拟加载更多
      const moreProducts = [
        {
          id: 9,
          title: '戴尔 XPS 13 笔记本电脑',
          price: 8999,
          image: 'https://via.placeholder.com/200x200?text=Dell',
          location: '重庆'
        },
        {
          id: 10,
          title: '三星 Galaxy S21 Ultra 5G',
          price: 7999,
          image: 'https://via.placeholder.com/200x200?text=Samsung',
          location: '西安'
        }
      ]
      this.products = [...this.products, ...moreProducts]
    },
    loadProducts() {
      // 实际开发中这里会调用API获取商品列表
      // 这里使用模拟数据
    },
    filterProductsByCategory(category) {
      // 实际开发中这里会调用API根据分类获取商品
      // 这里使用模拟数据进行筛选
      const categoryMap = {
        'digital': ['iPhone', 'MacBook', 'AirPods', '华为', '小米', '索尼', 'iPad', 'Switch', '戴尔', '三星'],
        'clothing': ['Nike', 'Adidas', '优衣库', 'H&M'],
        'home': ['宜家', '沙发', '床垫', '餐桌'],
        'books': ['小说', '教材', '漫画', '杂志']
      }
      
      const keywords = categoryMap[category] || []
      if (keywords.length > 0) {
        this.products = this.products.filter(product => {
          return keywords.some(keyword => product.title.includes(keyword))
        })
      }
    }
  },
  created() {
    // 页面创建时加载商品
    this.loadProducts()
  }
}
</script>

<style scoped>
.home-container {
  padding-bottom: 60px; /* 为底部导航留出空间 */
}

.search-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.category-tabs {
  margin: 10px 0;
}

.product-list {
  padding: 10px;
}

.product-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-img {
  height: 200px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 10px 0;
}

.product-title {
  font-size: 16px;
  margin: 5px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 18px;
  color: #f56c6c;
  font-weight: bold;
  margin: 5px 0;
}

.product-location {
  font-size: 12px;
  color: #999;
  margin: 5px 0;
}

.load-more {
  text-align: center;
  margin: 20px 0;
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