import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import "./Policy.scss"

export default function Policy({children}: {children: string}) {
    return <div className="policy-wrapper">
        <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
            {children}
        </Markdown>
    </div>

}