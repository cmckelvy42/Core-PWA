<template src="./Upload.html"></template>

<script lang="ts">
import { FilePlusIcon, PlusIcon, XIcon } from 'satellite-lucide-icons'
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { cloneDeep } from 'lodash'
import { Config } from '~/config'
import { PropCommonEnum } from '~/libraries/Enums/enums'
import { isHeic } from '~/utilities/Heic'
import { UploadDropItemType, FileType } from '~/types/files/file'
import { Friend } from '~/types/ui/friends'
const converter = require('heic-convert')

declare module 'vue/types/vue' {
  interface Vue {
    files: UploadDropItemType[]
    uploadStatus: boolean
    count_error: boolean
    loadPicture: (item: UploadDropItemType) => void
    cancelUpload: () => void
    finishUploads: () => void
    dispatchFile: (file: UploadDropItemType) => void
    alertNsfwFile: () => void
  }
}

export default Vue.extend({
  name: 'Upload',
  components: {
    PlusIcon,
    FilePlusIcon,
    XIcon,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    editable: {
      type: Boolean,
    },
    recipient: {
      type: Object as PropType<Friend>,
      required: true,
    },
  },
  data() {
    return {
      files: [] as Array<UploadDropItemType>,
      uploadStatus: false,
      count_error: false,
      progress: 0,
      ipfsHash: false,
      selectedFile: false,
      imageURL: '',
      fileClass: false,
      error: false,
      aiScanning: false,
      fileAmount: 0,
      containsNsfw: false,
      alertNsfw: false,
    }
  },
  computed: {
    ...mapState(['ui', 'friends', 'chat']),
    activeFriend() {
      return this.$Hounddog.getActiveFriend(this.$store.state.friends)
    },
  },
  watch: {
    recipient() {
      this.files = cloneDeep(this.chat.files?.[this.recipient.address]) ?? []
      this.$parent.$data.showFilePreview = this.files.length > 0
    },
  },
  mounted() {
    this.files = cloneDeep(this.chat.files?.[this.recipient.address]) ?? []
  },
  methods: {
    /**
     * @method resetFileUpload
     * @description Clear the value of file input so trigger the handleFile for the same file.
     * @example <input @onclick="resetFileUpload" />
     */
    async resetFileUpload() {
      if (this.$refs.quickUpload)
        (this.$refs.quickUpload as HTMLFormElement).value = ''
    },
    /**
     * @method handleFile
     * @description Handles file in event object by NSFW checking and then loading it. Triggered when a file is changed on the input.
     * @param event Input event object
     * @example <input @change="handleFile" />
     */
    async handleFile(event: any) {
      this.$store.dispatch('textile/clearUploadStatus')
      if (this.editable) {
        const files: File[] = [...event.target.files]
        this.$parent.$data.showFilePreview = files.length > 0
        if (files.length + this.$data.files.length > 8) {
          this.$data.count_error = true
          return
        }
        const address = this.recipient.address
        this.$data.count_error = false
        for (let i = 0; i < files.length; i++) {
          /* checking .heic file needs file array buffer because sometimes its file type return empty string */
          const buffer = new Uint8Array(await files[i].arrayBuffer())
          const isHeicType = isHeic(buffer)
          if (isHeicType) {
            /* convert .heic file to jpeg so that we can convert it for html5 style */
            const oBuffer = await converter({
              buffer, // the HEIC file buffer
              format: 'JPEG', // output format
              quality: 1,
            })
            files[i] = new File(
              [oBuffer.buffer],
              `${files[i].name.split('.')[0] || 'newImage'}.jpeg`,
              {
                type: 'image/jpeg',
              },
            )
          }
        }
        const newFiles = await Promise.all(
          [...files].map(async (file: File) => {
            const uploadFile = {
              file,
              nsfw: { status: false, checking: false },
              url: '',
            } as UploadDropItemType
            return uploadFile
          }),
        )
        newFiles.forEach(async (uploadFile: UploadDropItemType) => {
          if (uploadFile.file.size <= Config.uploadByteLimit) {
            uploadFile.nsfw.checking = true
            try {
              uploadFile.nsfw.status = await this.$Security.isNSFW(
                uploadFile.file,
              )
            } catch (err) {
              uploadFile.nsfw.status = true
              uploadFile.nsfw.checking = false
            }
            uploadFile.nsfw.checking = false
          }
          this.$store.commit('chat/addFile', {
            file: uploadFile,
            address,
          })
          this.loadPicture(uploadFile)
        })
        this.files.push(...newFiles)
        this.$data.uploadStatus = true
      }
    },
    handleTouchPreview(event: Event) {
      event.stopPropagation()
    },
    /**
     * @method loadPicture
     * @description Creates data URL from file and pushes it to url in the components data object (this.$data.url = the new created data URL)
     * @param file File to load
     * @example this.loadPicture(this.$data.file)
     */
    loadPicture(item: UploadDropItemType) {
      if (!item.file) return
      const reader = new FileReader()
      reader.onload = function (e: Event | any) {
        if (e.target) item.url = e.target.result
      }
      reader.readAsDataURL(item.file)
    },
    /**
     * @method cancelUpload
     * @description Cancels file upload by setting file and url in local data to false
     * TODO: Clear input field, this currently breaks when you upload the same file after cancelling //AP-401
     * @example @click="cancelUpload"
     */
    cancelUpload() {
      this.files = []
      document.body.style.cursor = PropCommonEnum.DEFAULT
      this.uploadStatus = false
      this.count_error = false
      this.$parent.$data.showFilePreview = false
    },
    removeUploadItem(index: number) {
      this.files.splice(index, 1)
      if (this.$data.files.length === 0) {
        document.body.style.cursor = PropCommonEnum.DEFAULT
        this.uploadStatus = false
        this.count_error = false
        this.$parent.$data.showFilePreview = false
        this.$store.commit('chat/deleteFiles', this.recipient.address)
        return
      }
      this.$store.commit('chat/setFiles', {
        files: this.files,
        address: this.recipient.address,
      })
    },
    closeNsfwAlert() {
      this.$data.alertNsfw = false
      this.cancelUpload()
    },
    /**
     * @method finishUploads
     * @description Keeps track of how many files have been uploaded
     */
    finishUploads() {
      this.$data.fileAmount--
      if (this.$data.fileAmount === 0) {
        if (this.$data.containsNsfw) {
          this.$data.alertNsfw = true
          this.alertNsfwFile()
        }
        if (!this.$data.containsNsfw) {
          this.cancelUpload()
          document.body.style.cursor = PropCommonEnum.DEFAULT
          this.$store.dispatch('textile/clearUploadStatus')
        }
      }
    },
    alertNsfwFile() {
      this.$data.alertNsfw = true
      setTimeout(() => {
        this.$data.alertNsfw = false
        this.$data.containsNsfw = false
        this.cancelUpload()
        document.body.style.cursor = PropCommonEnum.DEFAULT
        this.$store.dispatch('textile/clearUploadStatus')
      }, 5000)
    },
    /**
     * @method dispatchFile
     * @description Sends a singular file to textile.
     */
    async dispatchFile(file: FileType) {
      await this.$store
        .dispatch('textile/sendFileMessage', {
          to: this.recipient?.textilePubkey,
          file,
        })
        .then(() => {
          this.finishUploads()
        })
        .catch((error) => {
          if (error) {
            this.$Logger.log('file send error', error)
            document.body.style.cursor = PropCommonEnum.DEFAULT
            this.$store.dispatch('textile/clearUploadStatus')
          }
        })
    },
    /**
     * @method sendMessage
     * @description Sends action to Upload the file to textile.
     */
    async sendMessage() {
      const nsfwCheck: UploadDropItemType[] = []
      this.$data.files.forEach((file: UploadDropItemType) => {
        if (!file.nsfw.status) {
          nsfwCheck.push(file)
        } else {
          this.$data.containsNsfw = true
          if (this.$data.files.length === 1) {
            this.alertNsfwFile()
          }
        }
      })
      nsfwCheck.forEach((file: UploadDropItemType) => {
        this.$data.fileAmount = nsfwCheck.length
        this.dispatchFile(file)
      })
      this.$store.commit('chat/deleteFiles', this.recipient.address)
    },
  },
})
</script>

<style scoped lang="less" src="./Upload.less"></style>
