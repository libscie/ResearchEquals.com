import { css } from "styled-components"

import { th } from "@pubsweet/ui-toolkit"

/* All styles regarding ProseMirror surface and elements */

const fontWriting = css`
  color: ${th("colorText")};
  font-family: ${th("fontWriting")};
  font-size: ${th("fontSizeBase")};
`

export default css`
  .ProseMirror {
    background: white;
    counter-reset: footnote;
    line-height: 12px;
    width: 497px;
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
    code span::selection title::selection {
      background-color: transparent;
    }

    &:focus {
      outline: none;
    }
  }

  .ProseMirror .wax-selection-marker {
    background-color: ${th("colorSelection")};
  }

  div[contenteditable="false"] {
    pointer-events: none;
    user-select: none;
  }

  .ProseMirror title {
    display: inline;
    font-size: 14px;
  }

  ul,
  ol {
    padding-left: 30px;
  }

  sup,
  sub {
    line-height: 0;
  }

  p {
    line-height: 21px;
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
`
