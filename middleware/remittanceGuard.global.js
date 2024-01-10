import {useLogged, useObject, useUserType, useUserLevel, useUserRole} from "~/composables/states";

export default defineNuxtRouteMiddleware((to, from) => {
    const userLogged = useLogged()
    const userType = useUserType()
    const userObject = useObject()
    const userLevel = useUserLevel()
    const userRole = useUserRole()
    if(to.path == "/remittance"  && userRole.value !== "3"){
        return navigateTo("/")
    }
    if(to.path == "/dashboard" && userRole.value !== "1"){
       return navigateTo("/")}
  //  if(to.path == "/usermanagement" && userLevel.value !== 1){
    //    return navigateTo("/")}
    if(to.path == "/reports" && userRole.value !== "1"){
        return navigateTo("/")}
})