const simplify = (response:GithubResponse) => {
    return {
        name: response.name,
        path: response.path,
        sha: response.sha,
        type: response.type,
        url: response.url,
        html_url: response.html_url,
        contents: []
    } as GitSimpleResponse
}
export default simplify