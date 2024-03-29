import axios, {AxiosInstance} from "axios";
import Constant from "~/global/Constant.ts";

export const getFileContent = async (path:string) => {
    let res = "N/A"
    await httpService.get(
        Constant.RAW_URL+Constant.REPO_URL+"/main/"+path
    ).then((response)=>{
        res = response.data
    })
    return res
}

const httpService:AxiosInstance = axios.create({
    timeout: 10000,              //超时配置
    withCredentials: false,      //跨域携带cookie
})

httpService.interceptors.request.use(
    //发生请求拦截
    (config) => {
        // 如果开启 token 认证
        config.headers["Authorization"] = Constant.AUTH_TOKEN; // 请求头携带 token

        // // 设置请求头
        // if (!config.headers["content-type"]) { // 如果没有设置请求头
        //     if (config.method === 'post') {
        //         config.headers["content-type"] = "application/json"; // 默认类型
        //         // config.data = qs.stringify(config.data); // 序列化,比如表单数据
        //     } else {
        //         config.headers["content-type"] = "application/x-www-form-urlencoded"; // post 请求
        //     }
        // }
        return config;
    },
    //请求错误拦截
    (error) => {
        Promise.reject(error)
    }
);

httpService.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 超出 2xx 范围的状态码都会触发该函数。
        return Promise.reject(error);
    }
);

export default httpService