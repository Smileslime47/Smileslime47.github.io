import httpService from "~/server/http.ts";
import simplify from "~/composables/simplify.ts";

let fileTree:Array<GitSimpleResponse> = []
let fileMap:Map<string,GitSimpleResponse> = new Map()

export const getFileTree = async () => {
    await fileTreeInit()
    return fileTree
}

export const getFileMap = async () => {
    if(fileMap.size!==0){
        return fileMap
    }
    if(fileTree.length===0){
        await getFileTree()
    }
    await fileMapInit()
    return fileMap
}

export const fileMapInit = async (force: boolean = false) => {
    if (fileMap.size !== 0 && !force) {
        return fileMap
    }
    if (fileTree.length === 0) {
        await fileTreeInit()
    }
    fileMap=new Map<string, GithubResponse>()
    fileTree.forEach((rootNode,_)=>{
        traverseTree(rootNode,(node )=>{
            fileMap.set(node.path,node)
        })
    })
}

export const fileTreeInit = async (force:boolean = false) => {
    if(fileTree.length!==0 && !force) {
        //Nothing Happened
    } else if (localStorage.getItem("ArchiveCache") != null && !force) {
        fileTree = JSON.parse(localStorage.getItem("ArchiveCache") as string)
    } else {
        await httpService.get(
            "https://api.github.com/repos/Smileslime47/Metion_Archive/contents"
        ).then((response) => {
            let contents = response.data as Array<GithubResponse>
            contents.forEach((content,_)=>{
                fileTree.push(simplify(content))
            })
            fileTree.forEach((content,_)=>{
                createSubtree(content)
            })
        })
        console.log(fileTree)
        localStorage.setItem("ArchiveCache",JSON.stringify(fileTree))
    }
}

const traverseTree = (treeNode:GitSimpleResponse,action:(treeNode:GitSimpleResponse)=>void) => {
    action(treeNode)
    if(treeNode.type==="file"){
        return
    }
    treeNode.contents.forEach((content,_)=>{
        traverseTree(content,action)
    })
}

const createSubtree = async (parent:GitSimpleResponse) => {
    if(parent.type==="file")return

    parent.contents = []
    await httpService.get(
        parent.url
    ).then((response) => {
        let contents=response.data as Array<GithubResponse>
        contents.forEach((content,_)=>{
            parent.contents.push(simplify(content))
            if(content.type==="dir"){
                createSubtree(content)
            }
        })
    })
}
