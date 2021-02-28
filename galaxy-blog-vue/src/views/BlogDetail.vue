<template>
  <div>
    <Header></Header>

    <div class="mblog">

      <div>
        <!-- 显示文章标题 -->
        <h2> {{ blog.title }}</h2>
        <!-- 只有是博客所有者，才能进行编辑和删除 -->
        <div v-if="ownBlog">
          <!-- 跳转链接组件+按钮组件 -->
          <router-link :to="{name: 'BlogEdit', params: {blogId: blog.id}}">
            <el-button>
              编辑
            </el-button>
          </router-link>
          &nbsp;
          <!-- 气泡确认框组件 -->
          <!--          <el-popconfirm title="确定删除这篇博客吗？">-->
          <!--            <el-button slot="reference" @click.native="blogDelete()">删除</el-button>-->
          <!--          </el-popconfirm>-->

          <!-- 弹出确认框组件 -->
          <el-button @click="dialogVisible = true">删除</el-button>
          <el-dialog
              title="注意"
              :visible.sync="dialogVisible"
              width="30%">
            <span>确定删除这篇博客吗？</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click.native="blogDelete()">确 定</el-button>
            </span>
          </el-dialog>

        </div>
      </div>


      <!-- 分割线组件 -->
      <el-divider class="divider"></el-divider>
      <!-- 显示内容 -->
      <div class="markdown-body" v-html="blog.content"></div>
      <!-- 回到顶部组件 -->
      <el-backtop></el-backtop>

    </div>

  </div>
</template>

<script>
import 'github-markdown-css'
import Header from "../components/Header";

export default {
  name: "BlogDetail.vue",
  components: {Header},
  data() {
    return {
      blog: {
        id: "",
        userId: "",
        title: "",
        content: "",
        status: 1
      },
      ownBlog: false,
      dialogVisible: false
    };
  },
  created() {
    const blogId = this.$route.params.blogId
    console.log(blogId)
    const _this = this
    this.$axios.get('/blog/' + blogId).then(res => {
      const blog = res.data.data
      _this.blog.id = blog.id
      _this.blog.title = blog.title
      _this.blog.userId = blog.userId

      var MardownIt = require("markdown-it")
      var md = new MardownIt()

      var result = md.render(blog.content)
      _this.blog.content = result
      _this.ownBlog = (blog.userId === _this.$store.getters.getUser.id)

    })
  },
  methods: {
    blogDelete() {
      this.$axios.post('/blog/delete', this.blog, {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      }).then(res => {
        console.log(res);
        this.$router.push("/blogs")
      })
      // this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.mblog {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 95%;
  min-height: 700px;
  padding: 20px 15px;
  margin: auto auto;
}
</style>