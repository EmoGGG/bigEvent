import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCounterStore = defineStore(
  "couter",
  () => {
    //一般是数据  然后是get   set   computed
    const token = ref("");
    const setToken = (newToken: string) => {
      token.value = newToken;
    };
    const removeToken = () => {
      token.value = "";
    };

    const user = ref({});
    const getUser = async () => {
      // const res = await userGetInfoService(); // 请求获取数据
      // user.value = res.data.data;
    };
    const setUser = (obj: any) => {
      user.value = obj;
    };

    return {
      token,
      setToken,
      removeToken,
      user,
      getUser,
      setUser,
    };
  },
  { persist: true },
);
