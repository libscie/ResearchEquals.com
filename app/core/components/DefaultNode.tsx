import Link from "next/link";
import { Routes } from "@blitzjs/next";
import React, { memo } from "react"
import { Handle, NodeProps, Position } from "react-flow-renderer"
import { Launch } from "@carbon/icons-react"

// https://github.com/wbkd/react-flow/blob/main/src/components/Nodes/DefaultNode.tsx
const DefaultNode = ({
  data,
  isConnectable,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,
}: NodeProps) => (
  <>
    <Handle
      type="target"
      position={targetPosition}
      isConnectable={false}
      style={{ backgroundColor: data?.module.displayColor }}
    />
    <div
      className="module-medium flex h-auto max-w-[150px] bg-red-500 p-[10px] text-sm text-white"
      style={{ backgroundColor: data?.module.displayColor, fontSize: "12px" }}
    >
      {`${data?.module.title.substr(0, 30)} ${data?.module.title.length > 30 ? "[...]" : ""}`}
      <div>
        <span className="inline-block h-full align-middle"> </span>
        <Link
          href={
            data?.module.publishedWhere === "ResearchEquals"
              ? Routes.ModulePage({ suffix: data?.module.suffix })
              : `https://doi.org/${data?.module.prefix}/${data?.module.suffix}`
          }
        >
          <a target="_blank" rel="noreferrer" className="ml-2 inline-block align-middle">
            <Launch size={16} />
          </a>
        </Link>
      </div>
    </div>
    <Handle
      type="source"
      position={sourcePosition}
      isConnectable={false}
      style={{ backgroundColor: data?.module.displayColor }}
    />
  </>
)

DefaultNode.displayName = "DefaultNode"

export default memo(DefaultNode)
