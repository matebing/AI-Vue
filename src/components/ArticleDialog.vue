<template>
  <el-dialog
    :title="isEdit ? '编辑文章' : '新增文章'"
    v-model="dialogVisible"
    width="50%"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
    >
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入文章标题"
          maxlength="200"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类">
          <el-option
            v-for="item in props.categoryList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input
          v-model="formData.summary"
          placeholder="请输入文章摘要(可选)"
          type="textarea"
          maxlength="1000"
          :rows="4"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="文章标签" prop="tags">
        <el-select
          v-model="formData.tagArr"
          placeholder="请选择文章标签"
          multiple
          filterable
          allow-create
        >
          <el-option
            v-for="tag in commonTags"
            :key="tag"
            :label="tag"
            :value="tag"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片">
        <div class="cover-upload">
          <el-upload
            class="avatar-uploader"
            action="#"
            :before-upload="beforeUpload"
            :http-request="handleUpload"
            accept="image/*"
            :show-file-list="false"
          >
            <div v-if="!imgUrl" class="cover-placeholder">
              <p>点击上传封面</p>
            </div>
            <img v-else :src="imgUrl" class="cover-image" alt="封面图片" />
          </el-upload>
          <div v-if="imgUrl" class="cover-remove">
            <el-button type="danger" size="mini" @click="removeCover"
              >移除封面</el-button
            >
          </div>
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor
          v-model="formData.content"
          placeholder="请输入文章内容，支持富文本格式\n\n可以使用加粗、斜体、列表、标题等格式来丰富文章内容。"
          :maxCharCount="5000"
          min-height="400px"
          @change="handleContentChange"
          @created="handleEditorCreated"
        />
      </el-form-item>
    </el-form>
    <div v-if="btnPreview">
      <!-- v-html指令接收一个HTML字符串，将其渲染为HTML元素 -->
      <h3>内容预览</h3>
      <div v-html="formData.content"></div>
    </div>
    <template #footer>
      <el-button type="primary" @click="btnPreview = !btnPreview">{{
        btnPreview ? "隐藏预览" : "预览效果"
      }}</el-button>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">{{
        isEdit ? "更新文章" : "创建文章"
      }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { ElMessage } from "element-plus";
import { ref, computed, reactive, nextTick, watch } from "vue";
import { uploadCover, createArticle, updateArticle } from "@/api/admin";
import { FILE_BASE_URL } from "@/config/index";
import RichTextEditor from "@/components/RichTextEditor.vue";

const props = defineProps({
  title: {
    type: String,
    default: "文章详情",
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  categoryList: {
    type: Array,
    default: () => [],
  },
  articleDetail: {
    type: Object,
    //定义成null是为了在弹窗里面判断是 新增 还是 编辑
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "success"]);

const formRef = ref();

const editorInstance = ref(null);

const btnPreview = ref(false);

const imgUrl = ref("");

const loading = ref(false);

const businessId = ref("");

const isEdit = computed(() => {
  return !!props.articleDetail?.id;
});

const formData = reactive({
  title: "",
  content: "",
  coverImage: "",
  categoryId: null,
  summary: "",
  tags: "",
  id: "",
});

const formRules = reactive({
  title: [
    { required: true, message: "请输入文章标题", trigger: "blur" },
    { max: 200, message: "文章标题最多200个字符", trigger: "blur" },
  ],
  categoryId: [{ required: true, message: "请选择分类", trigger: "change" }],
  content: [
    { required: true, message: "请输入文章内容", trigger: "blur" },
    { max: 5000, message: "文章内容最多5000个字符", trigger: "blur" },
  ],
});

const commonTags = [
  "情绪管理",
  "焦虑",
  "抑郁",
  "压力",
  "睡眠",
  "冥想",
  "正念",
  "放松",
  "心理健康",
  "自我成长",
  "人际关系",
  "工作压力",
  "学习方法",
  "生活技巧",
];

watch(
  () => props.articleDetail,
  (newVal) => {
    if (newVal) {
      //弹窗打开，表单创建是异步过程，需要等表单创建完成后再回填数据，否则会导致表单数据被覆盖掉
      nextTick(() => {
        //不能直接赋值，会丢失响应式
        //做对象属性合并，浅拷贝，把第二个对象的属性合并到第一个对象中
        Object.assign(formData, newVal);
        imgUrl.value = FILE_BASE_URL + newVal.coverImage;
        businessId.value = newVal.id;
      });
    }
  },
);

const dialogVisible = computed({
  get: () => {
    return props.modelValue;
  },
  set: (val) => {
    emit("update:modelValue", val);
  },
});

/**
 * 对上传的文件进行校验
 * before-upload必须返回一个boolean值，
 * 如果返回false,说明校验没通过，则上传到这结束
 * 如果返回true,则上传会继续，并触发http-request事件
 * 如果返回undefined,则上传会继续，但是不会触发http-request事件
 */
const beforeUpload = (file) => {
  const { name, type, size } = file;
  if (!type.startsWith("image/")) {
    ElMessage.error("上传封面必须是图片格式");
    return false;
  }
  if (size / 1024 / 1024 > 5) {
    ElMessage.error("上传封面图片大小不能超过5MB");
    return false;
  }
  return true;
};

const handleUpload = async ({ file, name, type, size }) => {
  businessId.value = crypto.randomUUID();
  const res = await uploadCover(file, businessId.value);
  imgUrl.value = FILE_BASE_URL + res.filePath;
  formData.coverImage = res.filePath;

  console.log("封面上传", res);
};

const removeCover = () => {
  imgUrl.value = "";
  formData.coverImage = "";
};

const handleContentChange = (data) => {
  console.log(data);
  formData.content = data.html;
};

const handleEditorCreated = (editor) => {
  editorInstance.value = editor;
  // 编辑时回填富文本
  if (formData.content && editor) {
    // 富文本创建过程是异步的，需要等富文本实例创建完成后再回填内容，否则会导致富文本内容被覆盖掉
    // editor没有创建出来，调用setHtml会报错，nextTick代表下一次渲染
    nextTick(() => {
      editor.setHtml(formData.content);
    });
  }
};

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    console.log("formdata", formData);
    if (valid) {
      loading.value = true;
      const params = {
        ...formData,
        tags: formData.tagArr?.join(",") || "",
      };
      delete params.tagArr;
      if (isEdit.value) {
        updateArticle(props.articleDetail.id, params)
          .then((res) => {
            ElMessage.success(res.message || "更新文章成功");
            emit("success");
            handleClose();
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        params["id"] = businessId.value;
        createArticle(params)
          .then((res) => {
            ElMessage.success(res.message || "创建文章成功");
            emit("success");
            handleClose();
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};

const handleClose = () => {
  formRef.value.resetFields();
  businessId.value = null;
  btnPreview.value = false;
  formData.tagArr = [];
  removeCover();

  emit("update:modelValue", false);
  // dialogVisible.value = false;
};
</script>
<style lang="scss" scoped>
.cover-upload {
  .avatar-uploader {
    .cover-placeholder {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 200px;
      height: 120px;
      color: #8b949e;
      background: #f6f8fa;
    }
    .cover-image {
      width: 200px;
      height: 120px;
      display: block;
    }
  }
}
</style>
