<template>
  <div class="dashboard-container">
    首页，无子菜单
    <div class="dashboard-text">获取当前登录用户名: {{ name }}</div>
    <div v-permission="current_permission">dsaf</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'current_permission'
    ])
  },
  created() {
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
