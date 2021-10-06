import { css } from "styled-components"

import { lighten, th } from "@pubsweet/ui-toolkit"

/* All styles regarding ProseMirror surface and elements */

const fontWriting = css`
  font-family: ${th("fontWriting")};
  font-size: ${th("fontSizeBase")};
  color: ${th("colorText")};
`

export default css`
  .ProseMirror {
    background: white;
    counter-reset: footnote;
    line-height: 1.6;
    ${fontWriting}

    p::selection,
    h1::selection,
    h2::selection,
    h3::selection,
    code::selection,
    span::selection,
    p span::selection,
    h1 span::selection,
    h2 span::selection,
    h3 span::selection,
    h4 span::selection,
    code span::selection,
    custom-tag-block::selection,
    custom-tag-inline::selection {
      background-color: transparent;
      color: #000;
    }

    &:focus {
      outline: none;
    }
  }

  .ProseMirror .wax-selection-marker {
    background-color: ${th("colorSelection")};
    opacity: 0.8;
  }

  div[contenteditable="false"] {
    pointer-events: none;
    user-select: none;
  }

  /* .ProseMirror title {
    display: inline;
    font-size: 14px;
  } */

  .ProseMirror footnote {
    font-variant-numeric: lining-nums proportional-nums;
    display: inline-block;
    text-align: center;
    width: 17px;
    height: 17px;
    background: white;
    border-bottom: 2px solid black;
    color: black;
    cursor: pointer;
  }

  .ProseMirror footnote::after {
    content: counter(footnote);
    position: relative;
    bottom: 2px;
    font-size: 16px;
    counter-increment: footnote;
  }

  hr {
    padding: 2px 10px;
    border: none;
    margin: 1em 0;
  }

  hr:after {
    content: "";
    display: block;
    height: 1px;
    background-color: silver;
    line-height: 2px;
  }

  ul,
  ol {
    padding-left: 30px;
  }

  blockquote {
    padding-left: 1em;
    border-left: 3px solid #eee;
    margin-left: 0;
    margin-right: 0;
  }

  figure {
    display: table;
    margin-left: auto;
    margin-right: auto;
    word-break: break-word;

    img {
      cursor: default;
      height: auto;
      max-width: 100%;
      width: auto;
    }

    figcaption {
      background: #e2ebff;
      caption-side: bottom;
      display: table-caption;
      max-width: 100%;
      min-height: 20px;
      padding: 4px;
      width: auto;

      &:focus {
        outline: none;
      }
      &:before {
        content: "Caption: ";
        font-weight: bold;
      }
    }
  }

  sup,
  sub {
    line-height: 0;
  }

  strong {
    font-weight: bold;
  }

  /* Tables */

  table {
    border-collapse: initial;
    border-spacing: 0;
    border-width: 0 thin thin 0;
    border: 1px solid #eee;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;
    page-break-inside: avoid;
  }

  th,
  td {
    border: 1px solid #eee;
    /*width: 200px;*/
    padding: 2px 5px;
    vertical-align: top;
    box-sizing: border-box;
    position: relative;
  }

  .tableWrapper {
    overflow-x: auto;
  }

  .column-resize-handle {
    position: absolute;
    right: -2px;
    top: 0;
    bottom: 0;
    width: 4px;
    z-index: 20;
    background-color: #adf;
    pointer-events: none;
  }

  .ProseMirror.resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
  }
  /* Give selected cells a blue overlay */
  .selectedCell:after {
    z-index: 2;
    position: absolute;
    content: "";
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(200, 200, 255, 0.4);
    pointer-events: none;
  }

  /* placeholder */
  .empty-node::before {
    color: #aaa;
    float: left;
    font-style: italic;
    pointer-events: none;
    height: 0;
  }

  p.empty-node:first-child::before {
    content: attr(data-content);
  }

  /* invisible characters */
  .invisible {
    pointer-events: none;
    user-select: none;
  }

  .invisible:before {
    caret-color: inherit;
    color: gray;
    display: inline-block;
    font-weight: 400;
    font-style: normal;
    line-height: 1em;
    width: 0;
  }

  .invisible--space:before {
    content: "·";
  }

  .invisible--break:before {
    content: "¬";
  }

  .invisible--par:after {
    content: "¶";
  }

  span.deletion {
    text-decoration: line-through;
    color: ${th("colorError")};
    footnote {
      background: ${th("colorError")};
    }
  }

  span.insertion {
    color: royalblue;
    footnote {
      background: royalblue;
    }
  }

  .selected-insertion {
    background: ${lighten("royalblue", 0.65)};
  }

  .selected-deletion {
    background: ${lighten("indianred", 0.65)};
  }

  .selected-format-change,
  .selected-block-change {
    background-color: #eefbfb;
  }

  .format-change {
    border-bottom: 2px solid royalblue;
  }

  [data-track] {
    position: relative;
  }

  [data-track]::before {
    content: "";
    position: absolute;
    border-left: 2px solid royalblue;
    left: -10px;
    height: 100%;
  }

  .insertion .show-insertion {
    color: black;
  }

  .deletion .hide-deletion {
    display: none;
  }

  li[data-track]::before,
  li [data-track]::before {
    left: -5px;
  }

  span.comment {
    border-bottom: 2px solid gold;
    border-radius: 3px 3px 0 0;

    .active-comment {
      background-color: gold;
      /* color: black; */
    }
  }

  span.search-result {
    background: #bee594;
  }

  /* == Math Nodes ======================================== */

  .math-node {
    min-width: 1em;
    min-height: 1em;
    font-size: 0.95em;
    font-family: "Consolas", "Ubuntu Mono", monospace;
    cursor: auto;
    .ProseMirror {
      box-shadow: none;
      min-height: 100%;
      padding: 0;
      background: #eee;
      color: rgb(132, 33, 162);
    }
  }

  .math-node.empty-math .math-render::before {
    content: "(empty)";
    color: red;
  }

  .math-node .math-render.parse-error::before {
    content: "(math error)";
    color: red;
    cursor: help;
  }

  .math-node.ProseMirror-selectednode {
    outline: none;
  }

  .math-node .math-src {
    display: none;
    color: rgb(132, 33, 162);
    tab-size: 4;
  }

  .math-node.ProseMirror-selectednode .math-src {
    display: flex;
  }
  .math-node.ProseMirror-selectednode .math-render {
    display: none;
  }

  /* -- Inline Math --------------------------------------- */

  math-inline {
    display: inline;
    white-space: nowrap;
  }

  math-inline .math-render {
    display: inline-block;
    font-size: 0.85em;
    cursor: pointer;
  }

  math-inline .math-src .ProseMirror {
    display: inline;
  }

  math-inline .math-src::after,
  math-inline .math-src::before {
    content: "$";
    color: #b0b0b0;
  }

  /* -- Block Math ---------------------------------------- */

  math-display {
    display: block;
  }

  math-display .math-render {
    display: block;
  }

  math-display.ProseMirror-selectednode {
    background-color: #eee;
  }

  math-display .math-src .ProseMirror {
    width: 100%;
    display: block;
  }

  math-display .math-src::after,
  math-display .math-src::before {
    content: "$$";
    text-align: left;
    color: #b0b0b0;
  }

  math-display .katex-display {
    margin: 0;
  }

  /* -- Selection Plugin ---------------------------------- */

  p::selection,
  p > *::selection {
    background-color: #c0c0c0;
  }
  .katex-html *::selection {
    background-color: none !important;
  }

  .math-node.math-select .math-render {
    background-color: #c0c0c0ff;
  }
  math-inline.math-select .math-render {
    padding-top: 2px;
  }

  span[data-type="inline"] {
    display: inline;
    font-weight: 500;
  }

  span[data-type="inline"]:before {
    color: #006f19;
    content: " | ";
    font-weight: 600;
    margin-left: 0;
  }

  span[data-type="inline"]:after {
    color: #006f19;
    content: " | ";
    display: inline;
    font-weight: 600;
  }

  p[data-type="block"] {
    display: block;
    margin-top: 1em;
  }

  p[data-type="block"]:before {
    color: #006f19;
    content: "⌜";
    display: inline;
    font-weight: 600;
    font-size: 22px;
    position: relative;
    top: 2px;
    left: 6px;
  }

  p[data-type="block"]:after {
    color: #006f19;
    content: "⌟";
    display: inline;
    font-weight: 600;
    font-size: 22px;
    position: relative;
    top: 5px;
    right: 6px;
  }

  .transform-icon {
    transform: rotate(40deg);
  }
`
