import { SoundsState } from './types'

const InitialSettingsState = (): SoundsState => ({
  newMessage: true,
  hangup: true,
  call: true,
  mute: true,
  unmute: true,
  deafen: true,
  undeafen: true,
  upload: true,
  connected: true,
})

export default InitialSettingsState
