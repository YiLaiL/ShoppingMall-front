<template>
  <div class="profile-container">
    <!-- 用户信息卡片 -->
    <el-card class="user-card">
      <div class="user-info">
        <div class="avatar-container">
          <el-avatar :size="80" :src="userInfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"></el-avatar>
        </div>
        <div class="user-details">
          <h2>{{ userInfo.username }}</h2>
          <p>{{ userInfo.email }}</p>
        </div>
        <el-button type="primary" size="small" @click="handleEditProfile">编辑资料</el-button>
        <el-button type="warning" size="small" @click="openEmailDialog" style="margin-left: 10px;">修改邮箱</el-button>
        <el-button type="info" size="small" @click="openPasswordDialog" style="margin-left: 10px;">修改密码</el-button>
        <el-button type="danger" size="small" @click="handleLogout" style="margin-left: 10px;">退出登录</el-button>
      </div>
    </el-card>
    
    <!-- 我的商品和发布商品 -->
    <el-tabs v-model="activeTab" class="main-tabs">
      <el-tab-pane label="我的商品" name="myProducts">
        <GoodsSearch />
      </el-tab-pane>
      
      <el-tab-pane label="发布商品" name="publishProduct">
        <el-form :model="productForm" :rules="productRules" ref="productForm" label-width="80px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="productForm.title" placeholder="请输入商品标题"></el-input>
          </el-form-item>
          
          <el-form-item label="价格" prop="price">
            <el-input-number v-model="productForm.price" :min="0" :precision="2" :step="10"></el-input-number>
          </el-form-item>
          
          <el-form-item label="库存" prop="stock">
            <el-input-number v-model="productForm.stock" :min="1" :step="1"></el-input-number>
          </el-form-item>
          
          <el-form-item label="分类" prop="category">
            <CategoryCascader v-model="productForm.category" />
          </el-form-item>
          
          <el-form-item label="标签" prop="tagId">
            <el-select v-model="productForm.tagId" placeholder="请选择商品标签">
              <el-option 
                v-for="tag in tags" 
                :key="String(tag.id)" 
                :label="tag.tagName" 
                :value="String(tag.id)">
              </el-option>
            </el-select>
          </el-form-item>
          
          
          <el-form-item label="图片" prop="image">
            <SingleUpload v-model="productForm.image" />
          </el-form-item>
          
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="productForm.description" :rows="4" placeholder="请输入商品描述"></el-input>
          </el-form-item>
          <el-form-item label="细节补充" prop="detail">
            <el-input type="textarea" v-model="productForm.detail" :rows="4" placeholder="请输入商品细节补充信息"></el-input>
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
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="editForm.gender" placeholder="请选择性别">
            <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="editForm.description" :rows="2"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <SingleUpload v-model="editForm.avatar" />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="updateUserInfo">确定</el-button>
      </span>
    </el-dialog>
    
    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" :visible.sync="showPasswordDialog" width="400px">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-width="80px">
        <el-form-item label="新密码" prop="reset">
          <el-input v-model="passwordForm.reset" type="password" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="passwordForm.code" placeholder="请输入验证码" style="width: 60%"></el-input>
          <el-button 
            type="primary" 
            size="small" 
            @click="sendPasswordCode" 
            :disabled="passwordCodeBtnDisabled"
            style="margin-left: 10px;">
            {{ passwordCodeBtnText }}
          </el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="submitPasswordUpdate">确定</el-button>
      </span>
    </el-dialog>
    
    <!-- 修改邮箱对话框 -->
    <el-dialog title="修改邮箱" :visible.sync="showEmailDialog" width="400px">
      <el-form :model="emailForm" :rules="emailRules" ref="emailForm" label-width="80px">
        <el-form-item label="新邮箱" prop="reset">
          <el-input v-model="emailForm.reset" placeholder="请输入新邮箱"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="emailForm.code" placeholder="请输入验证码" style="width: 60%"></el-input>
          <el-button 
            type="primary" 
            size="small" 
            @click="sendVerificationCode" 
            :disabled="emailCodeBtnDisabled"
            style="margin-left: 10px;">
            {{ emailCodeBtnText }}
          </el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEmailDialog = false">取消</el-button>
        <el-button type="primary" @click="submitEmailUpdate">确定</el-button>
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
import SingleUpload from '../components/SingleUpload.vue'
import CategoryCascader from '../components/CategoryCascader.vue'
import GoodsSearch from './GoodsSearch.vue'

export default {
  name: 'Profile',
  components: {
    SingleUpload,
    CategoryCascader,
    GoodsSearch
  },
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
      categories: [],
      tags: [],

      userInfo: {
        id: '',
        username: '',
        email: '',
        avatar: ''
      },
      activeTab: 'myProducts',
      myProducts: [],
      showEditDialog: false,

      avatarPreview: '',
      editForm: {
        username: '',
        phone: '',
        avatar: '',
        description: '',
        gender: '',
        email: ''
      },
      editRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        description: [
          { max: 200, message: '描述不能超过200个字符', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
      },
      emailForm: {
        reset: '',
        code: ''
      },
      emailCodeBtnText: '发送验证码',
      emailCodeBtnDisabled: false,
      passwordForm: {
        reset: '',
        code: ''
      },
      passwordRules: {
        reset: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '验证码为6位', trigger: 'blur' }
        ]
      },
      showPasswordDialog: false,
      passwordCodeBtnText: '发送验证码',
      passwordCodeBtnDisabled: false,
      emailRules: {
        reset: [
          { required: true, message: '请输入新邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '验证码为6位', trigger: 'blur' }
        ]
      },
      
      showEmailDialog: false,

      productForm: {
        title: '',
        price: 0,
        stock: 1,
        category: [],
        tagId: '',
        location: '',
        address: [],
        image: '',
        description: '',
        detail: ''
      },
      productRules: {
        title: [
          { required: true, message: '请输入商品标题', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '请输入库存数量', trigger: 'blur' },
          { type: 'number', min: 1, message: '库存不能少于1', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ],
        tagId: [
          { required: true, message: '请选择商品标签', trigger: 'change' }
        ],
        location: [
          { required: true, message: '请输入商品所在地', trigger: 'blur' }
        ],
        image: [
          { required: true, message: '请上传商品图片', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入商品描述', trigger: 'blur' }
        ],
        detail: [
          { max: 1000, message: '细节补充不能超过1000个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 获取用户详情
    this.getUserDetail();
    // 加载用户发布的商品
    this.loadMyProducts();
    // 获取商品分类
    this.loadCategories();
  },
  methods: {
    // 处理文件选择
    async handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // 验证文件类型和大小
      const isImage = file.type.includes('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;
      
      if (!isImage) {
        this.$message.error('请上传图片格式文件');
        return;
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过2MB');
        return;
      }
      
      try {
        // 获取上传签名
        const { data: signature } = await this.$http.get('/upload/picture/front');
        
        // 预览图片
        const reader = new FileReader();
        reader.onload = (e) => {
          this.editForm.avatar = e.target.result;
          
          // 实际开发中这里应该调用上传API并携带签名
          // this.uploadAvatar(file, signature);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        this.$message.error('获取上传签名失败');
        console.error(error);
      }
    },
    
    // 处理编辑资料
    handleEditProfile() {
      this.showEditDialog = true;
      this.editForm = {...this.userInfo};
      this.showEmailDialog = false;
    },
    openEmailDialog() {
      this.showEmailDialog = true;
      this.emailForm.reset = this.userInfo.email;
      this.emailForm.code = '';
      this.emailCodeBtnText = '发送验证码';
      this.emailCodeBtnDisabled = false;
      if (this.$refs.emailForm) this.$refs.emailForm.resetFields();
    },
    
    sendVerificationCode() {
      if (!this.emailForm.reset) {
        this.$message.error('请输入邮箱地址');
        return;
      }
      
      this.emailCodeBtnDisabled = true;
      this.emailCodeBtnText = '发送中...';
      
      this.$http.get('/email/update', {
        params: {
          email: this.emailForm.reset
        }
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('验证码已发送');
          this.emailCodeBtnText = '已发送(60s)';
          
          // 60秒倒计时
          let countdown = 60;
          const timer = setInterval(() => {
            countdown--;
            this.emailCodeBtnText = `已发送(${countdown}s)`;
            
            if (countdown <= 0) {
              clearInterval(timer);
              this.emailCodeBtnDisabled = false;
              this.emailCodeBtnText = '重新发送';
            }
          }, 1000);
        } else {
          this.$message.error(res.msg || '发送失败');
          this.emailCodeBtnDisabled = false;
          this.emailCodeBtnText = '发送验证码';
        }
      }).catch(() => {
        this.$message.error('发送失败');
        this.emailCodeBtnDisabled = false;
        this.emailCodeBtnText = '发送验证码';
      });
    },
    
    submitEmailUpdate() {
      this.$refs.emailForm.validate(valid => {
        if (!valid) return;
        this.$http.patch('/user/update/email', {
          reset: this.emailForm.reset,
          code: this.emailForm.code
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('邮箱修改成功');
            this.userInfo.email = this.emailForm.reset;
            this.showEmailDialog = false;
          } else {
            this.$message.error(res.msg || '修改失败');
          }
        }).catch(() => {
          this.$message.error('修改失败');
        });
      });
    },
    
    openPasswordDialog() {
      this.showPasswordDialog = true;
      this.passwordForm.reset = '';
      this.passwordForm.code = '';
      this.passwordCodeBtnText = '发送验证码';
      this.passwordCodeBtnDisabled = false;
      if (this.$refs.passwordForm) this.$refs.passwordForm.resetFields();
    },
    
    sendPasswordCode() {
      if (!this.userInfo.email) {
        this.$message.error('请先登录并获取邮箱信息');
        return;
      }
      
      this.passwordCodeBtnDisabled = true;
      this.passwordCodeBtnText = '发送中...';
      
      this.$http.get('/email/reset', {
        params: {
          email: this.userInfo.email
        }
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('验证码已发送');
          this.passwordCodeBtnText = '已发送(60s)';
          
          // 60秒倒计时
          let countdown = 60;
          const timer = setInterval(() => {
            countdown--;
            this.passwordCodeBtnText = `已发送(${countdown}s)`;
            
            if (countdown <= 0) {
              clearInterval(timer);
              this.passwordCodeBtnDisabled = false;
              this.passwordCodeBtnText = '重新发送';
            }
          }, 1000);
        } else {
          this.$message.error(res.msg || '发送失败');
          this.passwordCodeBtnDisabled = false;
          this.passwordCodeBtnText = '发送验证码';
        }
      }).catch(() => {
        this.$message.error('发送失败');
        this.passwordCodeBtnDisabled = false;
        this.passwordCodeBtnText = '发送验证码';
      });
    },
    
    submitPasswordUpdate() {
      this.$refs.passwordForm.validate(valid => {
        if (!valid) return;
        this.$http.patch('/user/update/password', {
          reset: this.passwordForm.reset,
          code: this.passwordForm.code
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('密码修改成功');
            this.showPasswordDialog = false;
          } else {
            this.$message.error(res.msg || '修改失败');
          }
        }).catch(() => {
          this.$message.error('修改失败');
        });
      });
    },
    

    // 获取用户详情
    getUserDetail() {
      this.$http.get('/user/detail')
        .then(res => {
          if (res.code === 200) {
            this.userInfo = res.data;
          }
        })
        .catch(err => {
          console.error('获取用户详情失败:', err);
        });
    },
    handleLogout() {
      const token = localStorage.getItem('authToken');
      this.$http.delete('/user/logout', {
        headers: {
        //  'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (res.code === 200) {
            localStorage.removeItem('authToken');
            this.$message.success('已退出登录');
            this.$router.push('/login');
          }
        })
        .catch(err => {
          console.error('退出登录失败:', err);
          this.$message.error('退出登录失败');
        });
    },
    loadMyProducts() {
      // 获取用户发布的商品
      this.myProducts = []
    },
    
    loadCategories() {
      this.$http.get('/category/list', {
        params: {
          type: 0
        }
      })
        .then(res => {
          if (res.code === 200) {
            this.categories = res.data;
            this.loadTags();
          }
        })
        .catch(err => {
          console.error('获取分类失败:', err);
        });
    },
    
    loadTags() {
      this.$http.get('/tag/list', {
        params: {
          type: 0
        }
      })
        .then(res => {
          if (res.code === 200) {
            this.tags = res.data;
            this.loadAddressOptions();
          }
        })
        .catch(err => {
          console.error('获取标签失败:', err);
        });
    },
    
    loadAddressOptions() {
      this.$http.get('/address/tree')
        .then(res => {
          if (res.code === 200) {
            this.addressOptions = res.data;
          }
        })
        .catch(err => {
          console.error('获取地址数据失败:', err);
        });
    },
    
    handleAddressChange(value) {
      this.productForm.location = value.join(' ');
    },
    editProduct(product) {
      // 编辑商品，将商品信息填充到表单
      this.activeTab = 'publishProduct'
      this.productForm = { ...product }
      this.$message.info('请在发布商品标签页修改商品信息')
    },
    // deleteProduct(productId) {
    //   // 删除商品
    //   this.$confirm('确定要删除这个商品吗?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     // 模拟删除操作
    //     this.myProducts = this.myProducts.filter(item => String(item.id) !== String(productId))
    //     this.$message.success('删除成功')
    //   }).catch(() => {
    //     this.$message.info('已取消删除')
    //   })
    // },
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
      this.$refs.productForm.validate(valid => {
        if (valid) {
          const params = {
            goodName: this.productForm.title,
            coverUrl: this.productForm.image,
            price: this.productForm.price,
            stockNum: this.productForm.stock,
            status: "0",
            type: "0",
            categoryId: String(this.productForm.category[this.productForm.category.length - 1]),
            tagId: String(this.productForm.tagId),
            description: this.productForm.description,
            detail: this.productForm.detail
          };
          this.$http.post('/good/save', params)
            .then(res => {
              if (res.code === 200) {
                this.$message.success('商品发布成功')
                this.resetProductForm()
                this.activeTab = 'myProducts'
                this.loadMyProducts() // 重新加载商品列表
              } else {
                this.$message.error(res.msg || '发布失败')
              }
            })
            .catch(() => {
              this.$message.error('发布失败')
            })
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
      this.$refs.editForm.validate(valid => {
        if (!valid) return;
        const requestData = {
          id: String(this.userInfo.id),
          studentId: this.userInfo.studentId ? String(this.userInfo.studentId) : '',
          username: this.editForm.username,
          phone: this.editForm.phone,
          avatar: this.editForm.avatar,
          description: this.editForm.description,
          gender: this.editForm.gender === 'male' ? 0 : 1
        };
        this.$http.put('/user/update', requestData)
          .then(res => {
            if (res.code === 200) {
              this.$message.success('修改成功');
              this.userInfo = {...this.editForm};
              this.showEditDialog = false;
            } else {
              this.$message.error(res.msg || '修改失败');
            }
          })
          .catch(() => {
            this.$message.error('修改失败');
          });
      });
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
      
      // 上传图片到服务器
      const formData = new FormData()
      formData.append('file', file.raw)
      
      this.$http.post('/upload/picture', formData)
        .then(res => {
          if (res.code === 200) {
            this.editForm.avatar = res.data
          }
        })
        .catch(err => {
          console.error('上传头像失败:', err)
          this.$message.error('上传头像失败')
        })
    },
    

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

.custom-upload {
  display: inline-block;
}

.upload-area {
  width: 80px;
  height: 80px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.upload-area:hover {
  border-color: #409EFF;
}

.upload-placeholder {
  text-align: center;
  color: #8c939d;
  font-size: 12px;
}

.avatar {
  width: 80px;
  height: 80px;
  display: block;
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