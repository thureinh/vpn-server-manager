// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  devServer: {
    port: 4000,
    host: '0.0.0.0'
  },
  modules: ['@nuxt/ui', '@sidebase/nuxt-auth'],
  ui: {
    primary: 'green',
    gray: 'cool'
  },
  build: {
    transpile: ['jsonwebtoken']
  },
  auth: {
    baseURL: '/',
    provider: {
        type: 'local',
        endpoints: {
          getSession: { path: '/api/auth/user', method: 'get'},
          signIn: { path: '/api/auth/login', method: 'post' },
          signOut: { path: '/api/auth/logout', method: 'post' },
        },
        pages: {
          login: '/login'
        },
        token: {
          signInResponseTokenPointer: '/token/accessToken'
        },
        sessionDataType: { id: 'string', name: 'string' }
    },
    session: {
      enableRefreshOnWindowFocus: true,
    },
    globalAppMiddleware: {
      isEnabled: false
    }
  }
})
