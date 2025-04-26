<template>
  <div class="search-results-container">
    <el-container>
      <el-aside width="350px" class="filter-sidebar">
        <el-form label-width="40px">
          <el-form-item label="价格">
            <el-input-number v-model="priceRange[0]" :min="0" placeholder="最低价" style="width: 150px"></el-input-number>
            <span style="padding: 0 5px">至</span>
            <el-input-number v-model="priceRange[1]" :min="0" placeholder="最高价" style="width: 150px"></el-input-number>
          </el-form-item>
          <el-form-item label="分类">
            <CategoryCascader v-model="selectedCategory" placeholder="请选择分类" style="width:100%" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="resetFilters">重置</el-button>
          </el-form-item>
        </el-form>
      </el-aside>
      
      <el-main>
        <!-- 顶部搜索栏 -->
        <div class="search-bar">
          <el-input
            placeholder="搜索商品"
            prefix-icon="el-icon-search"
            v-model="searchKeyword"
            @keyup.enter.native="searchProducts"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchProducts()"></el-button>
          </el-input>
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
</el-main>
    </el-container>
  </div>
</template>

<script>
import CategoryCascader from '@/components/CategoryCascader.vue'

export default {
  name: 'SearchResults',
  components: {
    CategoryCascader
  },
  data() {
    return {
      searchKeyword: '',
      products: [],
      page: 1,
      pageSize: 8,
      loading: false,
      priceRange: [null, null],
      selectedCategory: null,
      categories: []
    }
  },
  methods: {
    resetFilters() {
      this.priceRange = [null, null];
      this.selectedCategory = null;
    //   this.searchProducts();
    },
    
    async searchProducts() {
      // 保存搜索状态到localStorage
      const searchState = {
        keyword: this.searchKeyword,
        category: this.selectedCategory,
        priceRange: this.priceRange
      };
      localStorage.setItem('searchState', JSON.stringify(searchState));
      try {
        const params = {
          pageNum: this.page,
          pageSize: this.pageSize,
          minimizePrice: this.priceRange[0],
          maximizePrice: this.priceRange[1],
          categoryIds: this.selectedCategory,
          status:0
        }
        
        if (this.searchKeyword.trim()) {
          params.goodName = this.searchKeyword
        } else {
          this.$message.info('已显示全部商品')
        }
        
        const res = await this.$http.post('/good/list/page', params)
        this.products = res.data.items
        
        // 保存当前搜索状态到localStorage
        localStorage.setItem('searchState', JSON.stringify({
          priceRange: this.priceRange,
          selectedCategory: this.selectedCategory,
          searchKeyword: this.searchKeyword
        }))
      } catch (error) {
        this.$message.error('搜索失败')
      }
    },
    async loadMore() {
      if (this.loading) return
      
      this.loading = true
      this.page++
      try {
        const params = {
          goodName: this.searchKeyword,
          pageNum: this.page,
          pageSize: this.pageSize,
          minimizePrice: this.priceRange[0],
          maximizePrice: this.priceRange[1],
          categoryIds: this.selectedCategory,
          status:0
        }
        
        const res = await this.$http.post('/good/list/page', params)
        
        if (res.data && res.data.items && res.data.items.length > 0) {
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
    }
  },
  created() {
    // 检查是否有路由参数中的关键词（从Home页面跳转）
    const routeKeyword = this.$route.query.keyword;
    const fromHome = this.$route.query.from === 'home' || this.$route.path.includes('/search') && routeKeyword;
    // 从localStorage恢复状态
    const savedState = localStorage.getItem('searchState');
    if (fromHome && routeKeyword) {
      this.searchKeyword = routeKeyword;
      if (savedState) {
        const state = JSON.parse(savedState);
        this.priceRange = state.priceRange;
        this.selectedCategory = state.selectedCategory;
      }
      // 只有首次进入时才自动搜索
      this.searchProducts();
    } else if (savedState) {
      const state = JSON.parse(savedState);
      this.priceRange = state.priceRange;
      this.selectedCategory = state.selectedCategory;
      this.searchKeyword = state.searchKeyword || routeKeyword || '';
      // 如果不是通过push进入（即不是详情页回退），才自动搜索
      if (performance && performance.getEntriesByType) {
        const navs = performance.getEntriesByType('navigation');
        if (navs.length && navs[0].type === 'navigate') {
          this.searchProducts();
        }
      }
    } else {
      this.searchKeyword = routeKeyword || '';
      // 只有首次进入才自动搜索
      if (performance && performance.getEntriesByType) {
        const navs = performance.getEntriesByType('navigation');
        if (navs.length && navs[0].type === 'navigate') {
          this.searchProducts();
        }
      }
    }
  },
  
  beforeRouteLeave(to, from, next) {
    // 只有当跳转到非搜索结果页面时才保存状态
    // 这样可以避免覆盖用户在页面内搜索后的关键词
    if (!to.path.includes('/search')) {
      localStorage.setItem('searchState', JSON.stringify({
        priceRange: this.priceRange,
        selectedCategory: this.selectedCategory,
        searchKeyword: this.searchKeyword
      }))
    }
    next()
  }
}
</script>

<style scoped>
.search-results-container {
  padding-bottom: 0;
  height: 100vh;
}

.filter-sidebar {
  background: #fff;
  padding: 20px;
  border-right: 1px solid #e6e6e6;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
}

.el-main {
  padding: 0 20px;
}

.search-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
</style>