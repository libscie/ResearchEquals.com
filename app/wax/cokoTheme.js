// import "typeface-fira-sans-condensed"
// import "fontsource-merriweather"
// import "typeface-vollkorn"
// import "typeface-inter"

import { css } from "styled-components"

const cokoTheme = {
  /* Colors */
  colorBackground: "white",
  colorPrimary: "#525E76",
  colorSecondary: "#E7E7E7",
  colorFurniture: "#CCC",
  colorBorder: "#EBEBF0",
  colorBackgroundHue: "#F1F5FF",
  colorBackgroundTabs: "#e1ebff",
  colorSuccess: "#008800",
  colorError: "indianred",
  colorText: "#111",
  colorTextReverse: "#FFF",
  colorTextPlaceholder: "#595959",
  colorWarning: "#ffc107",
  colorBackgroundToolBar: "#fff",
  colorSelection: "#C5D7FE",
  colorBackgroundButton: "#0042C7",
  /* Text variables */

  // fonts
  fontInterface: "Fira Sans Condensed",
  fontHeading: "Fira Sans Condensed",
  fontReading: "Vollkorn",
  fontWriting: "Merriweather",
  fontTools: "Inter",

  // font sizes
  fontSizeBase: "14px",
  fontSizeBaseSmall: "12px",
  fontSizeHeading1: "40px",
  fontSizeHeading2: "36px",
  fontSizeHeading3: "28px",
  fontSizeHeading4: "24px",
  fontSizeHeading5: "20px",
  fontSizeHeading6: "16px",

  // line heights
  lineHeightBase: "24px",
  lineHeightBaseSmall: "16px",
  lineHeightHeading1: "48px",
  lineHeightHeading2: "40px",
  lineHeightHeading3: "32px",
  lineHeightHeading4: "32px",
  lineHeightHeading5: "24px",
  lineHeightHeading6: "24px",

  /* Spacing */
  gridUnit: "4px",

  /* Border */
  borderRadius: "0",
  borderWidth: "1px",
  borderStyle: "solid",

  /* Shadow (for tooltip) */
  boxShadow: "0 2px 4px 0 rgba(51, 51, 51, 0.3)",

  /* Transition */
  transitionDuration: "0.2s",
  transitionTimingFunction: "ease",
  transitionDelay: "0",
  /* Breakpoints */
  breakpoints: [480, 768, 1000, 1272],

  cssOverrides: {
    Wax: {
      MenuButton: css`
        /* color: magenta;

        > svg {
          fill: indianred;
        } */
      `,
    },
  },
}

export default cokoTheme
