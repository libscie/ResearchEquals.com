import { atom } from "recoil"
import { recoilPersist } from "recoil-persist"

const { persistAtom } = recoilPersist({ key: "researchequals" })

const workspaceFirstNameAtom = atom({
  key: "workspaceFirstName",
  default: "",
  effects_UNSTABLE: [persistAtom],
})

const workspaceLastNameAtom = atom({
  key: "workspaceLastName",
  default: "",
  effects_UNSTABLE: [persistAtom],
})

const workspaceBioAtom = atom({
  key: "workspaceBio",
  default: "",
  effects_UNSTABLE: [persistAtom],
})

const workspacePronounsAtom = atom({
  key: "workspacePronouns",
  default: "",
  effects_UNSTABLE: [persistAtom],
})

const workspaceUrlAtom = atom({
  key: "workspaceUrl",
  default: "",
  effects_UNSTABLE: [persistAtom],
})

const currentUserAtom = atom({
  key: "currentUser",
  default: "",
  effects_UNSTABLE: [persistAtom],
})

const currentWorkspaceAtom = atom({
  key: "currentWorkspace",
  default: "",
  effects_UNSTABLE: [persistAtom],
})

const draftsAtom = atom({
  key: "drafts",
  default: [],
  effects_UNSTABLE: [persistAtom],
})

const invitationsAtom = atom({
  key: "invitations",
  default: [],
  effects_UNSTABLE: [persistAtom],
})

export {
  workspaceFirstNameAtom,
  workspaceLastNameAtom,
  workspaceBioAtom,
  workspacePronounsAtom,
  workspaceUrlAtom,
  currentUserAtom,
  currentWorkspaceAtom,
  draftsAtom,
  invitationsAtom,
}
