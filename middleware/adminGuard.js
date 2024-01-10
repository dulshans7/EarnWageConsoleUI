import {useLogged, useObject, useUserType} from "~/composables/states";
import {useRouter} from 'vue-router'

export default defineNuxtRouteMiddleware((to, from) => {
    const userLogged = useLogged()
    const userType = useUserType()
    const obj = useObject()
    const router = useRouter()
    if(to.path == "/dashboard" && !userLogged.value){
     //   return navigateTo("/")
      return router.push("/")
    }
    if(to.path == "/usermanagement" && !userLogged.value ){
     //   return navigateTo("/")
        return router.push("/")
    }
    if(to.path == "/remittance" && !userLogged.value && userType == 3 ){
      //  return navigateTo("/")
        return router.push("/")
    }
})
