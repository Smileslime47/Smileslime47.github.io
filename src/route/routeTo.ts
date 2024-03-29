import router from "./router";
import { ElLoading } from 'element-plus'

//切换界面时显示加载过渡
const loadAndTo=((path:string)=>{
    const loadingInstance = ElLoading.service()
    router.push(path).then(() => {
        loadingInstance.close()
    })
})

const routeTo = {
    home: () => loadAndTo("/home"),
    archive: (archive:GitSimpleResponse) => loadAndTo("/Archive/" + archive.path),
}

export default routeTo