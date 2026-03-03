<script lang="ts" setup>
import { ref, computed } from "vue";
import PageContainer from "@/components/PageContainer.vue";
import ChannelSelect from "./components/ChannelSelect.vue";
import { artGetListService } from "@/api/article";
import ArticleEdit from "./components/ArticleEdit.vue";
interface articleType {
  pagenum: number; // 当前页码
  pagesize: number; // 每页条数
  cate_id: string; // 文章分类
  state: string; // 发布状态
}
interface ArtType {
  cate_name: string;
  id: number;
  pub_date: string;
  state: string;
  title: string;
}
const blankPage = {
  pagenum: 1,
  pagesize: 5,
  cate_id: "",
  state: "",
};
const editRef = ref<InstanceType<typeof ArticleEdit>>();
const artList = ref<ArtType[]>([]);
const stateList = ["已发布", "草稿"];
const articlePage = ref<articleType>({ ...blankPage });
const total = ref(0);
const onSearch = () => {
  getArticleList();
};
const onReset = () => {
  articlePage.value = { ...blankPage };
};
const getArticleList = async () => {
  const res = await artGetListService(articlePage.value);
  console.log(res.data);
  artList.value = [...res.data.data];
  total.value = res.data.total;
};
getArticleList();
</script>
<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button type="primary" @click="editRef?.open(undefined)"
        >添加文章</el-button
      >
    </template>
    <el-form inline>
      <el-form-item label="文章分类">
        <ChannelSelect v-model="articlePage.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="文章状态">
        <el-select
          v-model="articlePage.state"
          placeholder="可选择"
          style="width: 120px"
        >
          <el-option
            v-for="value in stateList"
            :key="value"
            :value="value"
            :label="value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="artList" style="width: 100%">
      <el-table-column label="文章标题">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="文章状态">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.state }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="文章分类">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-link
              ><span>{{ scope.row.cate_name }}</span></el-link
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Date" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{
              new Date(scope.row.pub_date).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="文章操作" width="180">
        <template #default="scope">
          <el-button type="primary" @click="editRef?.open(scope.row)">
            edit
          </el-button>
          <el-button type="warning"> del</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="float: right"
      v-model:current-page="articlePage.pagenum"
      v-model:page-size="articlePage.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper,total, sizes, prev, pager, next"
      :total="total"
      @change="onSearch"
    />
  </PageContainer>
  <ArticleEdit ref="editRef" @success="getArticleList()"></ArticleEdit>
</template>

<style lang="less" scoped></style>
