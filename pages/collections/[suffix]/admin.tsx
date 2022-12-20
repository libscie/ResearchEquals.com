import { gSSP } from "app/blitz-server"
import { useRouter } from "next/router"
import { useQuery } from "@blitzjs/rpc"
import { useSession } from "@blitzjs/auth"
import Layout from "app/core/layouts/Layout"

import Navbar from "app/core/components/Navbar"
import getDrafts from "app/core/queries/getDrafts"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import generateSignature from "app/signature"
import LayoutLoader from "app/core/components/LayoutLoader"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import getCollectionInfo from "app/collections/queries/getCollectionInfo"
import MakeCollectionPublicModal from "app/core/modals/MakeCollectionPublicModal"
import UpgradeCollectionModal from "app/core/modals/UpgradeCollectionModal"
import HeaderImage from "app/collections/components/AdminHeaderImage"
import Icon from "app/collections/components/AdminIcon"
import AdminSubtitle from "app/collections/components/AdminSubtitle"
import Doi from "app/collections/components/DoiCollection"
import AdminDescription from "app/collections/components/AdminDescription"
import ActivityBadge from "app/collections/components/ActivityBadge"
import ContributorsBadge from "app/collections/components/ContributorsBadge"
import EditorsBadge from "app/collections/components/EditorsBadge"
import AdminSubmission from "app/collections/components/AdminSubmission"
import FinalizeUpgradeModal from "app/core/modals/FinalizeUpgradeModal"
import { useMediaPredicate } from "react-media-hook"
import AdminTitle from "app/collections/components/AdminTitle"
import AdminCollectedWorks from "app/collections/components/AdminCollectedWorks"
import AdminEditors from "app/collections/components/AdminEditors"

export const getServerSideProps = gSSP(async function getServerSideProps(context) {
  // Expires in 30 minutes
  const expire = Math.round(Date.now() / 1000) + 60 * 30
  const signature = generateSignature(process.env.UPLOADCARE_SECRET_KEY, expire.toString())

  return {
    props: {
      expire,
      signature,
    },
  }
})

const CollectionsAdmin = ({ expire, signature }, context) => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })
  const [{ collection, editorIdSelf, editorIsAdmin, pendingSubmissions }, { refetch }] = useQuery(
    getCollectionInfo,
    router!.query!.suffix! as string
  )
  const mdWindow = useMediaPredicate("(min-width: 768px)")
  const lgWindow = useMediaPredicate("(min-width: 1024px)")
  const xlWindow = useMediaPredicate("(min-width: 1280px)")

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
      <main className="relative">
        {!collection?.public && (
          <MakeCollectionPublicModal
            collection={collection}
            refetchFn={refetch}
            workspace={currentWorkspace}
          />
        )}
        {collection?.upgraded && (
          <FinalizeUpgradeModal collection={collection} refetchFn={refetch} />
        )}
        <HeaderImage
          collection={collection}
          refetchFn={refetch}
          signature={signature}
          expire={expire}
        />
        {/* mobile */}
        {!xlWindow && (
          <>
            <div className="w-full">
              <div className="flex">
                <div className="top-[50%] mx-auto mx-4 w-[25%] p-4 ">
                  {collection!.type.type !== "INDIVIDUAL" && (
                    <Icon
                      collection={collection}
                      refetchFn={refetch}
                      signature={signature}
                      expire={expire}
                    />
                  )}
                </div>
                <div className="flex-grow">
                  <AdminTitle collection={collection} refetchFn={refetch} isAdmin={editorIsAdmin} />
                  {collection!.type.type !== "INDIVIDUAL" && (
                    <AdminSubtitle
                      collection={collection}
                      refetchFn={refetch}
                      isAdmin={editorIsAdmin}
                    />
                  )}
                  <div className="my-4 w-full text-center align-middle">
                    <Doi collection={collection} />
                    <ActivityBadge collection={collection} />
                    {collection!.type.type !== "INDIVIDUAL" && (
                      <EditorsBadge collection={collection} />
                    )}
                    {collection!.type.type !== "INDIVIDUAL" && (
                      <ContributorsBadge collection={collection} nrContributors={{}} />
                    )}
                  </div>
                </div>
              </div>
              <AdminEditors
                collection={collection}
                user={currentUser}
                selfId={editorIdSelf}
                isAdmin={editorIsAdmin}
                refetchFn={refetch}
              />
              <AdminDescription
                collection={collection}
                refetchFn={refetch}
                isAdmin={editorIsAdmin}
              />
              <PendingSubmissions
                collection={collection}
                currentUser={currentUser}
                editorIdSelf={editorIdSelf}
                pendingSubmissions={pendingSubmissions}
                refetchFn={refetch}
              />
              <AdminCollectedWorks
                collection={collection}
                editorIdSelf={editorIdSelf}
                refetchFn={refetch}
                editorIsAdmin={editorIsAdmin}
              />
            </div>
          </>
        )}
        {/* desktop */}
        {xlWindow && (
          <div className="inline-block w-full md:grid md:grid-cols-4 xl:grid-cols-8">
            <div className="col-span-1 mx-4 p-4 xl:col-span-2">
              {collection!.type.type !== "INDIVIDUAL" && (
                <Icon
                  collection={collection}
                  refetchFn={refetch}
                  signature={signature}
                  expire={expire}
                />
              )}
              <AdminEditors
                collection={collection}
                user={currentUser}
                selfId={editorIdSelf}
                isAdmin={editorIsAdmin}
                refetchFn={refetch}
              />
            </div>
            <div className="col-span-4 mx-4 px-4">
              <AdminTitle collection={collection} refetchFn={refetch} isAdmin={editorIsAdmin} />
              {collection!.type.type !== "INDIVIDUAL" && (
                <AdminSubtitle
                  collection={collection}
                  refetchFn={refetch}
                  isAdmin={editorIsAdmin}
                />
              )}
              <div className="my-4 w-full text-center align-middle">
                <Doi collection={collection} />
                <ActivityBadge collection={collection} />
                {collection!.type.type !== "INDIVIDUAL" && <EditorsBadge collection={collection} />}
                {collection!.type.type !== "INDIVIDUAL" && (
                  <ContributorsBadge collection={collection} nrContributors={{}} />
                )}
              </div>
              <AdminDescription
                collection={collection}
                refetchFn={refetch}
                isAdmin={editorIsAdmin}
              />
              <AdminCollectedWorks
                collection={collection}
                editorIdSelf={editorIdSelf}
                refetchFn={refetch}
                editorIsAdmin={editorIsAdmin}
              />
            </div>
            <PendingSubmissions
              collection={collection}
              currentUser={currentUser}
              editorIdSelf={editorIdSelf}
              pendingSubmissions={pendingSubmissions}
              refetchFn={refetch}
            />
          </div>
        )}
      </main>
    </>
  )
}

CollectionsAdmin.authenticate = true
CollectionsAdmin.getLayout = (page) => (
  <Layout title="R= Collections Admin Portal">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default CollectionsAdmin

const PendingSubmissions = ({
  collection,
  currentUser,
  editorIdSelf,
  pendingSubmissions,
  refetchFn,
}) => {
  return (
    <div className="col-span-2 m-4 xl:p-4">
      <h2 className="my-4 text-xl">Pending Submissions</h2>
      {collection?.type.type != "COMMUNITY" && (
        <div className="mx-auto w-full align-middle">
          <UpgradeCollectionModal collection={collection} email={currentUser!.email} />
        </div>
      )}
      {pendingSubmissions?.submissions.length! > 0 && collection?.type.type === "COMMUNITY" && (
        <>
          {collection.submissions.map((submission, index) => {
            return (
              <AdminSubmission
                submission={submission}
                editorIdSelf={editorIdSelf}
                refetchFn={refetchFn}
                key={`submission-${index}`}
              />
            )
          })}
        </>
      )}
      {pendingSubmissions?.submissions.length! === 0 && collection?.type.type === "COMMUNITY" && (
        <div className="">
          <div className="relative flex w-full flex-grow flex-col rounded-lg border-2 border-dashed border-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500  focus:ring-offset-2 dark:border-white">
            <div className="table h-full w-full flex-grow">
              <div className="h-28 w-1/4 sm:table-cell"></div>
              <span className="mx-auto table-cell align-middle text-sm font-medium leading-4">
                <>
                  <div className="">No pending submissions. Maybe request some?</div>
                </>
              </span>
              <div className="hidden w-1/4 sm:table-cell"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
