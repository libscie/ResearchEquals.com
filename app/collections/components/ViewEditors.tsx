import Link from "next/link"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"

const EditorCard = ({ editor }) => {
  return (
    <>
      <div className={`flex ${editor.isActive ? "" : "opacity-50"} my-2`}>
        <img src={editor.workspace.avatar} className="mr-2 h-12 w-12 rounded-full" />
        <div className="inline-block flex-grow">
          <Link href={Routes.HandlePage({ handle: editor.workspace.handle })} target="_blank">
            <p className="line-clamp-1">
              {editor.workspace.firstName} {editor.workspace.lastName}
            </p>
            <p className="text-sm">@{editor.workspace.handle}</p>
          </Link>
        </div>
      </div>
    </>
  )
}

const Editors = ({ collection }) => {
  return (
    <div className="my-2 mx-4 xl:mx-0">
      <h3 className="my-4 text-xl">Editor{collection.editors.length > 1 && "s"}</h3>
      <div className="my-4">
        {collection.editors.map((editor) => {
          return (
            <>
              <EditorCard editor={editor} />
            </>
          )
        })}
      </div>
    </div>
  )
}

export default Editors
