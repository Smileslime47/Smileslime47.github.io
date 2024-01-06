console.log("hello")

import httpService from "../server/http.ts";
import simplify from "../composables/simplify.ts";

let fileTree = []

const createSubtree = async (parent) => {
    if(parent.type==="file")return

    parent.contents = []
    await httpService.get(
        parent.url
    ).then((response) => {
        let contents=response.data
        contents.forEach((content,_)=>{
            parent.contents.push(simplify(content))
            if(content.type==="dir"){
                createSubtree(content)
            }
        })
    })
}


await httpService.get(
    "https://api.github.com/repos/Smileslime47/Metion_Archive/contents"
).then((response) => {
    let contents = response.data
    contents.forEach((content,_)=>{
        fileTree.push(simplify(content))
    })
    fileTree.forEach((content,_)=>{
        createSubtree(content)
    })
})

let json = JSON.stringify(fileTree)

console.log(json)