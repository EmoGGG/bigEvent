import { ref } from "vue";
import { defineStore } from "pinia";
import { userGetInfoService } from "@/api/user";

export const useUserStore = defineStore(
  "user",
  () => {
    const token = ref("");
    const setToken = (str: string) => {
      token.value = str;
    };
    const removeToken = () => {
      token.value = "";
    };

    const user = ref({});
    const getUser = async () => {
      const res = await userGetInfoService(); // 请求获取数据
      user.value = res.data.data;
    };
    const setUser = (obj: any) => {
      user.value = obj;
    };

    return { token, setToken, removeToken, user, getUser, setUser };
  },
  { persist: true },
);
