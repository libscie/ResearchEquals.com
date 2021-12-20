import React from "react"

const InstaLayout = ({ editor }) => (
  <div className="flex">
    <div className="flex-grow max-h-96">
      <div>{editor}</div>
    </div>
  </div>
)

export default InstaLayout
