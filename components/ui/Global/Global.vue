<template src="./Global.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { TrackKind } from '~/libraries/WebRTC/types'
import { ModalWindows } from '~/store/ui/types'

declare module 'vue/types/vue' {
  interface Vue {
    toggleModal: (modalName: string) => void
  }
}

export default Vue.extend({
  name: 'Global',
  computed: {
    ...mapState(['ui', 'media']),
    ModalWindows: () => ModalWindows,
  },
  mounted() {
    // This determines if we should show the
    let lsVersion = localStorage.getItem('local-version')

    if (!lsVersion) {
      localStorage.setItem('local-version', this.$config.clientVersion)
      lsVersion = this.$config.clientVersion
      return
    }

    const [majorVersion, minorVersion, patchVersion] =
      this.$config.clientVersion.split('.')
    const [lsMajorVersion, lsMinorVersion, lsPatchVersion] =
      lsVersion.split('.')

    // A update which requires resetting of the app has occurred.
    if (lsMinorVersion !== minorVersion) {
      this.$data.requiresUpdate = true
      this.$data.hasMinorUpdate = true
    }

    // A version which brings new features without major changes exists
    if (lsPatchVersion !== patchVersion) {
      this.$data.hasMinorUpdate = true
    }

    if (this.$config.clientVersion !== lsVersion) {
      this.toggleModal('changelog')
      localStorage.setItem('local-version', this.$config.clientVersion)
    }
  },
  methods: {
    /**
     * @method toggleModal
     * @description
     * @example
     */
    toggleModal(modalName: keyof ModalWindows): void {
      this.$store.commit('ui/toggleModal', {
        name: modalName,
        state: !this.ui.modals[modalName],
      })
    },
    /**
     * @method acceptCall DocsTODO
     * @description
     * @example
     */
    async acceptCall(kinds: TrackKind[]) {
      const identifier = this.$store.state.webrtc.incomingCall

      const peer = this.$WebRTC.getPeer(identifier)

      await peer?.call.createLocalTracks(kinds)

      await peer?.call.answer()
    },
    /**
     * @method denyCall DocsTODO
     * @description
     * @example
     */
    denyCall() {
      const identifier = this.$store.state.webrtc.incomingCall
      const peer = this.$WebRTC.getPeer(identifier)

      peer?.call.deny()

      this.$store.dispatch('webrtc/denyCall')
    },
  },
})
</script>
