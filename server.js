import express, { response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join("backend", "images");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage });

app.use(express.json());

app.use("/files", express.static(path.join("backend")));

app.use((request, response, next) => {
  console.log("有人请求服务器了", request.get("Host"), request.url);
  next();
});
// 登录
app.post("/user/login", (request, response) => {
  const { username, password } = request.body;
  const whiteList = ["admin", "superAdmin"];
  const isManage = whiteList.includes(username);
  const data = {
    code: "200",
    msg: "登录成功",
    data: {
      userInfo: {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        nickname: "kk",
        avatar: "/files/bussiness/user_avatar/1757687320361.jpg",
        phone: "19999525252",
        gender: 1,
        genderDisplayName: "男",
        birthday: "2019-09-02",
        userType: 2,
        userTypeDisplayName: "管理员",
        status: 1,
        statusDisplayName: "正常",
        displayName: "kk",
        createdAt: "2025-08-30 12:00:01",
        updatedAt: "2026-07-10 10:47:02",
      },
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlVHlwZSI6MiwiZXhwIjoxNzg0NDY4MjAzLCJpYXQiOjE3ODQzODE4MDMsImlzcyI6Im1lbnRhbC1oZWFsdGgtYXNzaXN0YW50In0.nGe96gAEmu-m1hKTeCXeeJcphpYYj8rM4TlL9NOutEE",
      roleType: isManage ? "2" : "1",
      flag: true,
    },
    message: "登录成功",
    success: true,
  };
  response.send(data);
});
// 分类列表
app.get("/knowledge/category/tree", (request, response) => {
  const data = {
    code: "200",
    msg: "操作成功",
    flag: true,
    data: [
      {
        id: 4,
        categoryName: "人际关系",
        description: "人际交往和关系处理",
        sortOrder: 10,
        status: 1,
        statusText: "启用",
        articleCount: 87,
        createdAt: "2025-09-04 12:50:03",
        updatedAt: "2025-09-13 11:48:16",
      },
      {
        id: 3,
        categoryName: "压力缓解",
        description: "压力来源分析和缓解方法",
        sortOrder: 20,
        status: 1,
        statusText: "启用",
        articleCount: 38,
        createdAt: "2025-09-04 12:50:03",
        updatedAt: "2025-09-13 11:48:16",
      },
      {
        id: 1,
        categoryName: "心理健康基础",
        description: "心理健康基础知识和概念.",
        sortOrder: 30,
        status: 1,
        statusText: "启用",
        articleCount: 94,
        createdAt: "2025-09-04 12:50:03",
        updatedAt: "2025-09-13 11:48:16",
      },
      {
        id: 2,
        categoryName: "情绪管理",
        description: "情绪识别、调节和管理技巧",
        sortOrder: 40,
        status: 1,
        statusText: "启用",
        articleCount: 5,
        createdAt: "2025-09-04 12:50:03",
        updatedAt: "2025-09-13 11:48:16",
      },
    ],
    message: "操作成功",
    success: true,
  };
  response.send(data);
});
// 文章列表
app.get("/knowledge/article/page", (request, response) => {
  const data = {
    code: "200",
    msg: "操作成功",
    flag: true,
    data: {
      records: [
        {
          id: "f1212850b2ebad6b9e3fd8cccca3d441",
          categoryId: 4,
          categoryName: "人际关系",
          title: "马猴烧酒",
          summary: "啊实打实的",
          tags: "情绪管理",
          authorName: "kk",
          readCount: 0,
          status: 1,
          statusText: "已发布",
          isFavorited: false,
          favoriteCount: 0,
          publishedAt: "2026-07-18 00:09:54",
          createdAt: "2026-07-15 00:56:59",
          updatedAt: "2026-07-18 00:09:54",
        },
        {
          id: "60a0d0f0dda4abafd26d493e2cdbab19",
          categoryId: 1,
          categoryName: "心理健康基础",
          title: "测试标题111",
          summary: "这是一个测试标题",
          coverImage: "/files/bussiness/article/1784013437720.png",
          tags: "焦虑,情绪管理",
          authorName: "kk",
          readCount: 0,
          status: 1,
          statusText: "已发布",
          isFavorited: false,
          favoriteCount: 0,
          publishedAt: "2026-07-17 23:42:20",
          createdAt: "2026-07-14 15:17:43",
          updatedAt: "2026-07-17 23:42:20",
        },
        {
          id: "f735dd930530fcb6b9de168d1d113af6",
          categoryId: 4,
          categoryName: "人际关系",
          title: "将安南",
          summary: "啊实打实的",
          coverImage: "/files/bussiness/article/1784047829971.jpg",
          tags: "情绪管理",
          authorName: "kk",
          readCount: 0,
          status: 1,
          statusText: "已发布",
          isFavorited: false,
          favoriteCount: 0,
          publishedAt: "2026-07-17 23:40:25",
          createdAt: "2026-07-15 00:50:41",
          updatedAt: "2026-07-18 17:24:51",
        },
        {
          id: "f8753b82588f7caa06c1d6be4983e9eb",
          categoryId: 4,
          categoryName: "人际关系",
          title: "世界末日2",
          summary: "世界末日2",
          tags: "焦虑",
          authorName: "kk",
          readCount: 0,
          status: 2,
          statusText: "已下线",
          isFavorited: false,
          favoriteCount: 0,
          publishedAt: "2026-07-17 23:40:19",
          createdAt: "2026-07-15 18:02:38",
          updatedAt: "2026-07-18 17:46:55",
        },
        {
          id: "fe30282a92fa3b3bad8920ad6b123092",
          categoryId: 4,
          categoryName: "人际关系",
          title: "心理健康咨询",
          summary: "加油",
          coverImage: "/files/bussiness/article/1784366654201.svg",
          tags: "焦虑",
          authorName: "kk",
          readCount: 0,
          status: 1,
          statusText: "已发布",
          isFavorited: false,
          favoriteCount: 0,
          publishedAt: "2026-07-17 23:35:32",
          createdAt: "2026-07-10 16:17:52",
          updatedAt: "2026-07-18 17:24:27",
        },
        {
          id: "fffdf99b0312b87c8dc9c8f663162d92",
          categoryId: 4,
          categoryName: "人际关系",
          title: "将安南",
          summary: "啊实打实的",
          coverImage: "/files/bussiness/article/1784047663674.jpg",
          tags: "焦虑",
          authorName: "kk",
          readCount: 0,
          status: 1,
          statusText: "已发布",
          isFavorited: false,
          favoriteCount: 0,
          publishedAt: "2026-07-17 23:35:21",
          createdAt: "2026-07-15 00:47:48",
          updatedAt: "2026-07-17 23:35:21",
        },
        {
          id: "99",
          categoryId: 2,
          categoryName: "情绪管理",
          title: "测试更新文章",
          summary: "string",
          coverImage: "string",
          tags: "string",
          authorName: "jq_c",
          readCount: 0,
          status: 1,
          statusText: "已发布",
          isFavorited: false,
          favoriteCount: 0,
          publishedAt: "2026-07-05 13:23:57",
          createdAt: "2026-07-04 22:05:37",
          updatedAt: "2026-07-17 21:56:29",
        },
        {
          id: "ea7bfaeb9ff831be921d431a12415299",
          categoryId: 4,
          categoryName: "人际关系",
          title: "12",
          summary: "<p>1</p>",
          authorName: "kk",
          readCount: 0,
          status: 2,
          statusText: "已下线",
          isFavorited: false,
          favoriteCount: 0,
          publishedAt: "2026-07-03 20:22:36",
          createdAt: "2026-07-03 17:38:47",
          updatedAt: "2026-07-17 21:56:24",
        },
        {
          id: "e89287ca437203bd7bf8c050a8dd846f",
          categoryId: 4,
          categoryName: "人际关系",
          title: "2",
          summary: "<p>2</p>",
          authorName: "kk",
          readCount: 0,
          status: 2,
          statusText: "已下线",
          isFavorited: false,
          favoriteCount: 0,
          publishedAt: "2026-07-03 20:22:34",
          createdAt: "2026-07-03 17:39:00",
          updatedAt: "2026-07-18 17:24:55",
        },
        {
          id: "6159761a5429c06708567fcd66243caf",
          categoryId: 4,
          categoryName: "人际关系",
          title: "5",
          summary: "<p>5</p>",
          authorName: "kk",
          readCount: 0,
          status: 1,
          statusText: "已发布",
          isFavorited: false,
          favoriteCount: 0,
          publishedAt: "2026-07-03 18:13:46",
          createdAt: "2026-07-03 17:39:23",
          updatedAt: "2026-07-03 18:18:57",
        },
      ],
      total: 224,
      size: 10,
      current: 1,
      pages: 23,
    },
    message: "操作成功",
    success: true,
  };
  response.send(data);
});

app.post("/file/upload", upload.single("file"), (request, response) => {
  const { file } = request;
  const { businessType, businessId, businessField } = request.body;

  if (!file) {
    response.send({
      code: "-1",
      msg: "请选择要上传的文件",
      success: false,
    });
    return;
  }

  const filePath = `/files/images/${file.filename}`;
  const ext = path.extname(file.originalname).toLowerCase();
  const fileTypeMap = {
    ".jpg": { type: "IMG", desc: "图片" },
    ".jpeg": { type: "IMG", desc: "图片" },
    ".png": { type: "IMG", desc: "图片" },
    ".gif": { type: "IMG", desc: "图片" },
    ".svg": { type: "IMG", desc: "图片" },
    ".webp": { type: "IMG", desc: "图片" },
  };
  const fileTypeInfo = fileTypeMap[ext] || { type: "OTHER", desc: "其他" };

  const data = {
    code: "200",
    msg: "操作成功",
    data: {
      id: Math.floor(Math.random() * 100000),
      originalName: file.originalname,
      filePath,
      fileSize: file.size,
      fileType: fileTypeInfo.type,
      fileTypeDesc: fileTypeInfo.desc,
      businessType: businessType || "ARTICLE",
      businessTypeDesc: "文章封面",
      businessId: businessId || crypto.randomUUID(),
      businessField: businessField || "cover",
      uploadUserId: 1,
      isTemp: false,
      status: 1,
      createTime: new Date()
        .toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(/\//g, "-"),
      fileExtension: ext.slice(1),
      isExpired: false,
    },
    message: "操作成功",
    success: true,
  };
  response.send(data);
});

// 创建文章
app.post("/knowledge/article", (request, response) => {
  const { title, content, coverImage, categoryId, summary, tags, id } =
    request.body;
  const tagArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];
  const data = {
    code: "200",
    msg: "创建文章成功",
    data: {
      id: id || Math.random().toString(36).substring(2, 26),
      categoryId,
      title,
      summary,
      content,
      coverImage: coverImage || "",
      tags,
      tagArray,
      authorId: 1,
      authorName: "kk",
      readCount: 0,
      status: 0,
      statusText: "草稿",
      isFavorited: false,
      createdAt: "2026-07-20 10:25:07",
      updatedAt: "2026-07-20 10:25:07",
    },
    message: "创建文章成功",
    success: true,
  };
  response.send(data);
});

// 文章详情
app.get("/knowledge/article/:id", (req, res) => {
  const data = {
    code: "200",
    msg: "操作成功",
    data: {
      id: "1e243202a68c5286fb500eb4fe7fe234",
      categoryId: 4,
      categoryName: "人际关系",
      title: "当·潮汐漫溢",
      summary: "王俊凯【当·潮汐漫溢】巡回演唱会",
      content:
        "<p>王俊凯【当·潮汐漫溢】巡回演唱会——重庆站首场于7月18-19日在重庆·华熙生物·润百颜ECM中心演出</p><p>没抢到票</p><p>痛苦！！！！</p><p><br></p>",
      coverImage: "/files/bussiness/article/1784272739769.jpg",
      tags: "情绪管理,放松,正念",
      tagArray: ["情绪管理", "放松", "正念"],
      authorId: 1,
      authorName: "kk",
      readCount: 0,
      status: 1,
      statusText: "已发布",
      isFavorited: false,
      publishedAt: "2026-07-19 23:49:32",
      createdAt: "2026-07-17 15:19:06",
      updatedAt: "2026-07-19 23:49:32",
    },
    message: "操作成功",
    success: true,
  };
  res.send(data);
});

// 更新文章
app.put("/knowledge/article/:id", (req, res) => {
  const data = {
    code: "200",
    msg: "更新文章成功了",
    data: {
      id: "822d59f1-01f1-4531-8d40-9271de4af0f3",
      categoryId: 4,
      categoryName: "人际关系",
      title: "金泰亨",
      summary: "11111fads",
      content: "<p>金泰亨是我偶像123</p>",
      coverImage: "/files/bussiness/article/1783944102132.webp",
      tags: "情绪管理,正念",
      tagArray: ["情绪管理", "正念"],
      authorId: 1,
      authorName: "kk",
      readCount: 0,
      status: 1,
      statusText: "已发布",
      isFavorited: false,
      publishedAt: "2026-07-20 12:56:49",
      createdAt: "2026-07-13 20:01:59",
      updatedAt: "2026-07-20 14:22:14",
    },
    message: "更新文章成功",
    success: true,
  };
  res.send(data);
});

// 发布、下线文章
app.put("/knowledge/article/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log("参数", status, id);
  const publishData = {
    code: "200",
    msg: "状态更新成功",
    data: {
      id: "01581ea71741edace8550da7789b6834",
      categoryId: 4,
      categoryName: "人际关系",
      title: "1355",
      summary: "135",
      content: "<p>56tyghbmnj</p>",
      coverImage: "/files/bussiness/article/1784448886962.jpg",
      tags: "放松,抑郁",
      tagArray: ["放松", "抑郁"],
      authorId: 1,
      authorName: "kk",
      readCount: 0,
      status: 1,
      statusText: "已发布",
      isFavorited: false,
      publishedAt: "2026-07-20 14:46:39",
      createdAt: "2026-07-19 16:15:12",
      updatedAt: "2026-07-20 14:46:39",
    },
    message: "状态更新成功",
    success: true,
  };
  const offineData = {
    code: "200",
    msg: "状态更新成功",
    data: {
      id: "1784348166432",
      categoryId: 3,
      categoryName: "压力缓解",
      title: "ysj1",
      summary: "2324",
      content: "<p>你好</p><p>好</p>",
      coverImage: "/files/bussiness/article/1784348155133.jpg",
      tags: "焦虑,压力,睡眠",
      tagArray: ["焦虑", "压力", "睡眠"],
      authorId: 1,
      authorName: "kk",
      readCount: 0,
      status: 2,
      statusText: "已下线",
      isFavorited: false,
      publishedAt: "2026-07-19 15:41:39",
      createdAt: "2026-07-18 12:16:07",
      updatedAt: "2026-07-20 14:51:00",
    },
    message: "状态更新成功",
    success: true,
  };
  if (status === 1) {
    res.send(publishData);
  } else if (status === 2) {
    res.send(offineData);
  } else {
    res.send({
      code: "400",
      msg: "无效的状态值",
      success: false,
    });
  }
});

// 删除文章
app.delete("/knowledge/article/:id", (req, res) => {
  const data = {
    code: "200",
    msg: "操作成功",
    message: "操作成功",
    success: true,
  };
  res.send(data);
});

app.listen(5000, () => {
  console.log("服务器启动成功，请求地址：http://localhost:5000");
});
