import { createRequest } from "@/utils/request";
import { userUrl } from "@/constant/constant";
const request = createRequest(userUrl);

// 注册接口（命名规范：user文件下用user，注册业务用Register，post方法用Service）
export const userRegisterService = ({ username, password, repassword }: any) =>
  request.post("/api/reg", {
    username,
    password,
    repassword,
  });

// 登录接口
export const userLoginService = ({ username, password }: any) =>
  request.post("/api/login", { username, password });

// 获取用户基本信息
export const userGetInfoService = () => request.get("/my/userinfo");

// 更新用户基本信息
export const userUpdateInfoService = ({ id, nickname, email }: any) =>
  request.put("/my/userinfo", { id, nickname, email });

// 更新用户头像
export const userUpdateAvatarService = (avatar: any) =>
  request.patch("/my/update/avatar", { avatar });

// 更新用户密码
export const userUpdatePasswordService = ({ old_pwd, new_pwd, re_pwd }: any) =>
  request.patch("/my/updatepwd", { old_pwd, new_pwd, re_pwd });
