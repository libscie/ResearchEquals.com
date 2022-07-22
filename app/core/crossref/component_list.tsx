import { Element } from "xast"

export interface ComponentList extends Element {
  name: "component_list"
}
const component_list = (): ComponentList => {
  const js: ComponentList = {
    type: "element",
    name: "component_list",
    children: [],
  }

  return js
}

export default component_list
