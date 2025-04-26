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
      <el-tabs v-model="activeCategory" @tab-click="handleCategoryChange" :animated="false" :lazy="true">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane v-for="category in categories" :key="category.id" :label="category.name" :name="category.id"></el-tab-pane>
      </el-tabs>
    </div>
    
    <!-- 商品列表 -->
    <div class="product-list">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="8" :md="6" :lg="6" v-for="(product, index) in products" :key="index">
          <el-card class="product-card" shadow="hover">
            <div class="product-img">
              <img :src="product.coverUrl" alt="商品图片" @click="$router.push(`/goods/detail/${product.id}`)">
            </div>
            <div class="product-info">
              <h3 class="product-title">{{ product.goodName }}</h3>
              <p class="product-price">¥{{ product.price }}</p>
              <div class="product-tags">
                <el-tag size="mini">{{ product.categoryName }}</el-tag>
                <el-tag size="mini" type="success">{{ product.tagName }}</el-tag>
              </div>
              <div class="product-meta">
                <span><i class="el-icon-box"></i> {{ product.stockNum }}件</span>
                <span><i class="el-icon-sold-out"></i> {{ product.saleNum }}件</span>
              </div>
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
      <div class="nav-item" @click="$router.push('/orders')">
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
export default {
  name: 'Home',
  data() {
    return {
      searchKeyword: '',
      activeCategory: 'all',
      products: [],
      categories: [],
      page: 1,
      pageSize: 8,
      loading: false
    }
  },
  methods: {
    async searchProducts() {
      if (this.searchKeyword.trim()) {
        try {
          const res = await this.$http.post('/api/products/search', {
            keyword: this.searchKeyword,        
            pageNum: this.page,
            pageSize: this.pageSize
          })
          this.products = res.data
        } catch (error) {
          this.$message.error('搜索失败')
        }
      }
    },
    async handleCategoryChange() {
      const category = this.categories.find(c => c.id === this.activeCategory)
      this.$message.success(`切换到分类: ${category ? category.name : '全部'}`)
      this.page = 1
      try {
        const category = this.categories.find(c => c.id === this.activeCategory)
        const res = await this.$http.post('/good/list/page', {
          pageNum: this.page,
          pageSize: this.pageSize,
          categoryIds: this.activeCategory === 'all' ? null : [category.id]
        })
        this.products = res.data.items
      } catch (error) {
        this.$message.error('获取商品列表失败')
      }
    },
    async loadMore() {
      if (this.loading) return
      
      this.loading = true
      this.page++
      try {
        const res = await this.$http.post('/good/list/page', {
          pageNum: this.page,
          pageSize: this.pageSize,
          categoryIds: this.activeCategory === 'all' ? null : [this.activeCategory]
        })
        
        if (res.data.items && res.data.items.length > 0) {
          this.products = [...this.products, ...res.data.items]
        } else {
          this.$message.info('没有更多商品了')
        }
      } catch (error) {
        this.page--
        this.$message.error('加载更多失败')
      } finally {
        this.loading = false
      }
    },
    
    handleScroll() {
      // 获取滚动位置
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      // 获取页面高度
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      // 获取视口高度
      const clientHeight = document.documentElement.clientHeight || window.innerHeight
      
      // 当滚动到距离底部100px时触发加载更多
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        this.loadMore()
      }
    },
    async loadProducts() {
      try {
        const res = await this.$http.post('/good/list/page', {
          pageNum: this.page,
          pageSize: this.pageSize
        })
        this.products = res.data.items
      } catch (error) {
        this.$message.error('获取商品列表失败')
      }
    },
    async loadCategories() {
      try {
        const res = await this.$http.get('/category/list', {
          params: {
            type: 0
          }
        })
        this.categories = res.data.map(category => ({
          id: category.id,
          name: category.categoryName
        }))
      } catch (error) {
        this.$message.error('获取分类列表失败')
      }
    },
    async filterProductsByCategory(category) {
      try {
        const res = await this.$http.get('/api/products', {
          params: {
            category: category === 'all' ? null : category
          }
        })
        this.products = res.data
      } catch (error) {
        this.$message.error('获取商品列表失败')
      }
    }
  },
  async created() {
    // 页面创建时加载商品和分类
    await this.loadProducts()
    await this.loadCategories()
  },
  
  mounted() {
    // 添加滚动事件监听
    window.addEventListener('scroll', this.handleScroll)
  },
  
  beforeDestroy() {
    // 组件销毁前移除事件监听
    window.removeEventListener('scroll', this.handleScroll)
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

.product-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin: 5px 0;
}

.product-meta i {
  margin-right: 3px;
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