<template>
  <div class="popover" v-show="visible" @click.self="hidePopover">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Popover"
}
</script>
<script setup>
import { ref } from 'vue';
const visible = ref(false)
const hidePopover = () => {
  visible.value = false
}
</script>
<style scoped>
.popover {
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
}
</style>