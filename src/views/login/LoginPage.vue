<script lang="ts" setup>
import { onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue";
import { userLoginService } from "@/api/user";
import { useUserStore } from "@/stores/main";
interface RuleF {
  username: string;
  password: string;
  repassword: string;
}
const router = useRouter();
const userStore = useUserStore();
const isLogin = ref(false);
const isRegister = ref(false);
const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<RuleF>({ username: "", password: "", repassword: "" });
const blankForm = { username: "", password: "", repassword: "" };
const rules = reactive<FormRules<RuleF>>({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" }, // required: true表示非空，message表示提示信息，trigger表示触发方式，blur即失去焦点
    { min: 3, max: 10, message: "长度在3到10个字符之间", trigger: "blur" }, // 长度校验
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      pattern: /^\S{6,15}$/,
      message: "密码必须是6~15位非空字符",
      trigger: "blur",
    }, // 正则校验
  ],
  repassword: [
    {
      pattern: /^\S{6,15}$/,
      message: "密码必须是6~15位非空字符",
      trigger: "blur",
    },
    // 自定义校验，validator后跟函数为自定义校验的逻辑
    // rule为当前校验的规则，value为当前校验的值，callback为校验结果的回调函数，callback(new Error('提示信息'))表示校验失败，callback()表示校验成功
    // 无论成功还是失败都要调用callback函数
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value !== ruleForm.value.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
});

const login = async () => {
  console.log("login");
  if (!ruleFormRef.value || isLogin.value) return;
  await ruleFormRef.value.validate();
  // 登录请求
  try {
    isLogin.value = true;
    const res = await userLoginService(ruleForm.value);
    if (res.data.code === 1) {
      ElMessage.error("登录失败");
      isLogin.value = false;
    } else {
      userStore.setToken(res.data.token);
      ElMessage.success("登录成功"); // 登录请求成功后，代码就会继续往下走
      router.push("/");
      isLogin.value = false;
    }
  } catch (err) {
    console.log(err);
  }
};
const register = () => {
  back();
};
const back = () => {
  isRegister.value = !isRegister.value;
  ruleForm.value = { ...blankForm };
};
</script>
<template>
  <div class="outContainer">
    <div class="left"></div>
    <div class="right">
      <el-form
        ref="ruleFormRef"
        style="width: 400px"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        size="large"
        v-if="!isRegister"
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item label="用户名" prop="username" placeholder="请输入用户名">
          <el-input
            v-model="ruleForm.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            :prefix-icon="Lock"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册-->
          </el-link>
        </el-form-item>
      </el-form>
      <el-form
        ref="formModel"
        style="width: 400px"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        size="large"
        v-else
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item>
          <el-button class="button" @click="register" type="primary">
            注册
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-link @click="back"> <--返回 </el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.outContainer {
  height: 100%;
  display: flex;
  flex-direction: row;
  .left {
    flex: 1;
    height: 100%;
    background:
      url("@/assets/logo2.png") no-repeat 60% center / 240px auto,
      url("@/assets/login_bg.jpg") no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .right {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .flex {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .button {
      width: 100%;
    }
  }
}
</style>
