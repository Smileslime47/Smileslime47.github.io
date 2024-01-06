import httpService from "~/server/http.ts";

let fileTree:Array<GithubResponse> = []
let fileMap:Map<string,GithubResponse> = new Map()
export const getFileTree = async () => {
    if(fileTree.length!==0){
        return fileTree
    }else if(localStorage.getItem("ArchiveCache")!=null && localStorage.getItem("MapCache")!=null){
        fileTree = JSON.parse(localStorage.getItem("ArchiveCache") as string)
        fileMap = new Map(JSON.parse(localStorage.getItem("MapCache") as string) as Array<any>)//JSON以数组形式存储
    }else{
        await fileTreeInit()
    }
    return fileTree
}

export const getFileMap = async () => {
    await getFileTree()
    return fileMap
}

export const fileTreeInit = async () => {
    await httpService.get(
        "https://api.github.com/repos/Smileslime47/Metion_Archive/contents"
    ).then((response) => {
        fileTree = response.data as Array<GithubResponse>
        fileTree.forEach((content,_)=>{
            fileMap.set(content.path,content)
            traverseContent(content)
        })
        localStorage.setItem("ArchiveCache",JSON.stringify(fileTree))
        localStorage.setItem("MapCache",JSON.stringify([...fileMap]))//Map无法直接序列化
    })
}

const traverseContent = async (parent:GithubResponse) => {
    if(parent.type==="file")return
    parent.contents = []
    await httpService.get(
        parent.url
    ).then((response) => {
        let contents=response.data as Array<GithubResponse>
        contents.forEach((content,_)=>{
            parent.contents.push(content)
            fileMap.set(content.path,content)
            if(content.type==="dir"){
                traverseContent(content)
            }
        })
    })
}
