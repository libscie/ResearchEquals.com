import Link from "next/link"
import { useMutation } from "@blitzjs/rpc"
import changeBio from "app/workspaces/mutations/changeBio"
import changePronouns from "app/workspaces/mutations/changePronouns"
import changeUrl from "app/workspaces/mutations/changeUrl"
import { useFormik } from "formik"
import { z } from "zod"
import { Checkmark, Close, TrashCan } from "@carbon/icons-react"
import toast from "react-hot-toast"
import { useRecoilState, useResetRecoilState } from "recoil"

import changeLastName from "../../workspaces/mutations/changeLastName"
import changeFirstName from "../../workspaces/mutations/changeFirstName"
import {
  workspaceFirstNameAtom,
  workspaceLastNameAtom,
  workspaceBioAtom,
  workspacePronounsAtom,
  workspaceUrlAtom,
} from "../utils/Atoms"
import { useEffect, useState } from "react"
import { validateZodSchema } from "blitz"
import Autocomplete from "./Autocomplete"
import axios from "axios"
import SearchResultAffiliation from "./SearchResultAffiliation"
import addAffiliation from "../../workspaces/mutations/addAffiliation"
import { Affiliation } from "@prisma/client"
import deleteAffiliation from "../../workspaces/mutations/deleteAffiliation"

const WorkspaceSettings = ({ workspace, setIsOpen }) => {
  const [changeFirstNameMutation] = useMutation(changeFirstName)
  const [changeLastNameMutation] = useMutation(changeLastName)
  const [addAffiliationMutation] = useMutation(addAffiliation)
  const [changeBioMutation] = useMutation(changeBio)
  const [changePronounsMutation] = useMutation(changePronouns)
  const [changeUrlMutation] = useMutation(changeUrl)
  const [deleteAffiliationMutation] = useMutation(deleteAffiliation)

  // State management
  const [workspaceFirstName, setWorkspaceFirstName] = useRecoilState(workspaceFirstNameAtom)
  const resetFirstName = useResetRecoilState(workspaceFirstNameAtom)
  const [workspaceLastName, setWorkspaceLastName] = useRecoilState(workspaceLastNameAtom)
  const resetLastName = useResetRecoilState(workspaceLastNameAtom)
  const [workspaceBio, setWorkspaceBio] = useRecoilState(workspaceBioAtom)
  const resetBio = useResetRecoilState(workspaceBioAtom)
  const [workspacePronouns, setWorkspacePronouns] = useRecoilState(workspacePronounsAtom)
  const resetPronouns = useResetRecoilState(workspacePronounsAtom)
  const [workspaceUrl, setWorkspaceUrl] = useRecoilState(workspaceUrlAtom)
  const resetUrl = useResetRecoilState(workspaceUrlAtom)
  const [affiliations, setAffiliations] = useState([] as Affiliation[])

  useEffect(() => {
    if (workspaceFirstName === "") {
      setWorkspaceFirstName(workspace.firstName)
    }
    if (workspaceLastName === "") {
      setWorkspaceLastName(workspace.lastName)
    }
    if (workspaceBio === "") {
      setWorkspaceBio(workspace.bio)
    }
    if (workspacePronouns === "") {
      setWorkspacePronouns(workspace.pronouns)
    }
    if (workspaceUrl === "") {
      setWorkspaceUrl(workspace.url)
    }
    if (JSON.stringify(affiliations) === "[]") {
      setAffiliations(workspace.affiliations)
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      firstName: workspaceFirstName,
      lastName: workspaceLastName,
      bio: workspaceBio,
      pronouns: workspacePronouns,
      profileUrl: workspaceUrl,
    },
    enableReinitialize: true,
    validate: validateZodSchema(
      z.object({
        firstName: z.any(),
        lastName: z.any(),
        bio: z.any(),
        pronouns: z.any(),
        profileUrl: z.any(),
      })
    ),
    onSubmit: async (values) => {
      try {
        if (values.firstName !== workspace.firstName) {
          try {
            z.string().parse(values.firstName)
            await toast.promise(
              changeFirstNameMutation({
                firstName: values.firstName,
              }),
              {
                loading: "Saving...",
                success: "Updated first name",
                error: "Hmm that first name didn't work...",
              }
            )
          } catch (error) {
            toast.error("First name needs to be a string")
          }
        }

        if (values.lastName !== workspace.lastName) {
          try {
            z.string().parse(values.lastName)
            await toast.promise(
              changeLastNameMutation({
                lastName: values.lastName,
              }),
              {
                loading: "Saving...",
                success: "Updated last name",
                error: "Hmm that Fdidn't work...",
              }
            )
          } catch (error) {
            toast.error("Last name needs to be a string")
          }
        }

        if (values.bio !== workspace.bio) {
          try {
            z.string().parse(values.bio)
            await toast.promise(
              changeBioMutation({
                bio: values.bio,
              }),
              {
                loading: "Saving...",
                success: "Updated bio",
                error: "Hmm that didn't work...",
              }
            )
          } catch (error) {
            toast.error("Bio needs to be a string")
          }
        }

        if (values.pronouns !== workspace.pronouns) {
          try {
            z.string().max(20).parse(values.pronouns)
            await toast.promise(
              changePronounsMutation({
                pronouns: values.pronouns,
              }),
              {
                loading: "Saving...",
                success: "Updated pronouns",
                error: "Hmm that didn't work...",
              }
            )
          } catch (error) {
            toast.error("Pronouns can be 20 characters")
          }
        }

        if (values.profileUrl !== workspace.url && values.profileUrl !== "") {
          try {
            z.string().url().parse(values.profileUrl)
            await toast.promise(
              changeUrlMutation({
                url: values.profileUrl,
              }),
              {
                loading: "Saving...",
                success: "Updated URL",
                error: (e) => {
                  return `Error: ${e}`
                },
              }
            )
          } catch (error) {
            toast.error("Enter a valid URL")
          }
        }

        setIsOpen(false)
        // TODO: Add remove Url mutation when empty
      } catch (error) {
        alert(error.toString())
      }
    },
  })

  return (
    <>
      <div className="my-4 flex p-2">
        <div>
          <img
            src={workspace!.avatar}
            width={120}
            height={120}
            className="max-w-14 h-14 max-h-14 w-14 rounded-full"
          />
        </div>
        <div className="ml-2 flex-grow text-gray-900 dark:text-gray-200">
          <span className="inline-block h-full align-middle"> </span>
          <p className="inline-block align-middle">
            {!workspace!.orcid ? (
              <Link href="/api/auth/orcid" legacyBehavior>
                <button className="mb-1 flex rounded-md bg-emerald-50 py-2 px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-emerald-500 dark:hover:border-gray-400 dark:hover:bg-gray-700">
                  Connect your ORCID
                </button>
              </Link>
            ) : (
              <>
                <p className="text-sm font-medium">{workspace!.name}</p>
                <p className="flex text-sm font-medium">{workspace!.orcid}</p>
              </>
            )}
            <p className="text-sm font-normal leading-4">@{workspace.handle}</p>
          </p>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="my-4 px-2 text-gray-900 dark:text-gray-200">
          <label htmlFor="firstName" className="my-1 block text-sm font-medium">
            Author First Name{" "}
            {formik.touched.firstName && formik.errors.firstName
              ? " - " + formik.errors.firstName
              : null}
          </label>
          <div className="mt-1 text-gray-900 dark:text-gray-200">
            <input
              id="firstName"
              type="firstName"
              autoComplete="firstName"
              className="placeholder-font-normal block w-11/12 appearance-none rounded border border-gray-300 bg-transparent px-3 py-2 text-sm font-normal placeholder-gray-400 focus:border-indigo-500 focus:outline-none  focus:ring-indigo-500 dark:border-gray-600 "
              defaultValue={workspaceFirstName}
              onChange={(data) => {
                setWorkspaceFirstName(data.target.value)
              }}
            />
          </div>
        </div>
        <div className="my-4 px-2 text-gray-900 dark:text-gray-200">
          <label htmlFor="lastName" className="my-1 block text-sm font-medium">
            Author Last Name{" "}
            {formik.touched.lastName && formik.errors.lastName
              ? " - " + formik.errors.lastName
              : null}
          </label>
          <div className="mt-1 text-gray-900 dark:text-gray-200">
            <input
              id="lastName"
              type="lastName"
              autoComplete="lastName"
              className="placeholder-font-normal block w-11/12 appearance-none rounded border border-gray-300 bg-transparent px-3 py-2 text-sm font-normal placeholder-gray-400 focus:border-indigo-500 focus:outline-none  focus:ring-indigo-500 dark:border-gray-600 "
              defaultValue={workspaceLastName}
              onChange={(data) => {
                setWorkspaceLastName(data.target.value)
              }}
            />
          </div>
        </div>
        <div className="my-4 px-2 text-gray-900 dark:text-gray-200">
          <label htmlFor="affiliation" className="my-1 block text-sm font-medium">
            Affiliation{" "}
            {formik.touched.affiliation && formik.errors.affiliation
              ? " - " + formik.errors.affiliation
              : null}
          </label>
          <div className="mt-1 w-11/12 text-sm  font-normal text-gray-900 dark:text-gray-200">
            {JSON.stringify(affiliations) != "[]" ? (
              <>
                {affiliations.map((affiliation) => {
                  if (!!affiliation["organization"]) {
                    return (
                      <div
                        className="my-1 flex px-2 text-gray-900 dark:text-gray-200"
                        key={affiliation["id"]}
                      >
                        <p className="my-1 block flex-grow text-sm font-medium">
                          {affiliation["organization"].name}
                        </p>
                        <p className="flex">
                          <TrashCan
                            size={24}
                            className="inline-block h-6 w-6 fill-current align-middle text-red-500"
                            onClick={async () => {
                              await toast.promise(
                                deleteAffiliationMutation({
                                  affiliationId: affiliation["id"],
                                  workspaceId: workspace.id,
                                }),
                                {
                                  loading: "Deleting affiliation...",
                                  success: (res) => {
                                    setAffiliations(res as Affiliation[])

                                    return "Affiliation deleted!"
                                  },
                                  error: "Failed to delete affiliation...",
                                }
                              )
                            }}
                            aria-label="Delete file"
                          />
                        </p>
                      </div>
                    )
                  }
                })}
              </>
            ) : (
              <Autocomplete
                className="h-full"
                // openOnFocus={true}
                defaultActiveItemId="0"
                getSources={({ query }) => [
                  {
                    sourceId: "products",
                    async onSelect(params) {
                      await toast.promise(
                        addAffiliationMutation({
                          workspaceId: workspace.id,
                          rorId: params.item.id,
                          orgName: params.item.name,
                        }),
                        {
                          loading: "Adding affiliation...",
                          success: (res) => {
                            setAffiliations(res as Affiliation[])
                            return "Affiliation added!"
                          },
                          error: "Failed to add affiliation...",
                        }
                      )
                    },
                    async getItems(query) {
                      const results = await axios.get(
                        `https://api.ror.org/organizations?query.advanced=${query.query}`
                      )

                      return results.data.items.slice(0, 5)
                    },
                    templates: {
                      item({ item, index }) {
                        return <SearchResultAffiliation item={item} />
                      },
                    },
                  },
                ]}
              />
            )}
          </div>
        </div>
        <div className="my-4 px-2 text-gray-900 dark:text-gray-200">
          <label htmlFor="bio" className="my-1 block text-sm font-medium">
            Bio {formik.touched.bio && formik.errors.bio ? " - " + formik.errors.bio : null}
          </label>
          <div className="mt-1">
            <textarea
              rows={4}
              id="bio"
              className="block w-11/12 rounded border border-gray-300 bg-transparent text-gray-900 focus:border-indigo-500 focus:ring-indigo-500  dark:border-gray-600 dark:text-gray-200 sm:text-sm"
              defaultValue={workspaceBio}
              onChange={(data) => {
                setWorkspaceBio(data.target.value)
              }}
            />
          </div>
        </div>
        <div className="my-4 px-2 text-gray-900 dark:text-gray-200">
          <label htmlFor="pronouns" className="my-1 block text-sm font-medium">
            Pronouns{" "}
            {formik.touched.pronouns && formik.errors.pronouns
              ? " - " + formik.errors.pronouns
              : null}
          </label>
          <div className="mt-1 text-gray-900 dark:text-gray-200">
            <input
              id="pronouns"
              type="pronouns"
              autoComplete="pronouns"
              placeholder="they/them"
              className="placeholder-font-normal block w-11/12 appearance-none rounded border border-gray-300 bg-transparent px-3 py-2 text-sm font-normal placeholder-gray-400 focus:border-indigo-500 focus:outline-none  focus:ring-indigo-500 dark:border-gray-600 "
              defaultValue={workspacePronouns}
              onChange={(data) => {
                setWorkspacePronouns(data.target.value)
              }}
            />
          </div>
        </div>
        <div className="my-4 px-2 text-gray-900 dark:text-gray-200">
          <label htmlFor="profileUrl" className="my-1 block text-sm font-medium">
            Profile URL{" "}
            {formik.touched.profileUrl && formik.errors.profileUrl
              ? " - " + formik.errors.profileUrl
              : null}
          </label>
          <div className="mt-1">
            <input
              id="profileUrl"
              type="url"
              autoComplete="profileUrl"
              placeholder="https://yourname.com"
              className=" placeholder-font-normal block w-11/12 appearance-none rounded border border-gray-300 bg-transparent px-3 py-2  text-sm font-normal placeholder-gray-400 focus:border-indigo-500 focus:outline-none  focus:ring-indigo-500 dark:border-gray-600 "
              defaultValue={workspaceUrl}
              onChange={(data) => {
                setWorkspaceUrl(data.target.value)
              }}
            />
          </div>
        </div>

        <div className="absolute right-0 bottom-0 flex w-full border-t border-gray-300 bg-white py-2 text-right dark:border-gray-600 dark:bg-gray-900 sm:sticky">
          <span className="flex-grow"></span>
          <div className="">
            <button
              type="reset"
              className="mx-4 flex rounded-md bg-red-50 py-2 px-4 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-red-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
              onClick={() => {
                setIsOpen(false)
                resetFirstName()
                resetLastName()
                resetBio()
                resetPronouns()
                resetUrl()
              }}
            >
              <Close
                size={32}
                className="h-4 w-4 fill-current pt-1 text-red-500"
                aria-hidden="true"
              />
              Cancel
            </button>
          </div>
          <button
            type="submit"
            className="mr-4 flex rounded-md bg-emerald-50 py-2 px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-emerald-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
          >
            <Checkmark
              size={32}
              className="h-4 w-4 fill-current pt-1 text-emerald-500"
              aria-hidden="true"
            />
            Save
          </button>
        </div>
      </form>
    </>
  )
}

export default WorkspaceSettings
