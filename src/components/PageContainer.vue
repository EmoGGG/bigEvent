<script lang="ts" setup>
import { ref } from "vue";
let props = defineProps<{
  title: string;
}>();
</script>
<template>
  <el-card style="width: 100%; height: 100%">
    <template #header>
      <div class="headerContainer">
        <div class="hLeft">{{ title }}</div>
        <div class="hRight">
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <slot></slot>
  </el-card>
</template>

<style lang="less" scoped>
.headerContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .hLeft {
    font-size: 30px;
    font-weight: bolder;
  }
}
</style>
