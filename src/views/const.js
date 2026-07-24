import {
  happyUrl,
  calmUrl,
  anxietyUrl,
  sadUrl,
  excitedUrl,
  tiredUrl,
  surprisedUrl,
  confusedUrl,
} from "@/assets/index.js";

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
    url: happyUrl,
  },
  {
    name: "平静",
    url: calmUrl,
  },
  {
    name: "焦虑",
    url: anxietyUrl,
  },
  {
    name: "悲伤",
    url: sadUrl,
  },
  {
    name: "兴奋",
    url: excitedUrl,
  },
  {
    name: "疲惫",
    url: tiredUrl,
  },
  {
    name: "惊讶",
    url: surprisedUrl,
  },
  {
    name: "困惑",
    url: confusedUrl,
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
