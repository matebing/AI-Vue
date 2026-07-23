export const FILE_BASE_URL = "http://159.75.169.224:1235";
// export const FILE_BASE_URL = "http://localhost:5000";

//情绪评分
export const emotionStatus = [
  "绝望崩溃",
  "消沉抑郁",
  "焦虑烦躁",
  "低落不悦",
  "平静淡然",
  "轻松惬意",
  "愉悦舒心",
  "欢欣满足",
  "兴奋欣喜",
  "极致幸福",
];

//情绪选项
export const emotionOptions = [
  {
    name: "开心",
    url: new URL("@/assets/images/开心.png", import.meta.url).href,
  },
  {
    name: "平静",
    url: new URL("@/assets/images/平静.png", import.meta.url).href,
  },
  {
    name: "焦虑",
    url: new URL("@/assets/images/焦虑.png", import.meta.url).href,
  },
  {
    name: "悲伤",
    url: new URL("@/assets/images/悲伤.png", import.meta.url).href,
  },
  {
    name: "兴奋",
    url: new URL("@/assets/images/兴奋.png", import.meta.url).href,
  },
  {
    name: "疲惫",
    url: new URL("@/assets/images/疲惫.png", import.meta.url).href,
  },
  {
    name: "惊讶",
    url: new URL("@/assets/images/惊讶.png", import.meta.url).href,
  },
  {
    name: "困惑",
    url: new URL("@/assets/images/困惑.png", import.meta.url).href,
  },
];

//睡眠质量选项
export const sleepQualitys = [
  {
    label: "很差",
    value: 1,
  },
  {
    label: "较差",
    value: 2,
  },
  {
    label: "一般",
    value: 3,
  },
  {
    label: "良好",
    value: 4,
  },
  {
    label: "优秀",
    value: 5,
  },
];

//压力水平选项
export const stressLevels = [
  {
    label: "很低",
    value: 1,
  },
  {
    label: "较低",
    value: 2,
  },
  {
    label: "中等",
    value: 3,
  },
  {
    label: "较高",
    value: 4,
  },
  {
    label: "很高",
    value: 5,
  },
];
