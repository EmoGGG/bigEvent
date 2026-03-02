<script lang="ts" setup>
import { ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { artAddChannelService, artEditChannelService } from "@/api/article";
import { ElMessage } from "element-plus";
interface ChannelType {
  id: number;
  cate_name: string;
  cate_alias: string;
}
const dialogVisible = ref(false);
const title = ref("");
let isEdit = false;
const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<ChannelType>({
  id: -1,
  cate_name: "",
  cate_alias: "",
});
const blankForm = {
  id: -1,
  cate_name: "",
  cate_alias: "",
};
const rules = ref<FormRules<ChannelType>>({
  cate_name: [
    { required: true, message: "请输入分类名称", trigger: "blur" },
    {
      pattern: /^\S{1,10}$/,
      message: "分类名必须是 1-10 位的非空字符",
      trigger: "blur",
    },
  ],
  cate_alias: [
    { required: true, message: "请输入分类别名", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: "分类名必须是 1-15 位的字母或数字",
      trigger: "blur",
    },
  ],
});
const open = (cate: ChannelType | undefined) => {
  dialogVisible.value = !dialogVisible.value;
  if (cate) {
    isEdit = true;
    ruleForm.value = { ...cate };
  } else {
    isEdit = false;
    ruleForm.value = { ...blankForm };
  }
};
const onSubmit = async () => {
  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate();
  if (isEdit) {
    await artEditChannelService(ruleForm.value);
    ElMessage.success("edit成功");
    dialogVisible.value = false;
    emit("update");
  } else {
    const res = await artAddChannelService(ruleForm.value);
    if (res.data.code === 0) {
      ElMessage.success("add成功");
      dialogVisible.value = false;
      emit("update");
    } else {
      ElMessage.error(res.data.message);
    }
  }
};
defineExpose({
  open,
});
const emit = defineEmits(["update"]);
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑' : '添加'"
    width="500"
  >
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="类名" prop="cate_name">
        <el-input v-model="ruleForm.cate_name"></el-input>
      </el-form-item>
      <el-form-item label="类别名" prop="cate_alias">
        <el-input v-model="ruleForm.cate_alias"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit()"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped></style>
