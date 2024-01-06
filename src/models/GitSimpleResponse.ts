interface GitSimpleResponse{
    name:string,        //内容名
    path:string,        //路径
    sha:string,         //SHA
    type:string,        //内容类型
    url:string,         //API网址
    html_url:string,    //浏览器网址
    contents:Array<GitSimpleResponse>
}