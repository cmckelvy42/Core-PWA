<template src="./Profile.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { ClipboardIcon } from 'satellite-lucide-icons'
import { sampleProfileInfo } from '~/mock/profile'
import { AccountsState } from '~/store/accounts/types'

declare module 'vue/types/vue' {
  interface Vue {
    accounts: AccountsState
  }
}
export default Vue.extend({
  name: 'ProfileSettings',
  components: {
    ClipboardIcon,
  },
  layout: 'settings',
  data() {
    return {
      profileInfo: sampleProfileInfo,
      croppedImage: '',
      showCropper: false,
    }
  },
  computed: {
    ...mapState(['accounts', 'ui']),
    isSmallScreen(): Boolean {
      // @ts-ignore
      if (this.$mq === 'sm' || (this.ui.settingsSideBar && this.$mq === 'md'))
        return true
      return false
    },
    src(): string {
      if (this.croppedImage) {
        return this.croppedImage
      }
      const hash = this.accounts.details.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
  methods: {
    /**
     * @method toggleCropper DocsTODO
     * @description
     * @example
     */
    toggleCropper() {
      this.showCropper = !this.showCropper
    },
    /**
     * @method openFileDialog DocsTODO
     * @description
     * @example
     */
    openFileDialog() {
      const fileInput = this.$refs.file as HTMLElement
      fileInput.click()
    },
    /**
     * @method setCroppedImage DocsTODO
     * @description
     * @param image
     * @example
     */
    setCroppedImage(image: any) {
      const fileInput = this.$refs.file as HTMLInputElement
      this.croppedImage = image
      fileInput.value = ''
    },
    /**
     * @method selectProfileImage DocsTODO
     * @description
     * @param e
     * @returns
     * @example
     */
    selectProfileImage(e: any) {
      if (e.target && e.target.value !== null) {
        const files = e.target.files || e.dataTransfer.files
        if (!files.length) return

        const reader = new FileReader()
        reader.onload = (e: any) => {
          this.profileInfo.imageUrl = e.target.result
          e.target.value = ''

          this.toggleCropper()
        }

        reader.readAsDataURL(files[0])
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Profile.less"></style>
