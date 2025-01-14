<template src="./Create.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { UserRegistrationData } from '~/types/ui/user'

export default Vue.extend({
  name: 'CreateUser',
  props: {
    onConfirm: {
      type: Function as PropType<(userData: UserRegistrationData) => void>,
      required: true,
    },
  },
  data() {
    return {
      showCropper: false,
      creating: '',
      croppedImage: '',
      imageUrl: '',
      name: '',
      error: '',
      status: '',
    }
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
     * @method selectIamge DocsTODO
     * @description
     * @param e
     * @example
     */
    async selectImage(e: Event) {
      const target = e.target as HTMLInputElement
      if (target.value === null) return

      const files = target.files
      if (!files?.length) return

      // stop upload if picture is too large for nsfw scan
      if (files[0].size > this.$Config.uploadByteLimit) {
        this.error = this.$t('errors.accounts.file_too_large') as string
        return
      }
      // stop upload if picture is nsfw
      try {
        const nsfw = await this.$Security.isNSFW(files[0])
        if (nsfw) {
          this.error = this.$t('errors.chat.contains_nsfw') as string
          return
        }
      } catch (err: any) {
        this.$Logger.log('error', 'file upload error')
      }
      this.error = ''

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          this.imageUrl = e.target.result.toString()

          this.toggleCropper()
        }
      }

      reader.readAsDataURL(files[0])
    },
    /**
     * @method setCroppedImage
     * @description
     * @param image
     * @returns
     * @example
     */
    setCroppedImage(image: string) {
      this.croppedImage = image

      const fileInputRef = this.$refs.file as HTMLInputElement

      if (fileInputRef) {
        fileInputRef.value = ''
      }
    },
    /**
     * @method confirm DocsTODO
     * @description
     * @returns
     * @example
     */
    confirm() {
      const isEmpty = RegExp(this.$Config.regex.blankSpace, 'g').test(this.name)
      if (this.name.length < 5 || isEmpty) {
        this.error = this.$t('user.registration.username_error') as string
        return false
      }
      this.error = ''

      this.onConfirm({
        username: this.name,
        photoHash: this.croppedImage,
        status: this.status,
      })
      return true
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Create.less"></style>
