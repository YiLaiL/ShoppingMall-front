<template>
  <div class="admin-layout">
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="activeMenu"
          router
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="/admin/category">
            <i class="el-icon-menu"></i>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/tag">
            <i class="el-icon-collection-tag"></i>
            <span>标签管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/location">
            <i class="el-icon-location"></i>
            <span>地点管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/permission">
            <i class="el-icon-lock"></i>
            <span>权限管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'AdminLayout',
  computed: {
    activeMenu() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.admin-layout {
  height: 100%;
}
.el-container {
  height: 100%;
}
.el-aside {
  background-color: #545c64;
}
.el-menu {
  border-right: none;
}
</style>