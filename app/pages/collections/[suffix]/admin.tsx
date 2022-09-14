import { useSession, useQuery, useRouter, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import { JsonObject } from "prisma"

import Navbar from "../../../core/components/Navbar"
import getDrafts from "../../../core/queries/getDrafts"
import { useCurrentUser } from "../../../core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import generateSignature from "../../../signature"
import LayoutLoader from "app/core/components/LayoutLoader"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import db from "db"
import getCollectionInfo from "app/collections/queries/getCollectionInfo"
import { Ref, useRef } from "react"
import { Widget, WidgetAPI } from "@uploadcare/react-widget"
import toast from "react-hot-toast"
import changeIcon from "../../../collections/mutations/changeIcon"
import changeHeader from "../../../collections/mutations/changeHeader"
import { Field, Form, Formik } from "formik"
import changeTitle from "app/collections/mutations/changeTitle"
import changeSubtitle from "app/collections/mutations/changeSubtitle"
import changeDescription from "app/collections/mutations/changeDescription"
import upgradeButton from "../../../collections/components/upgrade-button"
import UpgradeButton from "../../../collections/components/upgrade-button"

export async function getServerSideProps(context) {
  // Expires in 30 minutes
  const expire = Math.round(Date.now() / 1000) + 60 * 30
  const signature = generateSignature(process.env.UPLOADCARE_SECRET_KEY, expire.toString())

  return {
    props: {
      expire,
      signature,
    },
  }
}

const CollectionsAdmin = ({ expire, signature }, context) => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })
  const [collection, { refetch }] = useQuery(getCollectionInfo, router!.query!.suffix! as string)

  return (
    <>
      <Navbar
        currentUser={currentUser}
        session={session}
        currentWorkspace={currentWorkspace}
        router={router}
        drafts={drafts}
        invitations={invitations}
        refetchFn={refetch}
      />
      <main className="relative grid xl:grid-cols-8">
        {/* TODO: Add a make public for collab and community */}
        {collection?.type.type === "INDIVIDUAL" && ""}
        {collection?.type.type === "COLLABORATIVE" && (
          <>
            <div className="col-span-2 p-4">
              <HeaderImage
                collection={collection}
                refetchFn={refetch}
                signature={signature}
                expire={expire}
              />
              <Icon
                collection={collection}
                refetchFn={refetch}
                signature={signature}
                expire={expire}
              />
              <Title collection={collection} refetchFn={refetch} />
              <Subtitle collection={collection} refetchFn={refetch} />
              <Description collection={collection} refetchFn={refetch} />
              <Editors collection={collection} />
            </div>
            <div className="col-span-4">
              <h2>Collected works</h2>

              <div>{JSON.stringify(collection!.submissions)}</div>
            </div>
            <div className="col-span-2">
              <h2>Submissions</h2>
              <UpgradeButton />
            </div>
          </>
        )}
        {collection?.type.type === "COMMUNITY" && ""}
      </main>
    </>
  )
}

CollectionsAdmin.authenticate = true
CollectionsAdmin.getLayout = (page) => (
  <Layout title="R= Drafts">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default CollectionsAdmin

const Description = ({ collection, refetchFn }) => {
  const [changeDescriptionMutation, { isSuccess: isDescriptionSuccess }] =
    useMutation(changeDescription)

  return (
    <Formik
      initialValues={{
        description: "",
      }}
      onSubmit={async (values) => {
        try {
          await changeDescriptionMutation({
            id: collection.id,
            description: values.description,
          })
          refetchFn()
        } catch (error) {
          alert("Error saving product")
        }
      }}
    >
      <Form>
        <label htmlFor="description" className="sr-only">
          description
        </label>
        <Field
          id="description"
          name="description"
          placeholder="description"
          type="text"
          component="textarea"
          rows={8}
        />
        {isDescriptionSuccess ? (
          <button className="whitespace-nowrap font-medium underline" type="submit">
            Thanks!
          </button>
        ) : (
          <button className="whitespace-nowrap font-medium underline" type="submit">
            Save description <span aria-hidden="true">&rarr;</span>
          </button>
        )}
      </Form>
    </Formik>
  )
}

const Editors = ({ collection }) => {
  return (
    <div>
      <h3 className="text-center text-sm">Editors</h3>
      {collection.editors.map((editor) => {
        return (
          <>
            <img src={editor.workspace.avatar} />
          </>
        )
      })}
      <UpgradeButton />
    </div>
  )
}

const Title = ({ collection, refetchFn }) => {
  const [changeTitleMutation, { isSuccess: isTitleSuccess }] = useMutation(changeTitle)

  return (
    <>
      {collection.title === "" ? (
        <>
          <Formik
            initialValues={{
              title: "",
            }}
            onSubmit={async (values) => {
              try {
                await changeTitleMutation({ id: collection.id, title: values.title })
                refetchFn()
              } catch (error) {
                alert("Error saving product")
              }
            }}
          >
            <Form>
              <label htmlFor="title" className="sr-only">
                title
              </label>
              <Field id="title" name="title" placeholder="jane@acme.com" type="text" />
              {isTitleSuccess ? (
                <button className="whitespace-nowrap font-medium underline" type="submit">
                  Thanks!
                </button>
              ) : (
                <button className="whitespace-nowrap font-medium underline" type="submit">
                  Send again <span aria-hidden="true">&rarr;</span>
                </button>
              )}
            </Form>
          </Formik>
        </>
      ) : (
        <h2 className="mx-auto text-center text-xl font-bold">{collection.title}</h2>
      )}
    </>
  )
}
const Subtitle = ({ collection, refetchFn }) => {
  const [changeSubtitleMutation, { isSuccess: isSubtitleSuccess }] = useMutation(changeSubtitle)

  return (
    <>
      {collection.subtitle === null ? (
        <>
          <Formik
            initialValues={{
              subtitle: "",
            }}
            onSubmit={async (values) => {
              try {
                await changeSubtitleMutation({
                  id: collection.id,
                  subtitle: values.subtitle,
                })
                refetchFn()
              } catch (error) {
                alert("Error saving product")
              }
            }}
          >
            <Form>
              <label htmlFor="subtitle" className="sr-only">
                subtitle
              </label>
              <Field id="subtitle" name="subtitle" placeholder="Subtitle" type="text" />
              {isSubtitleSuccess ? (
                <button className="whitespace-nowrap font-medium underline" type="submit">
                  Thanks!
                </button>
              ) : (
                <button className="whitespace-nowrap font-medium underline" type="submit">
                  Save subtitle <span aria-hidden="true">&rarr;</span>
                </button>
              )}
            </Form>
          </Formik>
        </>
      ) : (
        <h2 className="mx-auto text-center text-base font-medium leading-5">
          {collection.subtitle}
        </h2>
      )}
    </>
  )
}

const Icon = ({ collection, refetchFn, signature, expire }) => {
  const widgetApiIcon = useRef() as Ref<WidgetAPI>
  const [changeIconMutation] = useMutation(changeIcon)

  return (
    <>
      <img
        src={collection?.icon!["originalUrl"]}
        className="max-w-28 mx-auto h-28 max-h-28 w-28 rounded-full border border-2 border-gray-900 hover:cursor-pointer hover:border-4 hover:border-indigo-600 dark:border-white"
        alt={`Icon of ${collection.title}`}
        onClick={() => {
          widgetApiIcon!["current"].openDialog()
        }}
      />
      <Widget
        publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
        secureSignature={signature}
        secureExpire={expire}
        ref={widgetApiIcon}
        imagesOnly
        previewStep
        clearable
        onChange={async (info) => {
          try {
            toast.promise(
              changeIconMutation({
                id: collection.id,
                iconInfo: info as JsonObject,
              }),
              {
                loading: "Updating icon...",
                success: () => {
                  refetchFn()
                  return "Success!"
                },
                error: "That did not work",
              }
            )
          } catch (err) {
            alert(err)
          }
        }}
      />
    </>
  )
}

const HeaderImage = ({ collection, refetchFn, signature, expire }) => {
  const widgetApiHeader = useRef() as Ref<WidgetAPI>
  const [changeHeaderMutation] = useMutation(changeHeader)

  return (
    <>
      <img
        src={collection?.header!["originalUrl"]}
        className="h-28 max-h-28 w-full rounded-full border border-2 border-gray-900 hover:cursor-pointer hover:border-4 hover:border-indigo-600 dark:border-white"
        alt={`Header image of ${collection.title}`}
        onClick={() => {
          widgetApiHeader!["current"].openDialog()
        }}
      />
      <Widget
        publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
        secureSignature={signature}
        secureExpire={expire}
        ref={widgetApiHeader}
        imagesOnly
        previewStep
        clearable
        onChange={async (info) => {
          console.log(JSON.stringify(info))
          try {
            toast.promise(
              changeHeaderMutation({
                id: collection.id,
                headerInfo: info as JsonObject,
              }),
              {
                loading: "Updating header...",
                success: () => {
                  refetchFn()
                  return "Success!"
                },
                error: "That did not work",
              }
            )
          } catch (err) {
            alert(err)
          }
        }}
      />
    </>
  )
}
