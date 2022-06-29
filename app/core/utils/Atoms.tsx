import { atom } from "recoil"
import { recoilPersist } from "recoil-persist"

const { persistAtom } = recoilPersist({ key: "ResearchEquals" })

const workspaceFirstNameAtom = atom({
  key: "workspaceFirstName", // unique ID (with respect to other atoms/selectors)
  default: "",
  effects_UNSTABLE: [persistAtom],
})

export { workspaceFirstNameAtom }
