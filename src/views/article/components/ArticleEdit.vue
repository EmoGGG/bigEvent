<script lang="ts" setup>
import { ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import ChannelSelect from "./ChannelSelect.vue";
import { Plus } from "@element-plus/icons-vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { artGetDetailService } from "@/api/article";
import axios from "axios";
import { artEditService, artPublishService } from "@/api/article";
import { ElMessage } from "element-plus";
interface FormType {
  title: string; // 标题
  cate_id: string; // 分类id
  cover_img: File | null; // 封面图片 file 对象
  content: string; // string 内容
  state: string; // 状态
}
const defaultForm = {
  title: "", // 标题
  cate_id: "", // 分类id
  cover_img: null, // 封面图片 file 对象
  content: "", // string 内容
  state: "", // 状态
};
let isEdit = ref(false);
let dialogV = ref(false);
let formModel = ref<FormType>({ ...defaultForm });
let formRef = ref<FormInstance>();
const editorRef = ref<InstanceType<typeof QuillEditor>>();
const imgUrl = ref("");
const onSelectFile = (uploadFile: any) => {
  // 这里的 uploadFile 是一个对象，包含了文件的相关信息，可以打印其中的uploadFile.raw看看
  imgUrl.value = URL.createObjectURL(uploadFile.raw); // 利用URL的这个api方法生成本地图片预览地址，预览图片
  // 立刻将图片对象，存入 formModel.value.cover_img 将来用于提交
  formModel.value.cover_img = uploadFile.raw;
};

const onPublish = async (state: string) => {
  formModel.value.state = state;
  // 注意：当前接口，需要的是 formData 对象
  // FormData用来上传二进制文件，需要保护数据，不允许在控制台打印出内容。FormData对象是用来上传文件的，文件都是二进制数据
  // 将普通对象 => 转换成 => formData对象
  // for...in循环：遍历 `formModel.value` 对象的所有可枚举属性。`key` 是当前遍历到的属性名。
  // append方法将一个键值对添加到 `FormData` 对象中。key是属性名，`formModel.value[key]` 是对应的属性值。
  // 除了通过.，还可以通过对象['属性名']来访问对象的属性值
  const fd = new FormData();
  Object.entries(formModel.value).forEach((value) => {
    if (value[1]) fd.append(value[0], value[1]);
  });

  // 发请求
  if (isEdit.value) {
    // 编辑操作
    const res = await artEditService(fd);

    if (res.data.code !== 0) {
      return ElMessage.error(res.data.message);
    }
    ElMessage.success("修改成功");
    dialogV.value = false;
    empty();
    emit("success", "edit"); // 第一个参数是自定义事件的名称，触发success事件。第二个参数是传递给父组件的参数，区分edit和add
  } else {
    // 添加操作
    console.log(1);
    const res = await artPublishService(fd);
    if (res.data.code !== 0) {
      return ElMessage.error(res.data.message);
    }
    ElMessage.success("添加成功");
    dialogV.value = false;
    // 通知到父组件，添加成功了
    emit("success", "add");
    empty();
  }
};

const handleClose = () => {
  dialogV.value = false;
  empty();
};
const empty = () => {
  formModel.value = { ...defaultForm };
  imgUrl.value = "";
  editorRef.value?.setHTML("");
};

const emit = defineEmits(["success"]);

const open = async (form: any | undefined) => {
  if (form) {
    isEdit.value = true;
    // 需要基于 row.id 发送请求，获取编辑对应的详情数据，进行回显
    const res = await artGetDetailService(form.id);
    formModel.value = res.data.data;
    // 图片需要单独处理回显
    imgUrl.value =
      "http://big-event-vue-api-t.itheima.net" + formModel.value.cover_img;
    // 注意：提交给后台，需要的数据格式，是file对象格式
    // 需要将网络图片地址 => 转换成 file对象，存储起来, 将来便于提交
    const file = await imageUrlToFileObject(
      imgUrl.value,
      formModel.value.cover_img,
    );
    formModel.value.cover_img = file;
  } else {
    isEdit.value = false;
  }
  dialogV.value = !dialogV.value;
};
defineExpose({
  open,
});

// 将网络图片地址转换为 File 对象的函数
async function imageUrlToFileObject(imageUrl: any, filename: any) {
  try {
    // 使用 Axios 下载图片数据
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    // 将下载的数据转换成 Blob 对象
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    // 创建 File 对象
    const file = new File([blob], filename, {
      type: response.headers["content-type"],
    });

    return file;
  } catch (error) {
    console.error("Error converting image URL to File object:", error);
    return null;
  }
}
</script>
<template>
  <el-drawer
    v-model="dialogV"
    :title="isEdit ? '编辑文章' : '添加文章'"
    :before-close="handleClose"
  >
    <el-form :model="formModel" ref="formRef">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title"> </el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <ChannelSelect
          v-model="formModel.cate_id"
          style="width: 100%"
        ></ChannelSelect>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 此处需要关闭 element-plus 的自动上传，不需要配置 action 等参数
             只需要做前端的本地预览图片即可，无需在提交前上传图片
             语法：URL.createObjectURL(...) 创建本地预览的地址，来预览
             :auto-upload="false" 关闭自动上传
        -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-form-item label="文章内容" prop="content">
      <div class="editor">
        <quill-editor
          ref="editorRef"
          v-model:content="formModel.content"
          content-type="html"
          theme="snow"
        ></quill-editor>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
      <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
    </el-form-item>
  </el-drawer>
</template>

<style lang="less" scoped>
.avatar-uploader {
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  ::v-deep {
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  ::v-deep {
    .ql-editor {
      min-height: 200px;
    }
  }
}
</style>
