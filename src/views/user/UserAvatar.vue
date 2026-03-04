<script lang="ts" setup>
import { ref } from "vue";
import PageContainer from "@/components/PageContainer.vue";
import { userUpdateAvatarService } from "@/api/user";
import { Plus } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/main";
const userStore = useUserStore();
const imageUrl = ref(userStore.user.user_pic);
const uploadRef = ref<any>();

const handleChange = (uploadFile: any) => {
  const reader = new FileReader();
  console.log(111, URL.createObjectURL(uploadFile.raw));
  reader.readAsDataURL(uploadFile.raw);
  reader.onload = () => {
    if (typeof reader.result == "string") imageUrl.value = reader.result;
    console.log(2222, imageUrl.value);
  };
};
const submit = async () => {
  const res = await userUpdateAvatarService(imageUrl.value);
  if (res.data.code == 0) {
    userStore.getUser();
  }
};
</script>
<template>
  <PageContainer title="更换头像">
    <template #default>
      <div class="container">
        <div class="load">
          <el-upload
            ref="uploadRef"
            class="avatar-uploader"
            :show-file-list="false"
            :on-change="handleChange"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </div>
        <div class="button">
          <el-button
            type="primary"
            @click="uploadRef.$el.querySelector('input').click()"
          >
            选择图片
          </el-button>
          <el-button @click="submit" type="primary">确认上传</el-button>
        </div>
      </div>
    </template>
  </PageContainer>
</template>

<style lang="less" scoped>
.container {
  float: left;
  width: 400px;
  height: 100%;
  .button {
    margin-top: 10px;
  }
  .avatar-uploader ::v-deep .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader ::v-deep .el-upload:hover {
    border-color: var(--el-color-primary);
  }
  .avatar-uploader-icon {
    width: 178px;
    height: 178px;
  }
  .avatar {
    width: 178px;
    height: 178px;
  }
}
</style>
