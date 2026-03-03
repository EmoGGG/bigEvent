<script lang="ts" setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/main";
import { useRouter } from "vue-router";
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import avatar from "@/assets/default.png";
const userStore = useUserStore();
const router = useRouter();
userStore.getUser().then(() => {
  console.log(userStore.user);
});

const handleCommand = (code: string) => {
  switch (code) {
    case "profile":
    case "avartar":
    case "password":
      router.push(`/user/${code}`);
      break;
    case "logout":
      logout();
      break;
  }
};
const logout = () => {
  ElMessageBox.confirm("确认退出?", "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      router.push("/login");
      userStore.setToken("");
      userStore.setUser({});
      ElMessage({
        type: "success",
        message: "退出成功",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消成功",
      });
    });
};
</script>
<template>
  <el-container class="outContainer">
    <el-aside width="200px">
      <div class="logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/article/channel">
          <el-icon><Management /></el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>文章管理</span>
        </el-menu-item>

        <!-- 多级菜单 -->
        <!-- 多级菜单的标题 - 具名插槽 title-->
        <el-sub-menu index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>

          <!-- 展开的内容 - 默认插槽-->
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avartar">
            <el-icon><Crop /></el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu></el-aside
    >
    <el-container style="background-color: gainsboro">
      <el-header>
        <div class="leftH">
          同学:
          <strong>{{
            userStore.user.nickname || userStore.user.username
          }}</strong>
        </div>
        <div class="rightH">
          <el-dropdown placement="bottom-end" @command="handleCommand">
            <!-- 这是展示给用户看的部分 -->
            <span class="el-dropdown_box">
              <el-avatar :src="userStore.user.user_pic || avatar" />
              <el-icon><CaretBottom /></el-icon>
            </span>

            <!-- 折叠的下拉部分 -->
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile" :icon="User"
                  >基本资料</el-dropdown-item
                >
                <el-dropdown-item command="avartar" :icon="Crop"
                  >更换头像</el-dropdown-item
                >
                <el-dropdown-item command="password" :icon="EditPen"
                  >重置密码</el-dropdown-item
                >
                <el-dropdown-item command="logout" :icon="SwitchButton"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <RouterView></RouterView>
      </el-main>
      <el-footer> 2026 googgo </el-footer>
    </el-container>
  </el-container>
</template>

<style lang="less" scoped>
.outContainer {
  height: 100%;
  .el-aside {
    background-color: black;
    .logo {
      height: 120px;
      background: url("@/assets/logo.png") no-repeat center / 120px auto;
    }
  }
  .el-header {
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .leftH {
      font-weight: bolder;
      font-size: 20px;
    }
    .rightH {
      .el-dropdown {
        .el-dropdown_box {
          display: flex;

          align-items: center;
          .el-icon {
            color: #999;
            margin-left: 10px;
          }

          &:active,
          &:focus {
            outline: none;
          }
        }
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
