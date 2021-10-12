import { getSession, Link, Routes, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import moment from "moment"
import React from "react"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import SearchItem from "../core/components/SearchItem"

import "@algolia/autocomplete-theme-classic"
import algoliasearch from "algoliasearch"
import Navbar from "../core/components/navbarApp"
import db from "db"
import updateInvitation from "../authorship/mutations/updateInvitation"
import Banner from "../core/components/Banner"
import Autocomplete from "../core/components/Autocomplete"

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res)
  const user = await db.user.findFirst({
    where: {
      id: session.$publicData.userId!,
    },
    select: {
      emailIsVerified: true,
    },
  })

  const draftModules = await db.module.findMany({
    where: {
      published: false,
      authors: {
        some: {
          workspaceId: session.$publicData.workspaceId,
          acceptedInvitation: true,
        },
      },
    },
    orderBy: [
      {
        updatedAt: "asc",
      },
    ],
  })

  const invitedModules = await db.module.findMany({
    where: {
      published: false,
      authors: {
        some: {
          workspaceId: session.$publicData.workspaceId,
          acceptedInvitation: null,
        },
      },
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
    ],
    include: {
      authors: {
        where: {
          workspaceId: session.$publicData.workspaceId,
          acceptedInvitation: null,
        },
      },
    },
  })

  const modules = await db.module.findMany({
    where: {
      published: true,
    },
    orderBy: [
      {
        publishedAt: "desc",
      },
    ],
    include: {
      authors: true,
    },
  })

  const workspaces = await db.workspace.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  })

  return { props: { user, draftModules, invitedModules, modules, workspaces } }
}

const Dashboard = ({ user, draftModules, invitedModules, modules, workspaces }) => {
  const [updateInvitationMutation, { isSuccess: invitationUpdated }] = useMutation(updateInvitation)

  return (
    <>
      {!user.emailIsVerified ? (
        <Banner message="You can only start publishing once your email is verified. Please check your inbox." />
      ) : (
        ""
      )}
      <Navbar />
      <main className="max-w-4xl mx-auto">
        <div>
          <p>
            <Link href={Routes.CreatePage()}>
              <a>Lets create some shit</a>
            </Link>
          </p>
        </div>
        <div className="flex">
          <div className="w-full">
            <h2 className="font-bold text-4xl">
              <Link href={Routes.DraftsPage()}>
                <a>
                  {draftModules.length} draft{draftModules.length !== 1 ? "s" : ""}
                </a>
              </Link>
            </h2>
            {draftModules.map((draft) => {
              return (
                <p key={draft.suffix}>
                  Last edited: {moment(draft.updatedAt).fromNow()}
                  <Link href={Routes.ModuleEditPage({ suffix: draft.suffix })}>
                    <a>
                      10.53962/{draft.suffix} {draft.title}
                    </a>
                  </Link>
                </p>
              )
            })}
          </div>
          <div className="w-full">
            <h2 className="font-bold text-4xl">Feed</h2>
            {modules.map((module) => {
              return (
                <p key={module.suffix}>
                  <Link href={Routes.ModulePage({ suffix: module.suffix })}>
                    <a>
                      {moment(module.publishedAt).fromNow()} 10.53962/{module.suffix} {module.title}
                    </a>
                  </Link>
                </p>
              )
            })}
          </div>
        </div>
        <div>
          <h2 className="font-bold text-4xl">Newest users</h2>
          {workspaces.map((workspace) => {
            return (
              <p key={workspace.handle}>
                <Link href={Routes.HandlePage({ handle: workspace.handle })}>
                  <a>
                    {moment(workspace.createdAt).fromNow()} @{workspace.handle}
                  </a>
                </Link>
              </p>
            )
          })}
        </div>
        <div>
          <h2 className="font-bold text-4xl">Invitations</h2>
          {invitedModules.map((invitation) => {
            return (
              <p key={invitation.suffix}>
                {invitationUpdated ? (
                  <span>Thanks for responding to this invitation</span>
                ) : (
                  <>
                    <Link href={Routes.ModuleEditPage({ suffix: invitation.suffix })}>
                      <a>
                        {moment(invitation.createdAt).fromNow()} 10.53962/{invitation.suffix}{" "}
                        {invitation.title}
                      </a>
                    </Link>
                    <div>
                      <button
                        onClick={async () => {
                          await updateInvitationMutation({
                            id: invitation.authors[0].id,
                            accept: true,
                          })
                        }}
                      >
                        Accept
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={async () => {
                          await updateInvitationMutation({
                            id: invitation.authors[0].id,
                            accept: false,
                          })
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  </>
                )}
              </p>
            )
          })}
        </div>
        <Autocomplete
          openOnFocus={true}
          getSources={({ query }) => [
            {
              sourceId: "products",
              getItems() {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: "dev_workspaces",
                      query,
                    },
                  ],
                })
              },
              templates: {
                item({ item, components }) {
                  return <SearchItem hit={item} components={components} />
                },
              },
            },
          ]}
        />
      </main>
    </>
  )
}

Dashboard.authenticate = true
Dashboard.suppressFirstRenderFlicker = true
Dashboard.getLayout = (page) => <Layout title="Dashboard">{page}</Layout>

export default Dashboard
