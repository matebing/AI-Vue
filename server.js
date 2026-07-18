import express, { response } from "express";
const app = express();

app.use((request, response, next) => {
  console.log("有人请求服务器了", request.get("Host"), request.url);
  next();
});

app.post("/user/login", (request, response) => {
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
      roleType: "2",
      flag: true,
    },
    message: "登录成功",
    success: true,
  };
  response.send(data);
});

app.listen(5000, () => {
  console.log("服务器启动成功，请求地址：http://localhost:5000");
});
