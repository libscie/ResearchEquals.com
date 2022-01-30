import { BlitzPage, useQuery, useRouter, useSession } from "blitz"
import Layout from "app/core/layouts/Layout"
import Markdown from "markdown-it"

import Navbar from "../core/components/Navbar"
import Footer from "../core/components/Footer"
import LayoutLoader from "app/core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"

const termsMarkdown = `
# Security measures

To ensure the security of all systems used to operate ResearchEquals, Liberate Science GmbH is committed to continuously improving the security measures in place to that end. You can find some of our latest security measures below.

## Access Control

### Product Access

**Authentication.** All users must have a password of at least 10 symbols length. Users who interact with Liberate Science GmbH Services via the user interface must authenticate before they can access non-public customer data.

**Authorization.** Workspace data is stored in multi-tenant storage systems accessible to Users only via the user interface. Users are not allowed for direct access to the underlying application infrastructure. The authorization model in each of our products is designed to ensure that only the properly assigned entities can access relevant features.

**Separation of environments.** We separate development, testing, and operational environments to minimize the risks of unauthorized access or changes to the operational environment.

**Employee access.** We minimize the number of trained employees that have (administrative) access to the products and to user data via controlled interfaces. Where possible, we enforce and use 2FA. Access is granted by role (on a "need to know" basis), which is minimized to as few people as is necessary to provide the services reliably. Liberate Science GmbH employees do not have physical access to Users' databases.

### Infrastructure Access

Our service providers have various SOC and ISO 27001 certifications. They provide multiple physical and digital security layers (e.g., alarms, security personnel, visiter logs, hazard protection, RAID backups).

We maintain relations with the service providers as outlined in our [Data Processing Agreement](https://researchequals.com/dpa), and minimize the amount of providers we conduct operations with. All service providers are vetted for privacy and security compliance before we engage with them.

**Network security.** To prevent unauthorized access of the infrastructure, we have technical measures in place using strong passwords and firewall procedures. The platform is only accessible over HTTPS to increase security of transmitted information.

**Employee access.** The limited number of trained personnel that has access, uses strong and unique passwords for all points of entry. Where possible, we enforce and use 2FA using physical security keys or other authentication methods. Access is granted by role (on a "need to know" basis), which is minimized to as few people as is necessary to provide the services reliably. All employee devices are encrypted and used with privacy protecting measures.

## Data retention

**Upgrades.** Passwords are encrypted according to industry standards, and get rehashed from time-to-time to improve their security. This happens programatically and without providing access to the user's password.

**Deletion.** We minimize the amount of information we store as a security measure. As a rule, we delete information that is not deemed critical in our provisioning of the platform. Support emails may be stored up to 60 days for internal educational purposes. We allow users to delete their accounts at any time.

Physical information, where legally possible and not in violation of legal obligations, is shredded according to the [DIN P5 standard](https://en.wikipedia.org/wiki/Paper_shredder#Deutsches_Institut_f%C3%BCr_Normung_(DIN)).

Fault tolerance. Backup and replication strategies are designed to ensure redundancy and fail-over protections during a significant processing failure. Customer data is backed up to multiple durable data stores and replicated across multiple availability zones. Rollbacks are tested regularly.

**Redundancy.** All data is stored in a redundant manner, to prevent loss of data when one server instance fails. We use multiple availability zones to allow for continued availability of the services, and create automated backups.

`

const md = new Markdown()

const SecurityPage: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })

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
      <main className="lg:relative bg-white dark:bg-gray-900">
        <div className="mx-4 lg:mx-auto max-w-3xl text-black dark:text-white my-8">
          <div className="coc" dangerouslySetInnerHTML={{ __html: md.render(termsMarkdown) }}></div>
        </div>
      </main>
      <Footer />
    </>
  )
}

SecurityPage.suppressFirstRenderFlicker = true
SecurityPage.getLayout = (page) => (
  <Layout title="R= Security measures">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default SecurityPage
