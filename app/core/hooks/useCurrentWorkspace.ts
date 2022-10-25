import { useQuery } from "blitz"
import getCurrentWorkspace from "../../workspaces/queries/getCurrentWorkspace"

export type UseCurrentWorkspace = ReturnType<typeof useCurrentWorkspace>

export const useCurrentWorkspace = () => {
  const [workspace] = useQuery(getCurrentWorkspace, null)
  return workspace
}
