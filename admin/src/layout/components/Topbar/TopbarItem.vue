<template>
  <div>
    <!-- 单菜单 1.子菜单等于1-->
    <template v-if="!hasSubMenu(item.children,item)">
      <app-link v-if="showingTopMenu.meta" :to="resolvePath(showingTopMenu.path)">
        <el-menu-item :index="resolvePath(showingTopMenu.path)">
          <item :icon="showingTopMenu.meta.icon||(item.meta&&item.meta.icon)" :title="showingTopMenu.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <!-- 下拉菜单 -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <topbar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(item.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'TopbarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.showingTopMenu = null
    return {}
  },
  mounted() {
  },
  methods: {
    hasSubMenu(children = [], parent) {
      if (parent.showSubMenu) {
        // 需要展示下拉菜单---到下个模板
        return true
      } else {
        // 不展示下拉。只展示父级菜单
        this.showingTopMenu = parent
        return false
      }
    },

    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
