<template>
  <div class="profile-container">
    <!-- 用户信息卡片 -->
    <el-card class="user-card">
      <div class="user-info">
        <div class="avatar-container">
          <el-avatar :size="80" :src="userInfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"></el-avatar>
          <el-button type="text" class="change-avatar-btn" @click="showAvatarUpload = true">修改头像</el-button>
        </div>
        <div class="user-details">
          <h2>{{ userInfo.username }}</h2>
          <p>{{ userInfo.email }}</p>
        </div>
        <el-button type="primary" size="small" @click="showEditDialog = true">编辑资料</el-button>
          <el-button type="danger" size="small" @click="handleLogout" style="margin-left: 10px;">退出登录</el-button>
      </div>
    </el-card>
    
    <!-- 我的商品和发布商品 -->
    <el-tabs v-model="activeTab" class="main-tabs">
      <el-tab-pane label="我的商品" name="myProducts">
        <div class="product-list" v-if="myProducts.length > 0">
          <el-row :gutter="20">
            <el-col :xs="12" :sm="8" :md="6" :lg="6" v-for="(product, index) in myProducts" :key="index">
              <el-card class="product-card" shadow="hover">
                <div class="product-img">
                  <img :src="product.image" alt="商品图片">
                </div>
                <div class="product-info">
                  <h3 class="product-title">{{ product.title }}</h3>
                  <p class="product-price">¥{{ product.price }}</p>
                  <p class="product-status">状态: {{ product.status }}</p>
                </div>
                <div class="product-actions">
                  <el-button type="text" size="small" @click="editProduct(product)">编辑</el-button>
                  <el-button type="text" size="small" @click="deleteProduct(product.id)">删除</el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <div class="empty-data" v-else>
          <el-empty description="暂无发布的商品"></el-empty>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="发布商品" name="publishProduct">
        <el-form :model="productForm" :rules="productRules" ref="productForm" label-width="80px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="productForm.title" placeholder="请输入商品标题"></el-input>
          </el-form-item>
          
          <el-form-item label="价格" prop="price">
            <el-input-number v-model="productForm.price" :min="0" :precision="2" :step="10"></el-input-number>
          </el-form-item>
          
          <el-form-item label="分类" prop="category">
            <el-select v-model="productForm.category" placeholder="请选择商品分类">
              <el-option label="数码产品" value="digital"></el-option>
              <el-option label="服装" value="clothing"></el-option>
              <el-option label="家居" value="home"></el-option>
              <el-option label="图书" value="books"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="地点" prop="location">
            <el-input v-model="productForm.location" placeholder="请输入商品所在地"></el-input>
          </el-form-item>
          
          <el-form-item label="图片" prop="image">
            <el-upload
              class="upload-demo"
              action="#"
              :auto-upload="false"
              :on-change="handleImageChange"
              :limit="1"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
            </el-upload>
          </el-form-item>
          
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="productForm.description" :rows="4" placeholder="请输入商品描述"></el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="submitProduct">发布商品</el-button>
            <el-button @click="resetProductForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 编辑个人资料对话框 -->
    <el-dialog title="编辑个人资料" :visible.sync="showEditDialog" width="400px">
      <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="updateUserInfo">确定</el-button>
      </span>
    </el-dialog>
    
    <!-- 头像上传对话框 -->
    <el-dialog title="修改头像" :visible.sync="showAvatarUpload" width="400px">
      <el-upload
        class="avatar-uploader"
        action="#"
        :auto-upload="false"
        :on-change="handleAvatarChange"
        :show-file-list="false">
        <img v-if="avatarPreview" :src="avatarPreview" class="avatar-preview">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAvatarUpload = false">取消</el-button>
        <el-button type="primary" @click="updateAvatar">确定</el-button>
      </span>
    </el-dialog>
    
    <!-- 底部导航栏 -->
    <div class="bottom-nav">
      <div class="nav-item" @click="$router.push('/home')">
        <i class="el-icon-s-home"></i>
        <span>首页</span>
      </div>
      <div class="nav-item active">
        <i class="el-icon-user"></i>
        <span>我的</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    // 邮箱验证规则
    const validateEmail = (rule, value, callback) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value) {
        callback(new Error('请输入邮箱'))
      } else if (!emailRegex.test(value)) {
        callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    }
    
    return {
      userInfo: {
        username: '',
        email: '',
        avatar: ''
      },
      activeTab: 'myProducts',
      myProducts: [],
      showEditDialog: false,
      showAvatarUpload: false,
      avatarPreview: '',
      editForm: {
        username: '',
        email: ''
      },
      editRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ]
      },
      productForm: {
        title: '',
        price: 0,
        category: '',
        location: '',
        image: '',
        description: ''
      },
      productRules: {
        title: [
          { required: true, message: '请输入商品标题', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ],
        location: [
          { required: true, message: '请输入商品所在地', trigger: 'blur' }
        ],
        image: [
          { required: true, message: '请上传商品图片', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入商品描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 从本地存储获取用户信息
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      this.userInfo = JSON.parse(userInfoStr)
      this.editForm.username = this.userInfo.username
      this.editForm.email = this.userInfo.email
    }
    
    // 加载用户发布的商品
    this.loadMyProducts()
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('token');
      this.$message.success('已退出登录');
      this.$router.push('/login');
    },
    loadMyProducts() {
      // 模拟获取用户发布的商品
      this.myProducts = [
        {
          id: 101,
          title: '二手iPhone 11 128GB 黑色',
          price: 3999,
          image: 'https://via.placeholder.com/200x200?text=iPhone11',
          status: '在售',
          category: 'digital',
          location: '上海',
          description: '使用一年，外观9成新，电池健康度90%，无维修记录。'
        },
        {
          id: 102,
          title: '耐克运动鞋 Air Max 270',
          price: 599,
          image: 'https://via.placeholder.com/200x200?text=Nike',
          status: '在售',
          category: 'clothing',
          location: '北京',
          description: '全新，买大了没穿过，尺码42.5。'
        }
      ]
    },
    editProduct(product) {
      // 编辑商品，将商品信息填充到表单
      this.activeTab = 'publishProduct'
      this.productForm = { ...product }
      this.$message.info('请在发布商品标签页修改商品信息')
    },
    deleteProduct(productId) {
      // 删除商品
      this.$confirm('确定要删除这个商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟删除操作
        this.myProducts = this.myProducts.filter(item => item.id !== productId)
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    handleImageChange(file) {
      // 处理商品图片上传
      const isImage = file.raw.type.indexOf('image/') !== -1
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isImage) {
        this.$message.error('上传头像图片只能是图片格式!')
        return
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return
      }
      
      // 模拟上传成功，实际开发中应该上传到服务器
      this.productForm.image = URL.createObjectURL(file.raw)
    },
    submitProduct() {
      this.$refs.productForm.validate((valid) => {
        if (valid) {
          // 模拟提交商品信息
          const newProduct = {
            ...this.productForm,
            id: Date.now(), // 模拟ID生成
            status: '在售'
          }
          
          // 如果是编辑模式，则更新商品
          const existingIndex = this.myProducts.findIndex(p => p.id === newProduct.id)
          if (existingIndex !== -1) {
            this.myProducts.splice(existingIndex, 1, newProduct)
            this.$message.success('商品更新成功')
          } else {
            // 否则添加新商品
            this.myProducts.unshift(newProduct)
            this.$message.success('商品发布成功')
          }
          
          // 重置表单并切换到我的商品标签
          this.resetProductForm()
          this.activeTab = 'myProducts'
        } else {
          this.$message.error('请完善商品信息')
          return false
        }
      })
    },
    resetProductForm() {
      this.$refs.productForm.resetFields()
      this.productForm.image = ''
    },
    updateUserInfo() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          // 更新用户信息
          this.userInfo.username = this.editForm.username
          this.userInfo.email = this.editForm.email
          
          // 保存到本地存储
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
          
          this.$message.success('个人资料更新成功')
          this.showEditDialog = false
        } else {
          return false
        }
      })
    },
    handleAvatarChange(file) {
      // 处理头像上传
      const isImage = file.raw.type.indexOf('image/') !== -1
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isImage) {
        this.$message.error('上传头像图片只能是图片格式!')
        return
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return
      }
      
      // 预览头像
      this.avatarPreview = URL.createObjectURL(file.raw)
    },
    updateAvatar() {
      if (this.avatarPreview) {
        // 更新头像
        this.userInfo.avatar = this.avatarPreview
        
        // 保存到本地存储
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
        
        this.$message.success('头像更新成功')
        this.showAvatarUpload = false
      } else {
        this.$message.error('请先上传头像')
      }
    }
  }
}
</script>

<style scoped>
.profile-container {
  padding: 15px;
  padding-bottom: 60px; /* 为底部导航留出空间 */
}

.user-card {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
}

.change-avatar-btn {
  margin-top: 5px;
}

.user-details {
  flex: 1;
}

.user-details h2 {
  margin: 0 0 5px 0;
}

.user-details p {
  margin: 0;
  color: #909399;
}

.main-tabs {
  margin-bottom: 60px;
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

.product-status {
  font-size: 14px;
  color: #67c23a;
  margin: 5px 0;
}

.product-actions {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #ebeef5;
  padding-top: 10px;
}

.empty-data {
  margin: 40px 0;
}

.avatar-uploader {
  text-align: center;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 6px;
  display: block;
  margin: 0 auto;
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