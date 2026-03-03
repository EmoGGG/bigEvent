<script lang="ts" setup>
import { ref } from "vue";
import { artGetChannelsService } from "@/api/article";

interface channelType {
  id: string;
  cate_alias: string;
  cate_name: string;
}
const cateList = ref<channelType[]>([]);
const cateId = defineModel();
const getChannel = async () => {
  const res = await artGetChannelsService();
  console.log(res.data);
  cateList.value = [...res.data.data];
};
getChannel();
</script>
<template>
  <el-select v-model="cateId" style="width: 120px">
    <el-option
      v-for="value in cateList"
      :value="value.id"
      :key="value.id"
      :label="value.cate_name"
    ></el-option>
  </el-select>
</template>

<style lang="less" scoped></style>
