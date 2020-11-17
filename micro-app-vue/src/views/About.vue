<template>
  <div class="about">
    <h1>This is an about page {{user}}</h1>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapState('global', {
      user: state => state.user.name
    })
  }
}
</script>
