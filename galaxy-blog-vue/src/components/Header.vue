<template>
  <div class="m-content">
    <h3>欢迎来到ArtlexKylin的博客</h3>
    <div class="block">
      <el-avatar :size="50" :src="user.avatar"></el-avatar>
      <div>{{ user.username }}</div>
    </div>

    <div class="maction">
      <span><el-link href="/blogs">主页</el-link></span>

      <!-- 登录了才显示发表博客按钮 -->
      <span v-show="hasLogin"><el-divider direction="vertical"></el-divider></span>
      <span v-show="hasLogin"><el-link type="success" href="/blog/add">发表博客</el-link></span>

      <el-divider direction="vertical"></el-divider>
      <!-- 未登录显示登录，登录显示退出 -->
      <span v-show="!hasLogin"><el-link type="primary" href="/login">登录</el-link></span>
      <span v-show="hasLogin"><el-link type="danger" @click="logout">退出</el-link></span>
    </div>

  </div>
</template>

<script>
  export default {
    name: "Header",
    data() {
      return {
        user: {
          username: '游客',
          avatar: 'https://avatar.csdnimg.cn/5/A/6/1_weixin_42159233_1606490691.jpg'
        },
        hasLogin: false
      }
    },
    methods: {
      logout() {
        const _this = this
        _this.$axios.get("/logout", {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        }).then(res => {
          _this.$store.commit("REMOVE_INFO")
          _this.$router.push("/login")
        })
        this.hasLogin = false
      }
    },
    created() {
      if(this.$store.getters.getUser.username) {
        this.user.username = this.$store.getters.getUser.username
        this.user.avatar = this.$store.getters.getUser.avatar

        this.hasLogin = true
      }

    }
  }
</script>

<style scoped>

  .m-content {
    max-width: 960px;
    margin: 0 auto;
    text-align: center;
  }
  .maction {
    margin: 10px 0;
  }

</style>