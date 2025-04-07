import "highlight.js/styles/atom-one-dark.css";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({content}) => {
return (
    <div className="prose lg:prose-l max-w-none p-4">
        <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        >
        {content}
        </ReactMarkdown>
    </div>
    );
};

export default MarkdownRenderer;


