import { Viewer, Worker } from "@react-pdf-viewer/core"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { prism, a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { useMediaPredicate } from "react-media-hook"

import "@react-pdf-viewer/core/lib/styles/index.css"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css" // `rehype-katex` does not import the CSS for you
import { useEffect, useState } from "react"
import Image from "next/image"

const PDFJS_DIST_VERSION = process.env.PDFJS_DIST_VERSION

const MainFileViewer = ({ mainFile, module }) => {
  const prefersDarkMode = useMediaPredicate("(prefers-color-scheme: dark)")
  const [mainFileMarkdown, setMarkdown] = useState("")
  const isMarkdown = mainFile.mimeType.startsWith("text/markdown") || mainFile.name.endsWith(".md")

  useEffect(() => {
    if (isMarkdown) {
      fetch(mainFile.cdnUrl)
        .then((response) => response.text())
        .then((body) => setMarkdown(body))
        .catch((error) => {
          console.log(error.message)
        })
    }
  }, [])

  return (
    <>
      {mainFile.name && (
        <>
          {/* Preview image */}
          {mainFile.isImage && (
            <Image
              alt="The main image for the module"
              src={mainFile.cdnUrl}
              className="mx-auto my-2 h-auto w-full"
              width={mainFile?.originalImageInfo?.width || 300}
              height={mainFile?.originalImageInfo?.height || 300}
            />
          )}
          {/* Preview PDF */}
          {mainFile.mimeType.startsWith("application/pdf") && (
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@${PDFJS_DIST_VERSION}/build/pdf.worker.min.js`}
            >
              <div style={{ height: "750px" }} className="max-w-screen text-gray-900">
                <Viewer fileUrl={mainFile.cdnUrl} />
              </div>
            </Worker>
          )}
          {/* Preview Markdown */}
          {isMarkdown && (
            <div className="coc">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                linkTarget="_blank"
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "")
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={prefersDarkMode ? a11yDark : prism}
                        language={match[1]}
                        PreTag="div"
                        class="coc"
                        customStyle={{
                          backgroundColor: prefersDarkMode ? "#374151" : "#f3f4f6",
                          padding: "0",
                          margin: "0",
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {mainFileMarkdown}
              </ReactMarkdown>
            </div>
          )}
          {/* Preview Office files */}
          {(mainFile.mimeType.startsWith("application/vnd.ms-excel") ||
            mainFile.mimeType.startsWith(
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ) ||
            mainFile.mimeType.startsWith(
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) ||
            mainFile.mimeType.startsWith(
              "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            )) && (
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${mainFile.cdnUrl}`}
              width="100%"
              height="800px"
              frameBorder="0"
            ></iframe>
          )}
          {mainFile.mimeType.startsWith("audio/") && (
            <audio
              controls
              src={mainFile.cdnUrl}
              preload="metadata"
              className="mx-auto w-full"
            ></audio>
          )}
        </>
      )}
    </>
  )
}

export default MainFileViewer
