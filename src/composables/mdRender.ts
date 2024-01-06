import MarkDownIt from "markdown-it";
import hljs from "markdown-it-highlightjs";
import mathjax from "markdown-it-mathjax3";
const mdRender = (content: string) => {
    return MarkDownIt()
        //代码高亮
        .use(hljs, {inline: true})
        //Mathjax公式
        .use(mathjax)
        .render(content)
}

export default mdRender