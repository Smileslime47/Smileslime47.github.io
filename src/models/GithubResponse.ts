interface GithubResponse{
    _links:Object,
    download_url:string,
    git_url:string,
    html_url:string,
    name:string,
    path:string,
    sha:string,
    size:number,
    type:string,
    url:string,
    contents:Array<GithubResponse>
}