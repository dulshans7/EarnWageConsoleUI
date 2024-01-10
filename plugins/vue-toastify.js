import { ref, onMounted, onUnmounted } from 'vue'
import VueToastify from 'vue-toastify'

export default function useToastify() {
    const toast = ref(null)
    onMounted(() => {
        toast.value = new VueToastify()
    })
    onUnmounted(() => {
        toast.value.destroy()
    })

    return toast
}