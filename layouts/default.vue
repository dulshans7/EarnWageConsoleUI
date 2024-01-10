<template>
  <div>
    <div id="wrapper">
      <nav id="nav-id1" class="navbar-default navbar-static-side" role="navigation"  style="background-color: #2F4050;transition: 2s ease-out" v-if="onToggle">
        <div class="sidebar-collapse">
          <ul class="nav metismenu" id="side-menu">
            <li class="nav-header">
              <div class="dropdown profile-element" style="color: azure">
                <span> Hi {{ user }} </span>
                <ul class="dropdown-menu animated fadeInRight m-t-xs">
                  <li @click="onLogout"><a class="dropdown-item" href="http://localhost:3000/api/auth/signin">Logout</a></li>
                </ul>
              </div>
              <div class="logo-element"> IN+ </div>
            </li>
            <li v-if="userRole == '1'"> <NuxtLink to="/dashboard" style="text-decoration: none">Dashboard<span class="nav-label"></span></NuxtLink></li>
         <!--   <li v-if="userLevel == 1"> <NuxtLink to="/usermanagement" style="text-decoration: none">User Management<span class="nav-label"></span></NuxtLink></li> -->
            <li v-if="userRole == '3'"> <NuxtLink to="/remittance" style="text-decoration: none">Remittance<span class="nav-label"></span></NuxtLink></li>
            <li v-if="userRole == '1'"> <NuxtLink to="/reports" style="text-decoration: none">Reports <span class="nav-label"></span></NuxtLink></li>
    <!--
            <li v-if="userLevel == 2 || userLevel == 1"> <NuxtLink to="/reports" style="text-decoration: none">Reports <span class="nav-label"></span></NuxtLink></li>
              <li v-if="userLevel == 2 || userLevel == 1"> <NuxtLink to="/dashboard" style="text-decoration: none">Dashboard<span class="nav-label"></span></NuxtLink></li>
       <li v-if="userLevel == 1"> <NuxtLink to="/usermanagement" style="text-decoration: none">User Management<span class="nav-label"></span></NuxtLink></li>
          <li v-if="userLevel == 3"> <NuxtLink to="/remittance" style="text-decoration: none">Remittance<span class="nav-label"></span></NuxtLink></li>
          <li v-if="userLevel == 2 || userLevel == 1"> <NuxtLink to="/reports" style="text-decoration: none">Reports <span class="nav-label"></span></NuxtLink></li>

         --> </ul>
        </div>
      </nav>
      <nav id="nav-id2" class="navbar-default navbar-static-side" role="navigation"  style="background-color: #2F4050;width: 50px" v-if="!onToggle">
        <div class="sidebar-collapse">
          <ul class="nav metismenu" id="side-menu2">
            <li class="nav-header" style="padding: 29px 25px">
              <div class="dropdown profile-element" style="color: azure">
                <span class="t"> Hi </span>
                <ul class="dropdown-menu animated fadeInRight m-t-xs">
                  <li><a class="dropdown-item" @click="logout">Logout</a></li>
                </ul>
              </div>
              <div class="logo-element"> IN+ </div>
            </li>
          </ul>
        </div>
      </nav>
      <div id="page-wrapper" class="gray-bg" style="padding: 0;width:100%">
        <div class="row border-bottom no-printme">
          <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0;width: 99%">
            <div class="navbar-header" style="margin-left: 3%;margin-top: 1%;font-size: 18px;">
              <a class="navbar-minimalize minimalize-styl-2 btn btn-primary" style="margin: 0 !important;font-size:12px" @click="onToggleClick"><i
                  class="fa fa-bars" style="color: white"></i> </a>
            </div>
            <ul class="nav navbar-top-links navbar-right">
              <li> <a @click="logout"> <i class="fa fa-sign-out"></i> Log out </a> </li>
            </ul>
          </nav>
        </div>
        <slot />
        <div class="footer no-printme">
          <div>Copyright @ hSenid Business Solutions &copy; 2004-2023</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "default"
}
</script>
<script setup>
import {useLogged, useUserType, useUser, useUserLevel, useUserRole} from "../composables/states";
import {useRouter} from 'vue-router'
import {onMounted} from "vue";
const router = useRouter()
const userLogged = useLogged()
const userType = useUserType()
const user = useUser()
const userLevel = useUserLevel()
const userRole = useUserRole()
const userName = useUserType()
const onToggle = ref(true)
//session
const { status, data, signIn, signOut } = useAuth()
const logout = () => {
  signOut()
}
const onToggleClick = () => {
  onToggle.value = !onToggle.value
}
const onLogout = () => {
  console.log("logout clicked")
}
onMounted(() => {
  setTimeout(() => {
    onToggleClick();
  },2000)
})

</script>
<style scoped>

</style>