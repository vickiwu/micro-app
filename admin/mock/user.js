
const tokens = {
  admin: {
    access_token: 'admin-token'
  },
  editor: {
    access_token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login
  {
    url: '/vue-admin-template/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const access_token = tokens[username]

      // mock error
      if (!access_token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: access_token
      }
    }
  },

  // get user info
  {
    url: '/vue-admin-template/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },
  // 加载路由
  {
    url: '/vue-admin-template/user/routes\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      // 路由和组件后台获取放在routes，
      // 菜单后台获取放在menuList中，
      // 菜单类型menuType，top和left两种，
      // 其中top类型包含有下拉无侧菜单，及无下拉有侧边栏两种情况
      return {
        code: 20000,
        data: {
          'routes': [
            {
              path: '/', // 路径（唯一）
              component: 'Layout', // 组件名称，框架名称固定为Layout
              redirect: '/dashboard', // 由于此路由没有页面，重定向到其他路由，默认取第一个子元素
              name: '/', // 路由名称（唯一）
              meta: {
                title: '首页' // 菜单名称
              },
              children: [{
                path: '/dashboard', // 路径（唯一）
                name: 'index', // 路由名称（唯一）
                meta: {
                  title: '首页', // 菜单名称
                  permission: ['table:edit'],
                  affix: true // true表示该页面在tagView中固定展示，不可删除
                },
                component: 'views/dashboard/index'// 组件名称
              }]
            },

            {
              path: '/example',
              component: 'Layout',
              redirect: '/example/table',
              children: [
                {
                  path: '/example/table',
                  name: 'table',
                  meta: {
                    title: 'table' // 菜单名称
                  },
                  component: 'views/table/index'
                },
                {
                  path: '/example/tree',
                  name: 'tree',
                  meta: {
                    title: 'tree' // 菜单名称
                  },
                  component: 'views/tree/index'
                }
              ]
            },

            {
              path: '/form',
              component: 'Layout',
              redirect: '/form/index',
              children: [
                {
                  path: '/form/index',
                  name: 'form',
                  meta: {
                    title: 'form' // 菜单名称
                  },
                  component: 'views/form/index'
                }
              ]
            },

            {
              path: '/nested',
              component: 'Layout',
              redirect: '/nested/menu1',
              children: [
                {
                  path: '/nested/menu1',
                  component: 'views/nested/menu1/index', // Parent router-view
                  redirect: '/nested/menu1/menu1-1',
                  children: [
                    {
                      path: '/nested/menu1/menu1-1',
                      name: 'menu1-1',
                      meta: {
                        title: 'menu1-1' // 菜单名称
                      },
                      component: 'views/nested/menu1/menu1-1/index'
                    },
                    {
                      path: '/nested/menu1/menu1-2',
                      component: 'views/nested/menu1/menu1-2/index',
                      redirect: '/nested/menu1/menu1-2/menu1-2-1',
                      children: [
                        {
                          path: '/nested/menu1/menu1-2/menu1-2-1',
                          name: 'menu1-2-1',
                          meta: {
                            title: 'menu1-2-1' // 菜单名称
                          },
                          component: 'views/nested/menu1/menu1-2/menu1-2-1/index'
                        },
                        {
                          path: '/nested/menu1/menu1-2/menu1-2-2',
                          name: 'menu1-2-2',
                          meta: {
                            title: 'menu1-2-2'
                          },
                          component: 'views/nested/menu1/menu1-2/menu1-2-2/index'
                        }
                      ]
                    },
                    {
                      path: '/nested/menu1/menu1-3',
                      name: 'menu1-3',
                      meta: {
                        title: 'menu1-3'
                      },
                      component: 'views/nested/menu1/menu1-3/index'
                    }
                  ]
                },
                {
                  path: '/nested/menu2',
                  name: 'menu2',
                  meta: {
                    title: 'menu2'
                  },
                  component: 'views/nested/menu2/index'
                }
              ]
            },

            {
              path: 'external-link',
              component: 'Layout',
              children: [
                {
                  path: 'https://panjiachen.github.io/vue-element-admin-site/#/'
                }
              ]
            },
            {
              path: '/bigScreen',
              name: 'bigScreen',
              meta: {
                title: 'bigScreen'
              },
              component: 'views/bigScreen/index'
            }

          ],
          menuType: 'left', //  menuType: 'left', // top 表示头部菜单，left表示左侧菜单
          menuList: [
            {
              path: '/dashboard', // 路径（唯一的，需要和routes中path对应）
              showSubMenu: false, // menuType 为top时需要使用，表示是否有头部下拉菜单，没有头部菜单则其子菜单在左侧菜单展示
              meta: {
                title: '首页', // 菜单名称
                icon: 'dashboard' // 菜单图标
              }
            },

            {
              path: '/example',
              showSubMenu: true, // true有头部下拉菜单，则子菜单在头部父菜单下拉展示，左侧收起
              meta: { title: 'Example', icon: 'el-icon-s-help' },
              children: [
                {
                  path: '/example/table',
                  meta: { title: 'Table', icon: 'table' }
                },
                {
                  path: '/example/tree',
                  meta: { title: 'Treqqqe', icon: 'tree' }
                }
              ]
            },

            {
              path: '/form/index',
              showSubMenu: false,
              meta: { title: 'Form', icon: 'form' },
              children: [
                {
                  path: '/form/index',
                  meta: { title: 'Form', icon: 'form' }
                }
              ]
            },
            {
              path: '/nested',
              showSubMenu: false,
              name: 'Nested',
              meta: {
                title: 'Nested',
                icon: 'nested'
              },
              children: [
                {
                  path: '/nested/menu1',
                  meta: { title: 'Menu1' },
                  children: [
                    {
                      path: '/nested/menu1/menu1-1',
                      meta: { title: 'Menu1-1' }
                    },
                    {
                      path: '/nested/menu1/menu1-2',
                      meta: { title: 'Menu1-2' },
                      children: [
                        {
                          path: '/nested/menu1/menu1-2/menu1-2-1',
                          meta: { title: 'Menu1-2-1' }
                        },
                        {
                          path: '/nested/menu1/menu1-2/menu1-2-2',
                          meta: { title: 'Menu1-2-2' }
                        }
                      ]
                    },
                    {
                      path: '/nested/menu1/menu1-3',
                      meta: { title: 'Menu1-3' }
                    }
                  ]
                },
                {
                  path: '/nested/menu2',
                  meta: { title: 'menu2' }
                }
              ]
            },

            {
              path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
              meta: { title: 'External Link', icon: 'link' }
            },
            {
              path: '/bigScreen',
              meta: {
                title: '大屏',
                icon: 'el-icon-info'
              }
            }
          ],
          permission: ['user:del', 'table:edit', 'user:look']
        }
      }
    }
  },
  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
