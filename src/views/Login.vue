<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo">
        <img src="../assets/logo.png" alt="Logo">
        <h2>咸鱼二手交易平台</h2>
      </div>
      
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="密码登录" name="password">
          <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm">
            <el-form-item prop="email">
              <el-input v-model="passwordForm.email" prefix-icon="el-icon-message" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="passwordForm.password" prefix-icon="el-icon-lock" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="login-btn" @click="handlePasswordLogin">登录</el-button>
              <el-button type="text" @click="showResetDialog = true" style="margin-left: 10px;">忘记密码</el-button>
              <el-button type="text" @click="showUpdateEmailDialog = true" style="margin-left: 10px;">修改邮箱</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="验证码登录" name="code">
          <el-form :model="codeForm" :rules="codeRules" ref="codeForm">
            <el-form-item prop="email">
              <el-input v-model="codeForm.email" prefix-icon="el-icon-message" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input v-model="codeForm.code" prefix-icon="el-icon-key" placeholder="请输入验证码">
                <el-button slot="append" @click="sendVerificationCode" :disabled="isSending">
                  {{ sendBtnText }}
                </el-button>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="login-btn" @click="handleCodeLogin">登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <el-dialog :visible.sync="showResetDialog" title="重置密码" width="30%">
        <el-form :model="resetForm" :rules="resetRules" ref="resetForm">
          <el-form-item prop="email">
            <el-input v-model="resetForm.email" placeholder="请输入注册邮箱"></el-input>
          </el-form-item>
          <el-form-item prop="newPassword">
            <el-input v-model="resetForm.newPassword" type="password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input v-model="resetForm.confirmPassword" type="password" placeholder="请确认新密码"></el-input>
          </el-form-item>
          <el-button type="primary" @click="handleResetPassword">提交</el-button>
        </el-form>
      </el-dialog>

      <el-dialog :visible.sync="showUpdateEmailDialog" title="修改邮箱" width="30%">
        <el-form :model="updateEmailForm" :rules="updateEmailRules" ref="updateEmailForm">
          <el-form-item prop="oldEmail">
            <el-input v-model="updateEmailForm.oldEmail" placeholder="请输入原邮箱"></el-input>
          </el-form-item>
          <el-form-item prop="newEmail">
            <el-input v-model="updateEmailForm.newEmail" placeholder="请输入新邮箱"></el-input>
          </el-form-item>
          <el-button type="primary" @click="handleUpdateEmail">提交</el-button>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
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
      activeTab: 'password',
      passwordForm: {
        email: '',
        password: ''
      },
      codeForm: {
        email: '',
        code: ''
      },
      resetForm: {
        email: '',
        newPassword: '',
        confirmPassword: ''
      },
      updateEmailForm: {
        oldEmail: '',
        newEmail: ''
      },
      passwordRules: {
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, message: '密码长度不能少于5位', trigger: 'blur' }
        ]
      },
      codeRules: {
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '验证码长度为6位', trigger: 'blur' }
        ]
      },
      resetRules: {
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 5, message: '密码长度不能少于5位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: (rule, value, callback) => {
              if (value !== this.resetForm.newPassword) {
                callback(new Error('两次输入密码不一致!'))
              } else {
                callback()
              }
            }, trigger: 'blur' }
        ]
      },
      updateEmailRules: {
        oldEmail: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        newEmail: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ]
      },
      isSending: false,
      countdown: 60,
      sendBtnText: '获取验证码',
      showResetDialog: false,
      showUpdateEmailDialog: false
    }
  },
  methods: {
    handleTabClick() {
      // 切换登录方式时重置表单
      if (this.activeTab === 'password') {
        this.$refs.passwordForm.resetFields()
      } else {
        this.$refs.codeForm.resetFields()
      }
    },
    handlePasswordLogin() {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          this.$http.post('/user/login', {
            email: this.passwordForm.email,
            password: this.passwordForm.password,
            code: ''
          }).then(response => {
            localStorage.setItem('token', response.data.token)
            this.$router.push(this.$route.query.redirect || '/home')
          }).catch(error => {
            this.$message.error(error.response.data.message || '登录失败')
          })
        }
      })
    },
    handleCodeLogin() {
      this.$refs.codeForm.validate(valid => {
        if (valid) {
          this.$http.post('/user/login', {
            email: this.codeForm.email,
            password: '',
            code: this.codeForm.code
          }).then(response => {
            localStorage.setItem('token', response.data.token)
            this.$router.push(this.$route.query.redirect || '/home')
          }).catch(error => {
            this.$message.error(error.response.data.message || '登录失败')
          })
        }
      })
    },
    sendVerificationCode() {
      this.$refs.codeForm.validateField('email', (errorMessage) => {
        if (!errorMessage) {
          this.isSending = true
          this.countdown = 60
          this.sendBtnText = `${this.countdown}秒后重新获取`
          
          // 倒计时
          const timer = setInterval(() => {
            this.countdown--
            this.sendBtnText = `${this.countdown}秒后重新获取`
            
            if (this.countdown <= 0) {
              clearInterval(timer)
              this.isSending = false
              this.sendBtnText = '获取验证码'
            }
          }, 1000)
          
          // 模拟发送验证码
          this.$message.success(`验证码已发送至邮箱: ${this.codeForm.email}`)
        }
      })
    },
    
    handleResetPassword() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          this.$http.get('/user/reset', {
            params: {
              email: this.resetForm.email,
              newPassword: this.resetForm.newPassword
            }
          }).then(response => {
            this.$message.success('密码重置成功')
            this.showResetDialog = false
          }).catch(error => {
            this.$message.error(error.response?.data?.message ?? '密码重置失败')
          })
        }
      })
    },
    
    handleUpdateEmail() {
      this.$refs.updateEmailForm.validate(valid => {
        if (valid) {
          this.$http.get('/user/update-email', {
            params: {
              oldEmail: this.updateEmailForm.oldEmail,
              newEmail: this.updateEmailForm.newEmail
            }
          }).then(response => {
            this.$message.success('邮箱更新成功')
            this.showUpdateEmailDialog = false
          }).catch(error => {
            this.$message.error(error.response?.data?.message ?? '邮箱更新失败')
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.login-box {
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

.login-btn {
  width: 100%;
  margin-top: 10px;
}

</style>
