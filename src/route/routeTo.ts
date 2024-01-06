import router from "./router";

const routeTo = {
    home: () => router.push("/Home"),
    archive: (archive:GithubResponse) => router.push("/Archive/"+archive.path),
}

export default routeTo