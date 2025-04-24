<template>
  <div class="register-container">
    <div class="register-box">
      <div class="logo">
        <img src="../assets/logo.png" alt="Logo">
        <h2>咸鱼二手交易平台</h2>
      </div>
      
      <el-form :model="registerForm" :rules="registerRules" ref="registerForm">
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="registerForm.email" prefix-icon="el-icon-message" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="registerForm.password" prefix-icon="el-icon-lock" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="registerForm.code" prefix-icon="el-icon-key" placeholder="请输入验证码">
            <el-button slot="append" @click="sendVerificationCode" :disabled="isSending">
              {{ sendBtnText }}
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="register-btn" @click="handleRegister">注册</el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-link">
        已有账号？<el-link type="primary" @click="goToLogin">去登录</el-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
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
      registerForm: {
        username: '',
        email: '',
        password: '',
        code: ''
      },
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 16, message: '用户名长度在3到16个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '验证码长度为6位', trigger: 'blur' }
        ]
      },
      isSending: false,
      countdown: 60,
      sendBtnText: '获取验证码'
    }
  },
  methods: {
    handleRegister() {
  this.$refs.registerForm.validate(valid => {
    if (!valid) {
      this.$message.warning('请正确填写所有表单字段')
      return
    }

    this.loading = true // 添加加载状态
    
    this.$http.post('/user/register', {
      username: this.registerForm.username,
      password: this.registerForm.password,
      email: this.registerForm.email,
      code: this.registerForm.code
    })
    .then(response => {
      // 拦截器已过滤非200状态，这里只需处理成功逻辑
      this.$message.success('注册成功，即将跳转到登录页')
      
      // 清空表单数据
      this.registerForm = {
        username: '',
        password: '',
        email: '',
        code: ''
      }

      // 2秒后跳转登录页
      setTimeout(() => {
        this.$router.push('/login')
      }, 2000)
    })
    .catch(error => {
      // 移除本地错误提示，由全局拦截器处理
      // this.$message.error(error.response?.data?.msg || error.message || '注册失败，请稍后重试')
      this.loading = false
    })
    .finally(() => {
      this.loading = false // 关闭加载状态
    })
  })
},
    sendVerificationCode() {
      this.$refs.registerForm.validateField('email', (errorMessage) => {
        if (!errorMessage) {
          this.isSending = true
          this.countdown = 60
          this.sendBtnText = `${this.countdown}秒后重新获取`
          
          const timer = setInterval(() => {
            this.countdown--
            this.sendBtnText = `${this.countdown}秒后重新获取`
            
            if (this.countdown <= 0) {
              clearInterval(timer)
              this.isSending = false
              this.sendBtnText = '获取验证码'
            }
          }, 1000)
          
          this.$http.get(`/email/register?email=${this.registerForm.email}`).then(() => {
            this.$message.success(`验证码已发送至邮箱: ${this.registerForm.email}`)
          }).catch(error => {
            // 移除本地错误提示，由全局拦截器处理
            // this.$message.error(error.response?.data?.msg || error.message || '验证码发送失败')
            // 清除定时器并重置按钮状态
            clearInterval(timer)
            this.isSending = false
            this.sendBtnText = '获取验证码'
          })
        }
      })
    },
    goToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.register-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.register-box {
  width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}

.logo img {
  width: 80px;
  height: 80px;
}

.logo h2 {
  margin-top: 10px;
  font-size: 24px;
  color: #409EFF;
}

.register-btn {
  width: 100%;
  margin-top: 10px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #606266;
}
</style>
