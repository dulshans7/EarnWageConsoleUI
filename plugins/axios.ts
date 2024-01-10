import axios from "axios";

export default defineNuxtPlugin(async () => {
    const config = useRuntimeConfig()
    let axiosInstance = axios.create({
        headers : {
            Authorization: config.public.apiKey
        }
    });
    return {
        provide:{
            axios : axiosInstance
        }
    }
});
