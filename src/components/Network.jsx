import { useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";
import { useParams } from 'react-router-dom';

import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { getTnMarkdown, getTrialNetwork } from '../auxFunc/api';
import CreateTN2 from './CreateTN2';
import TopNavigator from './TopNavigator';

function Network() {
  const { id } = useParams();  // We get the `id` parameter from the URL
  const [data, setData] = useState(null);
  const [markdown, setMarkdown] = useState(null);

  useEffect(() => {
    
    const getData = async () => {
        try {
            const response = await getTrialNetwork(id);
            setData(response.data);
            if (response.data.state === "activated") {
              const markdownReq= await getTnMarkdown(id);
              setMarkdown(markdownReq.data);
            };
        } catch (error) {
            console.error(error);
        }
    };
    getData();
  
  }, [id]);

  //TODO: Add the rest of the code here

  return (
      <div>
      {data === null ? (
      //  If it is null, show a loading gif
      <div className="flex justify-center items-center h-full">
        <img src="loading.gif" alt="Loading..." />
      </div>
    ) : data.state === "created" ? (
      // If the state is "created", let edit the content
      <div>
        <CreateTN2 savedValues={data}/>
      </div>
    ) : (
      // If it not "created", show the content
      <div>
        <TopNavigator />
        <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
        <div className="prose lg:prose-xl bg-white p-6 rounded-2xl shadow-lg ">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={atomOneDark}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-gray-200 px-1 rounded-md" {...props}>
                    {children}
                  </code>
                );
              },
              blockquote({ children }) {
                return (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600">
                    {children}
                  </blockquote>
                );
              }
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
      </div>
    )}
    </div>
  );
  
}

export default Network;
