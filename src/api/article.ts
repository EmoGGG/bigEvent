import { createRequest } from "@/utils/request";
import { articalUrl } from "@/constant/constant";
const request = createRequest(articalUrl);
// 分类：获取文章分类
export const artGetChannelsService = () => request.get("/my/cate/list");
// 分类：添加文章分类
export const artAddChannelService = (data: any) =>
  request.post("/my/cate/add", data);
// 分类：编辑文章分类
export const artEditChannelService = (data: any) =>
  request.put("/my/cate/info", data);
// 分类：删除文章分类
export const artDelChannelService = (id: any) =>
  request.delete("/my/cate/del", {
    params: { id },
  });

// 文章：获取文章列表
export const artGetListService = (params: any) =>
  request.get("/my/article/list", {
    params,
  });

// 文章：添加文章
// 注意：data需要是一个FormData格式的对象
// FormData用来上传二进制文件，需要保护数据，不允许在控制台打印出内容。FormData对象是用来上传文件的，文件都是二进制数据
export const artPublishService = (data: any) =>
  request.post("/my/article/add", data);

// 文章：获取文章详情
export const artGetDetailService = (id: any) =>
  request.get("/my/article/info", {
    params: { id },
  });

// 文章：编辑文章接口
export const artEditService = (data: any) =>
  request.put("/my/article/info", data);

// 文章：删除文章接口
export const artDelService = (id: any) =>
  request.delete("/my/article/info", { params: { id } });
