import { useSession } from "@blitzjs/auth"
import { useRouter } from "next/router"
import { useQuery } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import Markdown from "markdown-it"

import Navbar from "app/core/components/Navbar"
import LayoutLoader from "app/core/components/LayoutLoader"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import getDrafts from "app/core/queries/getDrafts"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"

const md = new Markdown()

const TermsDiffPage20220916: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })

  return (
    <>
        <Navbar />

      <main className="bg-white dark:bg-gray-900 lg:relative">
        <div className="coc terms-diff mx-4 my-8 max-w-3xl text-black dark:text-white lg:mx-auto">
          <h1 id="terms-of-use">Terms of use</h1>
          <h2 id="scope-and-applicability">1. Scope and Applicability</h2>
          <p>
            Liberate Science GmbH, Ebertystraße 44, 10249 Berlin, Germany (“LibScie” or “we/us/our”)
            provides an online publishing platform for Research Modules that is accessible under{" "}
            <a href="https://researchequals.com">https://researchequals.com</a> (the “Platform”).
            The ResearchEquals logo is a <a href="https://pentagram.de/de/projekte/">Pentagram</a>{" "}
            design.
          </p>
          <p>
            These Terms of Use (“the Terms”) guide the legal relationship between LibScie and the
            User (“the Agreement”) and apply to all (especially legal binding) actions of the User
            and LibScie on or in connection with the Platform, including the registration of a User
            Account on the Platform.
          </p>
          <h2 id="definitions">2. Definitions</h2>
          <ol type="1">
            <li>
              <p>
                <del>
                  “Consumer”: As defined in{" "}
                  <a href="https://www.gesetze-im-internet.de/englisch_bgb/englisch_bgb.html#p0050">
                    Sec. 13 BGB
                  </a>{" "}
                  (Bürgerliches Gesetzbuch, German Civil Law Code). Every natural person who enters
                  into a legal transaction for purposes that pre-dominantly are outside his trade,
                  business or profession.
                </del>
                <strong>“Collections”: A list of Works curated by the User on the Platform.</strong>
              </p>
            </li>
            <li>
              <p>
                <del>
                  “Content”: Any type of media (for example text, audio or video files,
                  presentations etc.) uploaded to the Platform by a User to be published as
                </del>
                <strong>
                  “Consumer”: As defined in{" "}
                  <a href="https://www.gesetze-im-internet.de/englisch_bgb/englisch_bgb.html#p0050">
                    Sec. 13 BGB
                  </a>{" "}
                  (Bürgerliches Gesetzbuch, German Civil Law Code). Every natural person who enters
                  into
                </strong>{" "}
                a <del>Research Module.</del>
                <strong>
                  legal transaction for purposes that pre-dominantly are outside his trade, business
                  or profession.
                </strong>
              </p>
            </li>
            <li>
              <p>
                <del>“Research Module”: Content that shall be Published on</del>
                <strong>
                  “Content”: Any type of media (for example text, audio or video files,
                  presentations etc.) uploaded to
                </strong>{" "}
                the <del>Platform.</del>
                <strong>Platform by a User to be published as a Research Module.</strong>
              </p>
            </li>
            <li>
              <p>
                <del>“User”: A natural person that registers for</del>
                <strong>“Individual Collection”: Collection created</strong> and{" "}
                <del>uses the Platform.</del>
                <strong>
                  managed by one workspace, which can-not have multiple editors or external
                  submissions.
                </strong>
              </p>
            </li>
            <li>
              <p>
                <del>“User Account” or “Account”: The personal account provided</del>
                <strong>“Collaborative Collection”: Collection created</strong> by{" "}
                <del>LibScie</del>
                <strong>one workspace and managed by up</strong> to{" "}
                <del>the User on the Platform after the User’s registration.</del>
                <strong>five workspaces, which cannot have external submissions.</strong>
              </p>
            </li>
            <li>
              <p>
                <strong>
                  “Community Collection”: Collection created by one workspace and managed by
                  unlim-ited workspaces, with external submissions.
                </strong>
              </p>
            </li>
          </ol>
          <p className="pl-4">
            <strong>7. “Research Module”: Content that shall be Published on the Platform.</strong>
          </p>
          <p className="pl-4">
            <strong>8. “User”: A natural person that registers for and uses the Platform.</strong>
          </p>
          <p className="pl-4">
            <strong>
              9. “User Account” or “Account”: The personal account provided by LibScie to the User
              on the Platform after the User’s registration.
            </strong>
          </p>
          <p className="pl-4">
            <strong>
              10. “Work”: Any published work included in the ResearchEquals database (e.g.,
              publications that have a DOI), independent of the specific source they are published
              on.
            </strong>
          </p>
          <p className="pl-4">
            <strong>11.</strong> “Workspace” or “Space”: The author profile(s) linked to the User
            Account on the Platform upon registration and additional Workspaces created while logged
            in to the Account.
          </p>
          <h2 id="conclusion-of-the-agreement-and-registering-an-account">
            3. Conclusion of the Agreement and Registering an Account
          </h2>
          <ol type="1">
            <li>
              <p>
                While certain parts of the Platform are freely accessible, the User has to open a
                User Account to upload Content and publish Research Modules on the Platform. Opening
                a User Account is free of charge for the User.
              </p>
            </li>
            <li>
              <p>
                The User can sign up directly by visiting the website{" "}
                <a href="https://researchequals.com">https://researchequals.com</a>. The User has to
                be at least 18 years old and in full legal capacity to open a user account.
              </p>
            </li>
            <li>
              <p>
                During the sign up, the User has to provide certain basic information, including an
                email address and a password. The User can rectify the Account or Workspace
                information at any time the settings of the Account or Workspace.
              </p>
            </li>
            <li>
              <p>
                By clicking on “Sign Up”, the User asks LibScie to create an Account and Workspace
                on the Platform. LibScie will send an email with a legally binding offer to open the
                account and to confirm the User’s email address. By clicking on “confirm email”, the
                User accepts the offer, concludes the contract with LibScie and opens the Account.
              </p>
            </li>
            <li>
              <p>
                The User shall keep the Account information, and especially the chosen password,
                confidential and not disclose it to any third party. Any abuse or suspected abuse
                shall be reported to LibScie immediately.
              </p>
            </li>
            <li>
              <p>
                The User can access these terms anytime on the Platform in the most recent version.
                The Agreement is concluded in English and the Terms are available in English
                exclusively.
              </p>
            </li>
          </ol>
          <h2 id="basic-functions-and-rules-of-the-platform">
            4. Basic Functions and Rules of the Platform
          </h2>
          <ol type="1">
            <li>
              <p>
                The Platform provides basic functions to all registered Users. The User can for
                example search the Platform for Research Modules and Content to view or download
                them. LibScie makes no guarantees about the availability of the Platform.
              </p>
            </li>
            <li>
              <p>The User Account is private. Workspaces are public.</p>
            </li>
            <li>
              <p>
                The User ensures compliance to the basic rules of the Platform at any time. On the
                Platform, it is forbidden:
              </p>
              <ul>
                <li>
                  To upload and distribute insulting, abusive, offensive, racist, threatening, youth
                  protection law infringing, pornographic, personal rights infringing, promoting
                  violence or sedition, inciting criminal acts, providing instructions on how to
                  commit criminal acts or services that involve pornographic and/or erotic Content
                  or any other illegal Content;
                </li>
                <li>
                  To upload and distribute Content that has been copied, in whole or in any part,
                  from any other protected work or material without the permission of the respective
                  copyright owner;
                </li>
                <li>
                  To upload and distribute Content that affects or infringes the rights of any third
                  party, in particular personal rights, copyrights or other intellectual property
                  rights or any other third party rights;
                </li>
                <li>
                  To upload and distribute Content that contains personal, confidential or
                  non-public information;
                </li>
                <li>
                  To contact other Users of the Platform in a not respectful and impolite manner as
                  well as in order to buy or sell any products or services;
                </li>
                <li>
                  To provide wrong data or information, and to provide data or information of any
                  third party; or
                </li>
                <li>To sell or otherwise transfer the User Account to another person.</li>
              </ul>
            </li>
          </ol>
          <p>
            In cases where research purposes may provide exception to these rules, the User is
            required to provide qualifying information in the Research Module, which can serve as
            grounds for exception at the discretion of LibScie.
          </p>
          <h2 id="submitting-and-licensing-content-on-the-platform">
            5. Submitting and Licensing Content on the Platform
          </h2>
          <h3 id="submitting-and-licensing-content-as-research-modules-general-rules">
            5.1 Submitting and Licensing Content as Research Modules – General Rules
          </h3>
          <ol type="1">
            <li>
              <p>
                On the Platform, the User can publish Content as Research Modules under different
                open or closed licenses and LibScie will make these Research Modules publicly
                available on the respective Workspace. The User can create several Workspaces.
                LibScie provides a separate URL for each Workspace. LibScie reserves the right to
                delete or rectify any Content or Research Modules that does not comply with this
                Agreement and/or infringes the rights of third parties.
              </p>
            </li>
            <li>
              <p>
                The User submits the Content for publication as a Research Module by filling out the
                relevant form on the Platform and by uploading the Content. Before the publication,
                the User can rectify any information given by using the technical means of the
                Platform.
              </p>
            </li>
            <li>
              <p>
                The Content has to meet certain technical criteria (e.g., certain file formats,
                sizes etc.). LibScie will specify these formats in a separate information available
                on the Platform, currently available under{" "}
                <a href="https://researchequals.com/faq">https://researchequals.com/faq</a> (the
                link and criteria may be subject to change from time to time).
              </p>
            </li>
            <li>
              <p>
                LibScie provides a Digital Object Identifier (“DOI”) for each Research Module. A DOI
                is a persistent identifier or handle used to identify objects uniquely, standardized
                by the International Organization for Standardization (ISO). The DOI requires that
                the Research Module is permanently accessible on the Platform.
              </p>
            </li>
            <li>
              <p>
                Independently of the license the User chooses to publish the Research Module under,
                the User grants LibScie and LibScie accepts by uploading the Content all rights
                necessary to fulfil the contractual purposes of the Agreement as specified in these
                Terms. This includes but is not limited to:
              </p>
              <ol type="1">
                <li>
                  <p>
                    A non-exclusive, non-transferable, worldwide right to copy the Content and to
                    make all adaptions necessary to import the Content onto the Platform;
                  </p>
                </li>
                <li>
                  <p>
                    Making the Content available to be viewed on or downloaded from the Platform by
                    other Users;
                  </p>
                </li>
                <li>
                  <p>
                    A non-exclusive, transferable, worldwide right to copy the Content, display the
                    Content in public and to make the Content perceivable to the public as well as
                    publicly available on the platform; and
                  </p>
                </li>
                <li>
                  <p>
                    A perpetual, non-exclusive, transferable, worldwide right to copy and analyze
                    the Content as well as make all necessary adaptions to it for LibScie’s own
                    business purposes.
                  </p>
                </li>
              </ol>
            </li>
            <li>
              <p>
                The User warrants that the User is entitled and has the full right and legal
                authority to enter into this Agreement and to grant all necessary rights and
                licenses and that by doing so neither the User nor LibScie will infringe the rights
                of any third party. If the User is only a co-creator of the Content, the User
                warrants that the User has the permission of all other co-creators to grant LibScie
                all rights pursuant to this Section 5. The User will name all co-creators in the
                respective fields on the Platform.
              </p>
            </li>
            <li>
              <p>
                The User understands that a published Research Module will be constantly available
                on the Platform independent of the User having an active account. The deletion of a
                Research Module is only possible under very special and very rare circumstances and
                only after due scientific process.
              </p>
            </li>
            <li>
              <p>
                Depending on the type of license the User chooses, the following rules apply
                additionally. The license that the User grants to LibScie under Section 5.1.2
                remains untouched by this choice.
              </p>
            </li>
          </ol>
          <h3 id="licensing-for-free-under-cc0-and-cc-by-4.0-zero-cost">
            5.2 Licensing for free under CC0 and CC BY 4.0 (“Zero Cost”)
          </h3>
          <ol type="1">
            <li>
              <p>
                LibScie provides the User with the option to license each Research Module under a{" "}
                <a href="https://creativecommons.org/publicdomain/zero/1.0/legalcode">
                  CC0 (CC0 1.0 Universal Public Domain Dedication)
                </a>{" "}
                or{" "}
                <a href="https://creativecommons.org/licenses/by/4.0/legalcode">
                  CC BY 4.0 (Creative Commons Attribution 4.0 International Public License)
                </a>{" "}
                license free of charge by approving the authors connected with the publication,
                choosing the respective license and completing the publication process by clicking
                on “Publish”.
              </p>
            </li>
            <li>
              <p>
                Which license conditions apply specifically is governed by the respective license
                text. The User can find more information on the respective licenses under{" "}
                <a href="https://creativecommons.org/licenses/">
                  https://creativecommons.org/licenses
                </a>
                .
              </p>
            </li>
            <li>
              <p>
                Once published, the User cannot revoke the CC0 Public Domain Dedication or CC BY
                4.0-license.
              </p>
            </li>
          </ol>
          <h3 id="licensing-against-remuneration-pay-to-close">
            5.3 Licensing against remuneration (“Pay to close”)
          </h3>
          <ol type="1">
            <li>
              <p>
                LibScie provides the User with the option to license each Research Module under
                certain other Licenses against a one-time remuneration. Available Licenses and
                prices are shown directly on the Platform and may change from time to time.
              </p>
            </li>
            <li>
              <p>
                Which license conditions apply specifically is governed by the respective license
                text. The User can find more information on the respective licenses under{" "}
                <a href="https://creativecommons.org/licenses/">
                  https://creativecommons.org/licenses
                </a>
                .
              </p>
            </li>
            <li>
              <p>
                The contract about the publication under a license against remuneration is concluded
                when the User chooses the license module, proceeds to the payment page by clicking
                completing the publication process and makes a binding offer by clicking on “Pay”.
                LibScie will then accept the offer and send a confirmation email to the User.
              </p>
            </li>
            <li>
              <p>
                The User pays the remuneration only for the initial publication of the Research
                Module on the Platform under the selected license. The subsequent provision of the
                Research Modules for the duration of the Agreement is not part of the chargeable
                service and will still be free of charge in accordance with the terms of this
                Agreement.
              </p>
            </li>
            <li>
              <p>
                If the User chooses a Creative Commons License, the User will not be able to revoke
                the license after making his or her choice.
              </p>
            </li>
          </ol>
          <h2 id="collections">
            6. <strong>Collections</strong>
          </h2>
          <p className="pl-4">
            <strong>
              1. On the Platform, Users can create so called Collections on Workspaces. In these
              Collections, Users can collate published Research Modules or Works from other sources
              in a list. The only requirement is that the Work can be processed by the platform
              (e.g., through a DOI).
            </strong>
          </p>
          <p className="pl-4">
            <strong>
              2. If a User adds a Work to their Collection, LibScie where needed will import the
              metadata of the Work and will add the information about the Work to the Collection.
              The Work itself will not be imported to the Platform.
            </strong>
          </p>
          <p className="pl-4">
            <strong>
              3. Collections can serve different purposes and the Platform provides different types
              of Collections for free or against remuneration:
            </strong>
          </p>
          <p className="pl-8">
            <strong>
              1. Individual Collection: Every User has one free Individual Collection. The User can
              add indefinite Works to their Individual Collection. The Individual Collection is
              visible for other Users on the Platform.
            </strong>
          </p>
          <p className="pl-8">
            <strong>
              2. Collaborative Collection: Users can purchase against remuneration additional
              Collections. These additional Collections are called Collaborative Collections and
              have generally the same set of features as Individual Collections. In addition to the
              Individual Collection, up to a maximum of five Workspaces can manage a Collaborative
              Collection. The works listed in the Collaborative Collection can be edited or deleted,
              the Collaborative Collection itself though cannot be renamed or deleted and will
              remain permanently on the platform. The Collaborative Collection will receive a DOI.
            </strong>
          </p>
          <p className="pl-8">
            <strong>
              3. Community Collection: Users can purchase against remuneration a Community
              Collection. Community Collections are not only Collections of works but enable other
              Workspaces not editing the Collection to submit Works to them. No limit of managing
              Workspaces is applied.
            </strong>
          </p>
          <p>
            <h2 id="group-workspaces">
              7. <strong>Group Workspaces</strong>
            </h2>
          </p>
          <p>
            <strong>
              1. Users may work collaboratively on the Platform by creating Group Workspaces and
              subsequently inviting other Users.
            </strong>
          </p>
          <p>
            <strong>
              2. The creation of a Group Workspace and invitation of a User to a Group Workspace is
              subject to a remuneration. The User pays a one-time remuneration per Group Workspace
              per User. The Membership of a User to a Group Workspace is not transferable to another
              User.
            </strong>
          </p>
          <p>
            <strong>
              3. If an invitation to a Group Workspace is declined, the invitation will become
              available again and can be send to another User. If an invitation is not responded to
              for 30 days (counted from sending the invitation), it will become available again.
            </strong>
          </p>
          <p>
            <strong>
              4. If a User is removed from a Group Workspace by an Admin or Owner of the Group
              Workspace, the invitation will not become available again and the invitation is
              forfeit.
            </strong>
          </p>
          <p>
            <h2 id="payment">
              8. <strong>Payment</strong>
            </h2>
          </p>
          <ol type="1">
            <li>
              <p>
                All prices shown on the Platform are final prices including VAT and - if applicable
                - transport costs.
              </p>
            </li>
            <li>
              <p>
                <strong>
                  For some of the chargeable features such as the “Pay to close” option or
                  Collections, LibScie may offer a “Pay what you want” option. If a User chooses
                  this option, they can within a pre-defined range – decide the exact price that
                  they wish to pay for the re-spective feature.
                </strong>
              </p>
            </li>
          </ol>
          <p className="pl-4">
            <strong>3.</strong> The payment is due immediately after the conclusion of contract.
            LibScie uses the payment provider Stripe (of Stripe Payments Europe, Ltd., 1 Grand Canal
            Street Lower, Grand Canal Dock, Dublin, Ireland). Stripe provides several options to
            process the payment, including Credit Card, iDeal, Klarna, Apple Pay and Google Pay.
            LibScie will show the specific options on the Platform. A transfer via SEPA is not
            supported. The payment process may be subject to separate terms depending on the chosen
            option.
          </p>
          <h2 id="term-and-termination">
            <del>7.</del>
            <strong>9.</strong> Term and Termination
          </h2>
          <ol type="1">
            <li>
              <p>
                The term of this Agreement commences with the User’s registration. Both parties can
                terminate the Agreement with effect to the end of each month by sending a
                termination notice at least in written form (email to suffice). The User can delete
                their Account at any time. Deleting the Account will not affect published Research
                Modules on the Platform and Workspaces linked to these Modules.
              </p>
            </li>
            <li>
              <p>
                The right of both parties to terminate this Agreement for good cause shall remain
                unaffected.
              </p>
            </li>
            <li>
              <p>
                The licenses granted by the User to LibScie as well as the publication of the
                metadata of the Research Module on the Platform shall remain unaffected by the
                termination.
              </p>
            </li>
          </ol>
          <h2 id="availability-and-maintenance">
            <del>8.</del>
            <strong>10.</strong> Availability and Maintenance
          </h2>
          <ol type="1">
            <li>
              <p>
                LibScie shall implement appropriate measures to ensure the continuous availability
                and error-free functionality of the Platform. However, the User acknowledges that
                for technical reasons and due to the dependence on external influences, LibScie
                cannot guarantee the uninterrupted availability of the platform. LibScie provides
                the User with statistics on its up- and downtimes on{" "}
                <a href="https://up.researchequals.com/">https://up.researchequals.com/</a>.
              </p>
            </li>
            <li>
              <p>
                LibScie will occasionally carry out maintenance tasks to ensure the functionality or
                extension of the platform. These tasks may lead to a temporary impairment of the
                usability of the Platform. Insofar LibScie shall carry out the maintenance tasks
                during periods of low use.
              </p>
            </li>
          </ol>
          <h2 id="warranty">
            <del>9.</del>
            <strong>11.</strong> Warranty
          </h2>
          <p>
            If the User is a Consumer and chooses a Pay to Close License model, the statutory
            regulations (
            <a href="https://www.gesetze-im-internet.de/englisch_bgb/englisch_bgb.html#p1204">
              Sec. 327 et seq. BGB
            </a>
            ) regarding the warranty for digital products apply to the publication under the
            restricted license.
          </p>
          <h2 id="liability-and-indemnification">
            <del>10.</del>
            <strong>12.</strong> Liability and Indemnification
          </h2>
          <ol type="1">
            <li>
              <p>LibScie shall be liable in accordance with the statutory provisions.</p>
            </li>
            <li>
              <p>
                The User is responsible for ensuring the routine backup of User data, in particular
                the Content uploaded onto the Platform. Irrespective of Sections 9.1 to 9.6 of these
                Terms, if the User suffers damages that result from the loss of data, LibScie shall
                in each case only be liable for such damages that could not have been avoided by
                carrying out data backups of all relevant data in regular intervals.
              </p>
            </li>
            <li>
              <p>
                The User agrees to indemnify, defend and hold LibScie, its officers, directors,
                agents, affiliates, distribution partners, licensors and suppliers harmless from and
                against any and all claims, actions, proceedings, costs, liabilities, losses and
                expenses (including, but not limited to, reasonable attorneys’ fees) (collectively,
                “Claims”) suffered or incurred by such indemnified parties resulting from or arising
                out of any actual or alleged breach of the User’s obligations, warranties and
                guarantees under these Terms or violation of any third party’s rights, provided that
                the breach or violation in question was or would have been a culpable breach or
                violation. LibScie shall inform the User without delay of any such Claim, and will
                provide the User with any reasonably available information on the Claim to
                facilitate the User’s cooperation in defending against the Claim. The User shall
                cooperate as fully as reasonably required in the defense of any Claim. LibScie
                reserves the right, at its own expense, to assume the exclusive defense and control
                of any matter subject to indemnification by the User.
              </p>
            </li>
          </ol>
          <h2 id="right-of-withdrawal">
            <del>11.</del>
            <strong>13.</strong> Right of Withdrawal
          </h2>
          <p>
            If the user acts as a Consumer, the User has a fourteen-day right of withdrawal.
            Regarding this right of withdrawal, please refer to{" "}
            <a href="https://researchequals.com/right-of-withdrawal">the Addendum 1</a>.
          </p>
          <h2 id="data-protection">
            <del>12.</del>
            <strong>14.</strong> Data Protection
          </h2>
          <ol type="1">
            <li>
              <p>
                For a comprehensive information on how LibScie collects, processes or uses personal
                data of the User in the context of the Agreement and the usage of the Platform,
                please refer to LibScie’s{" "}
                <a href="https://researchequals.com/privacy">Privacy Policy</a>.
              </p>
            </li>
            <li>
              <p>
                Insofar as the Content, Research Modules or any other material of the User that the
                User provides to the Platform to make it publicly available contains personal data
                of third parties, the User remains the controller of such data and LibScie shall act
                as the User’s processor of personal data pursuant to the GDPR. For these purposes,
                the parties conclude the data processing agreement in{" "}
                <a href="https://researchequals.com/dpa">Addendum 2</a>.
              </p>
            </li>
            <li>
              <p>
                It is stated for clarification that LibScie will act as a processor only with regard
                to personal data included in the Content or Research Module and not with regard to
                the Content or Research Module as such.
              </p>
            </li>
            <li>
              <p>
                The parties agree that LibScie may fulfil any deletion request based on{" "}
                <a href="https://researchequals.com/dpa">the Data Processing Agreement</a>,
                especially according to its Clause 10 (d), by anonymization of the personal data
                included in the Content and/or Research Module instead of deleting the Content
                and/or Research Module itself. For the deletion of the Research Module itself
                Section 5 of the Terms applies.
              </p>
            </li>
          </ol>
          <h2 id="changes-to-the-terms">
            <del>13.</del>
            <strong>15.</strong> Changes to the Terms
          </h2>
          <ol type="1">
            <li>
              <p>
                LibScie has the right to introduce additional functions to the Platform and add
                corresponding rules to the Terms. LibScie shall announce these changes at least four
                weeks before they enter into force to the user by email. If the User does not object
                in text form (e.g. letter, fax, e-mail) within a period of two weeks, beginning with
                the day following the announcement of the changes, LibScie assumes that the User
                agrees to the changes.
              </p>
            </li>
            <li>
              <p>
                LibScie shall inform the User in the notice of his right to object, its requirements
                and consequences. If the User objects to the changes, the contractual relationship
                shall be continued under the most recent version of the Terms before the change. In
                such case, LibScie reserves the right to terminate the contractual relationship with
                effect to the next possible date.
              </p>
            </li>
            <li>
              <p>
                Otherwise, a change of the terms of use is possible at any time with the consent of
                the user.
              </p>
            </li>
          </ol>
          <h2 id="miscellaneous">
            <del>14.</del>
            <strong>16.</strong> Miscellaneous
          </h2>
          <ol type="1">
            <li>
              <p>
                The sole place of jurisdiction for all differences arising out of or in connection
                with this Agreement shall be Berlin, Germany if the User is a merchant pursuant to
                the German Commercial Code (Handelsgesetzbuch), a legal entity of public law or a
                public special fund. Additionally, this shall be the case if the User’s place of
                residence or usual place of residence is unknown at the time of making the complaint
                is filed or it is moved out of the scope of the German Code of Civil Procedure after
                the Agreement is concluded. Statutory provisions regarding exclusive jurisdiction
                shall remain unaffected.
              </p>
            </li>
            <li>
              <p>
                This Agreement shall be governed and construed in accordance with the laws of the
                Federal Republic of Germany under exclusion of German International Private Law and
                the UN Convention on the International Sale of Movable Goods.
              </p>
            </li>
            <li>
              <p>
                If any provision of this Agreement is entirely or partly invalid or unenforceable,
                this shall not affect the validity and enforceability of any other provision of this
                Agreement. The invalid or unenforceable provision shall be regarded as replaced by
                such valid and enforceable provision that as closely as possible reflects the
                economic purpose that both parties hereto had pursued with the invalid or
                unenforceable provision.
              </p>
            </li>
            <li>
              <p>
                The European Commission provides an Online Dispute Resolution (ODR) platform for the
                out-of-court resolution of disputes concerning contractual obligations with
                consumers as it is defined in Article 4 of EU Directive No 11/2013. The platform can
                be accessed under{" "}
                <a href="http://ec.europa.eu/consumers/odr/">http://ec.europa.eu/consumers/odr/</a>.
                Neither does LibScie participates in such ODR nor does LibScie use alternative
                dispute resolution (ADR) procedures to resolve disputes with consumers.
              </p>
            </li>
            <li>
              <p>Information about LibScie:</p>
              <p>Liberate Science GmbH Ebertystraße 44, 10249 Berlin, Germany, info@libscie.org;</p>
              <p>
                Registered at Amtsgericht Charlottenburg (Berlin), HRB 211 450, VAT ID DE326772207,
                EORI DE804962659955787;
              </p>
              <p>Legal Representative: Chris Hartgerink</p>
            </li>
          </ol>
          <p>
            Berlin, <del>January</del>
            <strong>September</strong> 2022
          </p>
        </div>
      </main>
    </>
  )
}

TermsDiffPage20220916.suppressFirstRenderFlicker = true
TermsDiffPage20220916.getLayout = (page) => (
  <Layout title="R= Track changes Terms (2022-09-16)">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default TermsDiffPage20220916
