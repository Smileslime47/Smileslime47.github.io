import {decode} from "@msgpack/msgpack"
import axios from "axios";
import Constant from "~/global/Constant.ts";


let fileTree:Array<GitSimpleResponse> = []
let fileMap:Map<string,GitSimpleResponse> = new Map()

export const getFileTree = async () => {
    if(fileTree.length===0){
        await fileTreeInit()
    }
    console.log("tree")
    console.log(fileTree)
    return fileTree
}

export const getFileMap = async () => {
    if(fileMap.size===0){
        await fileMapInit()
    }
    return fileMap
}

export const fileTreeInit = async (force:boolean=false)=>{
    if (fileTree.length !== 0 && !force) {
        return
    }
    await axios.get(
        Constant.RAW_URL+Constant.REPO_URL+Constant.TREE_URL,
        {
            responseType:"arraybuffer"
        }
    ).then((encodedTree)=>{
        let buffer:ArrayBuffer = encodedTree.data
        let uInt8 = new Uint8Array(buffer)
        console.log(uInt8)
        fileTree = decode(encodedTree.data) as GitSimpleResponse[]
        console.log(fileTree)
    })
}

export const fileMapInit = async (force: boolean = false) => {
    if (fileMap.size !== 0 && !force) {
        return
    }
    if (fileTree.length === 0) {
        await fileTreeInit()
    }
    fileMap=new Map<string, GitSimpleResponse>()
    fileTree.forEach((rootNode,_)=>{
        traverseTree(rootNode,(node )=>{
            fileMap.set(node.path,node)
        })
    })
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