import { Node } from "unist"

export interface Text extends Node {
  type: "text"
  value: string
}
