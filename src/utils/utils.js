export const getEmotionCount = (score) => {
  if (score >= 61) {
    return 3;
  }
  if (score >= 31) {
    return 2;
  }
  return 1;
};

export const getRiskText = (level) => {
  switch (level) {
    case 0:
      return "正常";
    case 1:
      return "关注";
    case 2:
      return "预警";
    case 3:
      return "危机";
    default:
      return "正常";
  }
};

// 格式化文章内容为HTML
export const formatContent = (content) => {
  if (!content) return "";

  // 基本的HTML清理和格式化
  let formatted = content
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");

  return formatted;
};
