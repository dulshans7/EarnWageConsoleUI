<template>
  <div>

  </div>
  <!--
  <div class="main-wrapper h-100">
    <div class="login-container h-100">
      <div class="container-fluid h-100">
        <div class="row">
        </div>
        <div class="row" style="margin-top:5%">
          <div class="col-md-6">
            <div class="intro-contents">
              <h1>Earned Wage Access Console</h1>
              <p class="welcome-text">Welcome to Earned Wage Access Console! </p>
              <p class="sub-title" style="text-align: justify;">The Earned Wage Access Console provides an option to individuals access their earned wages prior to the scheduled payday. The employees will be granted the facility to request a share of their earned wages. This will provide the
                flexibility to the Employees to
                manage their financial needs during urgent situations.</p>
            </div>
          </div>
          <div class="col-md-6 align-self-center" style="margin-top: 2.5rem;">
            <div class="login-block ms-auto">
              <div class="title">
                Sign in
              </div>
              <form>
                <div class="row input-field">
                  <label class="col-md-12 input-label">Username</label>
                  <div class="col-md-12 input-box">
                    <input v-model="username" class="form-control" placeholder="Username" type="text">
                  </div>
                </div>
                <div class="row input-field">
                  <label class="col-md-12 input-label">Password</label>
                  <div class="col-md-12 input-box"><input v-model="password" class="form-control"
                                                          placeholder="Your password" type="password"></div>
                </div>
                <div class="row input-field">
                  <div class="col-md-12">
                    <button class="btn btn-primary btn-xlarge" @click="loginAPI">Login</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  -->
</template>
<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  components: {
    VueDatePicker,
  },
  data: () => {
    return {
      value: '',
      date_today: new Date()
    }
  },
  methods: {
    login: (e) => {
      event.preventDefault(e)
      this.$router.push('/dashboard');
    }
  }
}
</script>
<script setup>
import CryptoJS from 'crypto-js';
import * as Api from "@/constants/constants";
import {useRouter} from 'vue-router'
import {ENCRYPT_DATA, FETCH_TRANSACTIONS, GET_LOGIN_DETAILS, GET_USER} from "../constants/constants";
import {useLogged, useUserId, useUserLevel, useUserType, useUser, useObject, useUserRole} from "../composables/states";
import {loginErrorToast} from "../Utils/toastUtils";


definePageMeta({
  layout: 'custom-layout'
})
const runtimeConfig = useRuntimeConfig();
//const {status, data, signIn, signOut} = useAuth()
const axios = useNuxtApp().$axios
const swal = useNuxtApp().swal
const router = useRouter()
const userId = useUserId()
const userLevel = useUserLevel()
const userRole = useUserRole()
const userLogged = useLogged()
const userType = useUserType()
const user = useUser()
const userObject = useObject()


const encryptKey = 'EEAB17991315B2C515BC31D81C61717B'
const display_name = ref("")
const username = ref("")
const role = ref(0)
const display_name_short = ref("")
const full_name = ref("")
let encryptedPassword = ref("")
const { session, refresh, update, reset } = await useSession()

onMounted(() => {
  fetchUser()
})
const fetchUser = () => {
  try {
    axios.get(Api.GET_USER)
        .then(response => {
          username.value = response.data.user.email
          display_name.value = response.data.user.name
          role.value = response.data.role
          userRole.value = role.value
        })
        .then(() => {
          full_name.value = display_name.value.split(' ')
          useUser().value = full_name.value[0]
          loginDetailsAD()
        })
  } catch (error) {
    console.log("error", error)
  }
}
const loginDetails = () => {
  try {
    const postData = {
      "user_name": username.value,
      "password": 'rqZ8iG1gBeLWTGDIpeI+pA=='
    };
    axios.post(Api.GET_LOGIN_DETAILS, postData)
        .then(response => {
          if (response.status == 203) {
            userLogged.value = false
            loginErrorToast()
          } else {
            userType.value = response.data.user_type
            userId.value = response.data.user_id
            userLevel.value = response.data.user_level
            user.value = response.data.user_display_name
            useObject().value = {
              id: response.data.user_id,
              level: response.data.user_level,
              isLogged: true,
              type: response.data.user_type
            }
            useLogged().value = true
            useUserType().value = response.data.user_type
            userType.value = useUserType().value
            switch (useObject().value.type) {
              case 1:
                router.push('/dashboard')
                break;
              case 2:
                router.push('/usermanagement')
                break;
              case 3:
                router.push('/remittance')
                break;
            }
          }
        })
  } catch (error) {
    console.log("error", error)
  }
}
const loginDetailsAD = () => {
  try {
    const postData = {
      "user_name": username.value,
      "display_name": display_name.value,
      "role_id": role.value,
    };
    axios.post(Api.GET_LOGIN_DETAILSAD, postData)
        .then(response => {
          if (response.status == 203) {
            userLogged.value = false
            loginErrorToast()
          } else {
            userId.value = response.data.user_id
            userLevel.value = response.data.user_level
            useObject().value = {id: response.data.user_id, level: response.data.user_level, isLogged: true}
            useLogged().value = true
            switch (userRole.value) {
              case "1":
                router.push('/dashboard')
                break;
            //  case 1:
              //  router.push('/usermanagement')
                //break;
              case "3":
                router.push('/remittance')
                break;
            }
          }
        })
  } catch (error) {
    console.log("error", error)
  }
}
const loginAPI = (e) => {
  // event.preventDefault(e)
  encrypt()
}
const encryptPassword = (password, key) => {
  const ciphertext = CryptoJS.AES.encrypt(password, key).toString();
  return ciphertext;
}
const encrypt = () => {
  try {
    const postData = {
      // "content": password.value
      "content": 'abc123@@@'
    };
    axios.post(Api.ENCRYPT_DATA, postData)
        .then(response => {
          encryptedPassword.value = response.data.data
          loginDetails()
        })
  } catch (error) {
    console.log("error", error)
  }
}

</script>
<style scoped>
.links {
  color: blue;
  font-size: 1.5rem;
}

.branding .logo {
  width: 100%;
  max-width: 20rem;
}

.branding {
  background-color: transparent !important;
}

.intro-contents {
  width: 100% !important;
  max-width: 42.5rem !important;
  padding-left: 5rem !important;
  position: relative !important;
}

.intro-contents h1 {
  font-size: 4.375rem !important;
  font-weight: 600 !important;
  color: #33456d !important;
  font-family: "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, "Noto Sans",
  "Liberation Sans",
  sans-serif,
  "Apple Color Emoji",
  "Segoe UI Emoji",
  "Segoe UI Symbol",
  "Noto Color Emoji";
}

.intro-contents p.welcome-text {
  color: #33456d;
  font-weight: 500;
  margin: 1.875rem 0;
}

.intro-contents p.welcome-text {
  color: #33456d;
  font-weight: 500;
  margin: 1.875rem 0;
  font-size: 1.3125rem;
}

.intro-contents p {
  font-size: 1.3125rem;
  color: #788593;
}

.align-self-center {
  align-self: center !important;
}

.login-block {
  border-radius: 50px;
  background-color: #fff;
  padding: 3.125rem;
  width: 60%;
  max-width: 38.75rem;
  margin-inline-start: inherit !important;
  margin-left: 5rem !important;
}

.login-block .title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2.5rem;
  line-height: .7;
}

.login-block .input-field {
  margin-bottom: 1.25rem;
  font-size: 1.125rem;
}

.login-block .input-field .form-control, .login-block .input-field .btn {
  height: 3.75rem;
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  font-size: 1.125rem;
  font-weight: 300;
}

</style>

