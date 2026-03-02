<script lang="ts" setup>
import { ref } from "vue";
import PageContainer from "@/components/PageContainer.vue";
import { Edit, Delete } from "@element-plus/icons-vue";
import ChannelEdit from "./components/ChannelEdit.vue";
import { artGetChannelsService, artDelChannelService } from "@/api/article";
import { ElMessage } from "element-plus";
interface ChannelType {
  id: number;
  cate_name: string;
  cate_alias: string;
}
const channelList = ref<ChannelType[]>([]);
const editRef = ref<InstanceType<typeof ChannelEdit>>();
const add = (cate: ChannelType | undefined) => {
  editRef.value?.open(cate);
};
const getChannelList = async () => {
  const res = await artGetChannelsService();
  channelList.value = [...res.data.data];
};
const updateC = async () => {
  getChannelList();
};
const delChannel = async (channel: ChannelType) => {
  const res = await artDelChannelService(channel.id);
  updateC();
  ElMessage.success("del成功");
};
getChannelList();
</script>
<template>
  <PageContainer :title="'文章分类'">
    <template #extra>
      <el-button @click="add(undefined)">添加分类</el-button></template
    >
    <el-table :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="cate_name" label="类名"> </el-table-column>
      <el-table-column prop="cate_alias" label="类别名"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            @click="add(scope.row)"
            type="primary"
            :icon="Edit"
            circle
          />
          <el-button
            @click="delChannel(scope.row)"
            type="danger"
            :icon="Delete"
            circle
          />
        </template>
      </el-table-column>
    </el-table>
    <ChannelEdit ref="editRef" @update="updateC()"></ChannelEdit>
  </PageContainer>
</template>

<style lang="less" scoped></style>
