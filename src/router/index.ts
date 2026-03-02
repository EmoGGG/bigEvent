import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/login", component: () => import("@/views/login/LoginPage.vue") },
    {
      path: "/",
      component: () => import("@/views/layout/LayoutContainer.vue"), //为什么首字母要小写？？
      redirect: "/article/manage",
      children: [
        {
          path: "/article/channel",
          component: () => import("@/views/article/ArticleChannel.vue"),
        },
        {
          path: "/article/manage",
          component: () => import("@/views/article/ArticleManage.vue"),
        },
        {
          path: "/user/profile",
          component: () => import("@/views/user/UserProfile.vue"),
        },
        {
          path: "/user/avartar",
          component: () => import("@/views/user/UserAvatar.vue"),
        },
        {
          path: "/user/password",
          component: () => import("@/views/user/UserPassword.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  // 如果访问的不是登录页，则判断是否有token
  // 如果没有token, 且访问的是非登录页，拦截到登录，其他情况正常放行
  // const useStore = useUserStore();
  // if (!useStore.token && to.path !== "/login") return "/login";
});

export default router;
