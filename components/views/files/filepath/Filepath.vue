<template src="./Filepath.html"></template>
<script lang="ts">
import Vue from 'vue'
import { HomeIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    HomeIcon,
  },
  computed: {
    /**
     * @returns string array of file paths to current directory (not including root)
     */
    path(): string[] {
      return this.$FileSystem.currentDirectoryPath?.slice(1) ?? []
    },
  },
  methods: {
    /**
     * @method goBackToDirectory
     * @description Navigate to specific directory in file system
     * @param string directory name
     */
    goBackToDirectory(dir: string) {
      this.$FileSystem.goBackToDirectory(dir)
    },
  },
})
</script>
<style scoped lang="less" src="./Filepath.less"></style>
