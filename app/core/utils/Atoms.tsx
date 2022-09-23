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

const settingsModalAtom = atom({
  key: "settingsModal",
  default: false,
  effects_UNSTABLE: [persistAtom],
})

const userDiscordAtom = atom({
  key: "userDiscord",
  default: true,
  effects_UNSTABLE: [persistAtom],
})

const emailNotificationsAtom = atom({
  key: "emailNotifications",
  default: {},
  effects_UNSTABLE: [persistAtom],
})

export {
  workspaceFirstNameAtom,
  workspaceLastNameAtom,
  workspaceBioAtom,
  workspacePronounsAtom,
  workspaceUrlAtom,
  settingsModalAtom,
  userDiscordAtom,
  emailNotificationsAtom,
}
