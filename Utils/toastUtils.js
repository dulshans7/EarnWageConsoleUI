import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const { $swal } = useNuxtApp()

export function loginErrorToast() {
    const toast = useToast();
    toast.error("Invalid username or password. Please enter the correct username and the password.", {
        hideProgressBar: true,
    });
}
export function actionSuccess(p) {
    let message = p
    const toast = useToast();
    toast.success(`${message}`, {
        hideProgressBar: true,
    });
}
export function actionError(p) {
    let message = p
    const toast = useToast();
    toast.error(`${message}`, {
        hideProgressBar: true,
    });
}
export function AttactmentFailed(p) {
    let message = p
    const toast = useToast();
    toast.error(`${message}`, {
        hideProgressBar: true,
    });
}
export function onReprocessSuccess(p) {
    let message = p
    const toast = useToast();
    toast.success(`${message}`, {
        hideProgressBar: true,
    });
}
export function onResolveSuccess(p) {
    let message = p
    const toast = useToast();
    toast.success(`${message}`, {
        hideProgressBar: true,
    });
}
export function inValidDataType(p) {
    let message = p
    const toast = useToast();
    toast.error(`${message}`, {
        hideProgressBar: true,
    });
}
export function inValidDataSize(p) {
    let message = p
    const toast = useToast();
    toast.error(`${message}`, {
        hideProgressBar: true,
    });
}
export function AttactmentNameRequired(p) {
    let message = p
    const toast = useToast();
    toast.error(`${message}`, {
        hideProgressBar: true,
    });
}
export function onCommentRequired(p) {
    let message = p
    const toast = useToast();
    toast.error(`${message}`, {
        hideProgressBar: true,
    });
}
export function onReprocessFailed(p) {
    let message = p
    const toast = useToast();
    toast.error(`${message}`, {
        hideProgressBar: true,
    });
}

export function onReprocessFailedNetwork(p) {
    let message = p
    const toast = useToast();
    toast.error(`${message}`, {
        hideProgressBar: true,
    });
}
export function actionSuccessSecUser(p) {
    let message = p
    const toast = useToast();
    toast.success(`${message}`, {
        hideProgressBar: true,
    });
}
//remittance page alerts

//user management alerts
export function approvalSuccess(p) {
    let message = p
    const toast = useToast();
    toast.success(`${message}`, {
        hideProgressBar: true,
    });
}
export function changeSuccess(p, i) {
    let message = p
    const toast = useToast();
    toast.success(`${message}`, {
        hideProgressBar: true,
    });
}
export function changeMemberSuccess(p, i) {
    let message = p
    const toast = useToast();
    toast.success(`${message}`, {
        hideProgressBar: true,
    });
}
export function onSavingApprovalLevel(title,text,btnText){
    Swal.fire({
        title: `${title}`,
        text: `${text}`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `${btnText}`
    }).then((result) => {
        if (result.value) {
            approvalSuccess("Record Successfully Saved !")
        }else{
            console.log("no way")
        }
    })
}

export function onSavingSupportLevel(title,text,btnText){
    Swal.fire({
        title: `${title}`,
        text: `${text}`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `${btnText}`
    }).then((result) => {
        if (result.value) {
            approvalSuccess("Record Successfully Saved !")
        }else{
            console.log("no way")
        }
    })
}

export function onChangeApprover(title,text,btnText,level){
    Swal.fire({
        title: `${title}`,
        text: `${text}`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `${btnText}`
    }).then((result) => {
        if (result.value) {
            changeSuccess(`Approval level ${level} is successfully changed !`)
        }else{
            console.log("no way")
        }
    })
}

export function onChangeMember(title,text,btnText){
    Swal.fire({
        title: `${title}`,
        text: `${text}`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `${btnText}`
    }).then((result) => {
        if (result.value) {
            changeMemberSuccess(`Support team member is successfully changed !`)
        }else{
            console.log("no way")
        }
    })
}

export function onReprocessingAlert(title,text, btnText){
    Swal.fire({
        title: `${title}`,
        text: `${text}`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `${btnText}`
    }).then((result) => {
        if (result.value) {
            changeMemberSuccess(`Support team member is successfully changed !`)
        }else{
            console.log("no way")
        }
    })
}
export function onResendSuccess(p) {
    let message = p
    const toast = useToast();
    toast.success(`${message}`, {
        hideProgressBar: true,
    });
}
