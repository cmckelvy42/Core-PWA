<template src="./Controls.html" />

<script lang="ts">
import Vue from 'vue'

import {
  MicIcon,
  MicOffIcon,
  HeadphonesIcon,
  VideoIcon,
  VideoOffIcon,
} from 'satellite-lucide-icons'

import { mapState } from 'vuex'
import { Sounds } from '~/libraries/SoundManager/SoundManager'
import { WebRTCEnum } from '~/libraries/Enums/types/webrtc'

export default Vue.extend({
  components: {
    MicIcon,
    MicOffIcon,
    HeadphonesIcon,
    VideoIcon,
    VideoOffIcon,
  },
  computed: {
    ...mapState(['audio', 'video', 'webrtc']),
    audioMuted() {
      return this.webrtc.localTracks.audio.muted
    },
    videoMuted() {
      return this.webrtc.localTracks.video.muted
    },
  },
  methods: {
    /**
     * @method toggleMute DocsTODO
     * @description
     * @example
     */
    toggleMute() {
      const muted = this.audioMuted

      const { activeCall } = this.webrtc

      const peer = this.$WebRTC.getPeer(activeCall)

      if (muted) {
        peer?.call.unmute(WebRTCEnum.AUDIO)
        this.$store.dispatch('sounds/playSound', Sounds.UNMUTE)
        return
      }
      peer?.call.mute(WebRTCEnum.AUDIO)
      this.$store.dispatch('sounds/playSound', Sounds.MUTE)
    },
    /**
     * @method toggleDeafen DocsTODO
     * @description
     * @example
     */
    toggleDeafen() {
      const deafened = this.audio.deafened
      if (!deafened) this.$store.dispatch('sounds/playSound', Sounds.DEAFEN)
      else this.$store.dispatch('sounds/playSound', Sounds.UNDEAFEN)
      this.$store.commit('audio/deafen')
    },
    /**
     * @method toggleVideo DocsTODO
     * @description
     * @example
     */
    toggleVideo() {
      const muted = this.videoMuted

      const { activeCall } = this.webrtc

      const peer = this.$WebRTC.getPeer(activeCall)

      if (muted) {
        peer?.call.unmute(WebRTCEnum.VIDEO)
        this.$store.dispatch('sounds/playSound', Sounds.UNDEAFEN)
        return
      }
      peer?.call.mute(WebRTCEnum.VIDEO)
      this.$store.dispatch('sounds/playSound', Sounds.DEAFEN)
    },
  },
})
</script>

<style scoped lang="less" src="./Controls.less"></style>
