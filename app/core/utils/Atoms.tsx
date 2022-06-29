import { atom } from "recoil"
import { recoilPersist } from "recoil-persist"

const { persistAtom } = recoilPersist({ key: "ResearchEquals" })

const workspaceFirstNameAtom = atom({
  key: "workspaceFirstName", // unique ID (with respect to other atoms/selectors)
  default: "",
  effects_UNSTABLE: [persistAtom],
})

const workspaceLastNameAtom = atom({
  key: "workspaceLastName", // unique ID (with respect to other atoms/selectors)
  default: "",
  effects_UNSTABLE: [persistAtom],
})

const workspaceBioAtom = atom({
  key: "workspaceBio", // unique ID (with respect to other atoms/selectors)
  default: "",
  effects_UNSTABLE: [persistAtom],
})

const workspacePronounsAtom = atom({
  key: "workspacePronouns", // unique ID (with respect to other atoms/selectors)
  default: "",
  effects_UNSTABLE: [persistAtom],
})

const workspaceUrlAtom = atom({
  key: "workspaceUrl", // unique ID (with respect to other atoms/selectors)
  default: "",
  effects_UNSTABLE: [persistAtom],
})

export {
  workspaceFirstNameAtom,
  workspaceLastNameAtom,
  workspaceBioAtom,
  workspacePronounsAtom,
  workspaceUrlAtom,
}
