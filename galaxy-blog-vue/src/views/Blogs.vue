<template>
  <div class="mcontaner">
    <!-- 使用Header组件 -->
    <Header></Header>

    <div class="block">
      <!-- 使用时间线样式 -->
      <el-timeline>
        <!-- 每一个item根据博客的穿件时间 -->
        <el-timeline-item :timestamp="blog.createTime" placement="top" v-for="blog in blogs">
          <el-card>
            <h4>
              <router-link :to="{name: 'BlogDetail', params: {blogId: blog.id}}">
                {{blog.title}}
              </router-link>
            </h4>
            <!-- 摘要显示内容前100个字符 -->
            <p>{{blog.content.substring(0,100)}}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <el-pagination class="mpage"
                     background
                     layout="prev, pager, next"
                     :current-page="currentPage"
                     :page-size="pageSize"
                     :total="total"
                     @current-change=page>
      </el-pagination>

      <!-- 回到顶部组件 -->
      <el-backtop></el-backtop>
    </div>

  </div>
</template>

<script>
  import Header from "../components/Header";

  export default {
    name: "Blogs.vue",
    components: {Header},
    data() {
      return {
        blogs: {},
        currentPage: 1,
        total: 0,
        pageSize: 5
      }
    },
    methods: {
      page(currentPage) {
        const _this = this
        console.log(1)
        _this.$axios.get("/blogs?currentPage=" + currentPage).then(res => {
          console.log(2)
          console.log(res)
          _this.blogs = res.data.data.records
          _this.currentPage = res.data.data.current
          _this.total = res.data.data.total
          _this.pageSize = res.data.data.size

        })
      }
    },
    // 初始化函数
    created() {
      this.page(1)
    }
  }
</script>

<style scoped>

  .mpage {
    margin: 0 auto;
    text-align: center;
  }

</style>