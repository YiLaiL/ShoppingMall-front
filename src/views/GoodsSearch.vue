<template>
  <div class="goods-search-container">
    <el-form :model="searchForm" ref="searchForm" label-width="80px" class="search-form">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="商品名称" prop="goodName">
            <el-input v-model="searchForm.goodName" placeholder="请输入商品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品状态" prop="status">
            <el-select v-model="searchForm.status" placeholder="请选择商品状态">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="在售" :value="0"></el-option>
              <el-option label="下架" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="价格区间">
            <el-input-number v-model="searchForm.minimizePrice" :min="0" placeholder="最低价" style="width: 45%"></el-input-number>
            <span style="padding: 0 5px">-</span>
            <el-input-number v-model="searchForm.maximizePrice" :min="0" placeholder="最高价" style="width: 45%"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="商品分类" prop="categoryIds">
            <CategoryCascader v-model="searchForm.categoryIds" multiple clearable placeholder="请选择商品分类" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品标签" prop="tagIds">
            <el-select v-model="searchForm.tagIds" multiple clearable placeholder="请选择商品标签">
              <el-option 
                v-for="tag in tags" 
                :key="String(tag.id)" 
                :label="tag.tagName" 
                :value="String(tag.id)">
              </el-option>
           </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>
    
    <div class="goods-card-container">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item, index) in goodsList" :key="String(item.id)">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <div class="card-image-container">
            <img :src="item.coverUrl || item.image" class="card-image" v-if="item.coverUrl || item.image" @click="$router.push(`/goods/detail/${String(item.id)}`)">
            <div class="card-badge" v-if="item.status === 0">在售</div>
            </div>
            <div style="padding: 14px;">
              <div class="card-title">{{ item.goodName || item.title }}</div>
              <div class="card-price">¥{{ item.price }}</div>
              <div class="card-meta">
                <span>库存: {{ item.stockNum }}</span>
                <span class="card-category">{{ item.categoryName }}</span>
              </div>
              <div class="card-desc">{{ item.description }}</div>
              <div class="card-actions">
                <el-button size="small" @click="handleEdit(item)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete(String(item.id))">删除</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchForm.pageNum"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="searchForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import CategoryCascader from '@/components/CategoryCascader.vue';

export default {
  name: 'GoodsSearch',
  components: {
    CategoryCascader
  },
  data() {
    return {
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        sortBy: '',
        isAsc: true,
        goodName: '',
        type: null,
        rankType: null,
        status: null,
        creatorId: '',
        categoryIds: [],
        tagIds: [], // 确保为数组，防止el-select绑定时报错
        minimizePrice: null,
        maximizePrice: null
      },
      goodsList: [],
      total: 0,
      loading: false,
      tags: []
    };
  },
  created() {
    this.getTags();
    this.searchGoods();
  },
  methods: {
    getTags() {
      this.$http.get('/tag/list', { params: { type: 0 } })
        .then(res => {
          if (res.code === 200) {
            this.tags = res.data;
          }
        });
    },
    searchGoods() {
      this.loading = true;
      const requestData = {
        ...this.searchForm,
        // categoryIds: this.searchForm.categoryIds=this.searchForm.categoryIds[this.searchForm.categoryIds.length-1]
      };
      this.$http.post('/good/list/own', requestData)
        .then(res => {
         if (res && res.code === 200) {
            this.goodsList = res.data.items;
            this.total = res.data.total;
          } else {
            this.$message.error(res?.message || '请求失败');
          }
        })
        .catch(err => {
          if (err?.code === 'ECONNABORTED') {
            this.$message.error('请求超时，请检查网络连接');
          } else if (err?.message === 'Network Error') {
            this.$message.error('网络错误，请检查API服务是否可用');
          } else {
            this.$message.error(err?.response?.data?.message || '服务器错误');
          }
          console.error('API请求错误:', err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSearch() {
      this.searchForm.pageNum = 1;
      this.searchGoods();
    },
    resetSearch() {
      this.$refs.searchForm.resetFields();
      this.searchForm.minimizePrice = null;
      this.searchForm.maximizePrice = null;
      this.searchForm.pageNum = 1;
      this.searchGoods();
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      this.searchGoods();
    },
    handleCurrentChange(val) {
      this.searchForm.pageNum = val;
      this.searchGoods();
    },
    handleEdit(row) {
      // 编辑商品逻辑
      console.log('编辑商品:', row);
    },
    handleDelete(id) {
      // 删除商品逻辑
      this.$http.delete('/good/delete', { params: { GoodId: String(id) } })
        .then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.handleSearch();
          }
        });
    },
  }
};
</script>

<style scoped>
.goods-search-container {
  padding: 20px;
}
.search-form {
  margin-bottom: 20px;
}
.goods-card-container {
  margin-top: 20px;
}
.card-image-container {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
}
.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.card-image:hover {
  transform: scale(1.05);
}
.card-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #67c23a;
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
}
.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-price {
  font-size: 20px;
  font-weight: bold;
  color: #f56c6c;
  margin: 8px 0;
}
.card-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}
.card-category {
  color: #409eff;
}
.card-desc {
  font-size: 13px;
  color: #606266;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>