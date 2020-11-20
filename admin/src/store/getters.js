const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routes: state => state.user.routes,
  menu_type: (state, getters) => {
    return state.user.menuType
  },
  left_menus: (state, getters) => {
    return state.user.leftMenu
  },
  top_menus: (state, getters) => {
    return state.user.topMenu
  },
  permission: state => state.user.permission,
  current_permission: state => state.user.currentPermission
}
export default getters
