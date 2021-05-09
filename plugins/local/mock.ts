import Vue from 'vue'

import { Users } from '~/mock/users'
import { Servers, Unreads } from '~/mock/servers'
import { Messages } from '~/mock/messages'

const mock = {
  users: Users,
  user: Users[3],
  servers: Servers,
  unreads: Unreads,
  messages: Messages,
}

declare module '@nuxt/types' {
  interface Context {
    $mock: object
  }
}

Vue.prototype.$mock = mock
