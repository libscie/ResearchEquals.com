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

const termsMarkdown = `
# Terms of use

## 1. Scope and Applicability

Liberate Science GmbH (c/o ImpactHub), Rollbergstraße 28A, 12053 Berlin, Germany ("LibScie" or "we/us/our") provides an online publishing platform for Research Modules that is accessible under [https://researchequals.com](https://researchequals.com) (the "Platform"). The ResearchEquals logo is a [Pentagram](https://pentagram.de/de/projekte/) design.

These Terms of Use ("the Terms") guide the legal relationship between LibScie and the User ("the Agreement") and apply to all (especially legal binding) actions of the User and LibScie on or in connection with the Platform, including the registration of a User Account on the Platform.

## 2. Definitions

1. “Collections”: A list of Works curated by the User on the Platform.

2. "Consumer": As defined in [Sec. 13 BGB](https://www.gesetze-im-internet.de/englisch_bgb/englisch_bgb.html#p0050) (Bürgerliches Gesetzbuch, German Civil Law Code). Every natural person who enters into a legal transaction for purposes that predominantly are outside his trade, business or profession.

3. "Content": Any type of media (for example text, audio or video files, presentations etc.) uploaded to the Platform by a User to be published as a Research Module.

4. “Individual Collection”: Collection created and managed by one workspace, which cannot have multiple editors or external submissions.

5. “Collaborative Collection”: Collection created by one workspace and managed by up to five workspaces, which cannot have external submissions.

6. “Community Collection”: Collection created by one workspace and managed by unlimited workspaces, with external submissions.

7. "Research Module": Content that shall be Published on the Platform.

8. "User": A natural person that registers for and uses the Platform.

9. "User Account" or "Account": The personal account provided by LibScie to the User on the Platform after the User's registration.

10. “Supporting Member”: A User that subscribes for a Supporting Membership.

11. “Supporting Membership”: The legal relationship between LibScie and the Supporting Member.

12. “Work”: Any published work included in the ResearchEquals database (e.g., publications that have a DOI), independent of the specific source they are published on.

13. "Workspace" or "Space": The author profile(s) linked to the User Account on the Platform upon registration and additional Workspaces created while logged in to the Account.

## 3. Conclusion of the Agreement and Registering an Account

1. While certain parts of the Platform are freely accessible, the User has to open a User Account to upload Content and publish Research Modules on the Platform. Opening a User Account is free of charge for the User.

2. The User can sign up directly by visiting the website [https://researchequals.com](https://researchequals.com). The User has to be at least 18 years old and in full legal capacity to open a user account.

3. During the sign up, the User has to provide certain basic information, including an email address and a password. The User can rectify the Account or Workspace information at any time the settings of the Account or Workspace.

4. By clicking on "Sign Up", the User asks LibScie to create an Account and Workspace on the Platform. LibScie will send an email with a legally binding offer to open the account and to confirm the User's email address. By clicking on “confirm email”, the User accepts the offer, concludes the contract with LibScie and opens the Account.

5. By signing up, the User also agrees to the [Liberate Science Code of Conduct](https://researchequals.com/coc) and procedures outlined in it.

6. The User shall keep the Account information, and especially the chosen password, confidential and not disclose it to any third party. Any abuse or suspected abuse shall be reported to LibScie immediately.

7. The User can access these terms anytime on the Platform in the most recent version. The Agreement is concluded in English and the Terms are available in English exclusively.

## 4. Basic Functions and Rules of the Platform

1. The Platform provides basic functions to all registered Users. The User can for example search the Platform for Research Modules and Content to view or download them. LibScie makes no guarantees about the availability of the Platform.

2. The User Account is private. Workspaces are public.

3. The User ensures compliance to the basic rules of the Platform at any time. On the Platform, it is forbidden:

   - To upload and distribute insulting, abusive, offensive, racist, threatening, youth protection law infringing, pornographic, personal rights infringing, promoting violence or sedition, inciting criminal acts, providing instructions on how to commit criminal acts or services that involve pornographic and/or erotic Content or any other illegal Content;
   - To upload and distribute Content that has been copied, in whole or in any part, from any other protected work or material without the permission of the respective copyright owner;
   - To upload and distribute Content that affects or infringes the rights of any third party, in particular personal rights, copyrights or other intellectual property rights or any other third party rights;
   - To upload and distribute Content that contains personal, confidential or non-public information;
   - To contact other Users of the Platform in a not respectful and impolite manner as well as in order to buy or sell any products or services;
   - To provide wrong data or information, and to provide data or information of any third party; or
   - To sell or otherwise transfer the User Account to another person.

In cases where research purposes may provide exception to these rules, the User is required to provide qualifying information in the Research Module, which can serve as grounds for exception at the discretion of LibScie.

## 5. Submitting and Licensing Content on the Platform

### 5.1 Submitting and Licensing Content as Research Modules – General Rules

1. On the Platform, the User can publish Content as Research Modules under different open or closed licenses and LibScie will make these Research Modules publicly available on the respective Workspace. The User can create several Workspaces. LibScie provides a separate URL for each Workspace. LibScie reserves the right to delete or rectify any Content or Research Modules that does not comply with this Agreement and/or infringes the rights of third parties.

2. The User submits the Content for publication as a Research Module by filling out the relevant form on the Platform and by uploading the Content. Before the publication, the User can rectify any information given by using the technical means of the Platform.

3. The Content has to meet certain technical criteria (e.g., certain file formats, sizes etc.). LibScie will specify these formats in a separate information available on the Platform, currently available under [https://researchequals.com/faq](https://researchequals.com/faq) (the link and criteria may be subject to change from time to time).

4. LibScie provides a Digital Object Identifier (“DOI”) for each Research Module. A DOI is a persistent identifier or handle used to identify objects uniquely, standardized by the International Organization for Standardization (ISO). The DOI requires that the Research Module is permanently accessible on the Platform.

5. Independently of the license the User chooses to publish the Research Module under, the User grants LibScie and LibScie accepts by uploading the Content all rights necessary to fulfil the contractual purposes of the Agreement as specified in these Terms. This includes but is not limited to:

   1. A non-exclusive, non-transferable, worldwide right to copy the Content and to make all adaptions necessary to import the Content onto the Platform;

   2. Making the Content available to be viewed on or downloaded from the Platform by other Users;

   3. A non-exclusive, transferable, worldwide right to copy the Content, display the Content in public and to make the Content perceivable to the public as well as publicly available on the platform; and

   4. A perpetual, non-exclusive, transferable, worldwide right to copy and analyze the Content as well as make all necessary adaptions to it for LibScie's own business purposes.

6. The User warrants that the User is entitled and has the full right and legal authority to enter into this Agreement and to grant all necessary rights and licenses and that by doing so neither the User nor LibScie will infringe the rights of any third party. If the User is only a co-creator of the Content, the User warrants that the User has the permission of all other co-creators to grant LibScie all rights pursuant to this Section 5. The User will name all co-creators in the respective fields on the Platform.

7. The User understands that a published Research Module will be constantly available on the Platform independent of the User having an active account. The deletion of a Research Module is only possible under very special and very rare circumstances and only after due scientific process.

8. Depending on the type of license the User chooses, the following rules apply additionally. The license that the User grants to LibScie under Section 5.1.2 remains untouched by this choice.

### 5.2 Licensing for free under CC0 and CC BY 4.0 (“Zero Cost”)

1. LibScie provides the User with the option to license each Research Module under a [CC0 (CC0 1.0 Universal Public Domain Dedication)](https://creativecommons.org/publicdomain/zero/1.0/legalcode) or [CC BY 4.0 (Creative Commons Attribution 4.0 International Public License)](https://creativecommons.org/licenses/by/4.0/legalcode) license free of charge by approving the authors connected with the publication, choosing the respective license and completing the publication process by clicking on “Publish”.

2. Which license conditions apply specifically is governed by the respective license text. The User can find more information on the respective licenses under [https://creativecommons.org/licenses](https://creativecommons.org/licenses/).

3. Once published, the User cannot revoke the CC0 Public Domain Dedication or CC BY 4.0-license.

### 5.3 Licensing against remuneration (“Pay to close”)

1. LibScie provides the User with the option to license each Research Module under certain other Licenses against a one-time remuneration. Available Licenses and prices are shown directly on the Platform and may change from time to time.

2. Which license conditions apply specifically is governed by the respective license text. The User can find more information on the respective licenses under [https://creativecommons.org/licenses](https://creativecommons.org/licenses/).

3. The contract about the publication under a license against remuneration is concluded when the User chooses the license module, proceeds to the payment page by clicking completing the publication process and makes a binding offer by clicking on “Pay”. LibScie will then accept the offer and send a confirmation email to the User.

4. The User pays the remuneration only for the initial publication of the Research Module on the Platform under the selected license. The subsequent provision of the Research Modules for the duration of the Agreement is not part of the chargeable service and will still be free of charge in accordance with the terms of this Agreement.

5. If the User chooses a Creative Commons License, the User will not be able to revoke the license after making his or her choice.

## 6. Collections

1. On the Platform, Users can create so called Collections on Workspaces. In these Collections, Users can collate published Research Modules or Works from other sources in a list. The only requirement is that the Work can be processed by the platform (e.g., through a DOI).

2. If a User adds a Work to their Collection, LibScie where needed will import the metadata of the Work and will add the information about the Work to the Collection. The Work itself will not be imported to the Platform.

3. Collections can serve different purposes and the Platform provides different types of Collections for free or against remuneration:

   1. Individual Collection: Every User has one free Individual Collection. The User can add indefinite Works to their Individual Collection. The Individual Collection is visible for other Users on the Platform.

   2. Collaborative Collection: Users can purchase against remuneration additional Collections. These additional Collections are called Collaborative Collections and have generally the same set of features as Individual Collections. In addition to the Individual Collection, up to a maximum of five Workspaces can manage a Collaborative Collection. The works listed in the Collaborative Collection can be edited or deleted, the Collaborative Collection itself though cannot be renamed or deleted and will remain permanently on the platform. The Collaborative Collection will receive a DOI.

   3. Community Collection: Users can purchase against remuneration a Community Collection. Community Collections are not only Collections of works but enable other Workspaces not editing the Collection to submit Works to them. No limit of managing Workspaces is applied.

## 7. Group Workspaces

1. Users may work collaboratively on the Platform by creating Group Workspaces and subsequently inviting other Users.

2. The creation of a Group Workspace and invitation of a User to a Group Workspace is subject to a remuneration. The User pays a one-time remuneration per Group Workspace per User. The Membership of a User to a Group Workspace is not transferable to another User.

3. If an invitation to a Group Workspace is declined, the invitation will become available again and can be send to another User. If an invitation is not responded to for 30 days (counted from sending the invitation), it will become available again.

4. If a User is removed from a Group Workspace by an Admin or Owner of the Group Workspace, the invitation will not become available again and the invitation is forfeit.

## 8. Supporting Membership

### 8.1 General

1. Users can become Supporting Members.

2. The relationship between the Supporting Member and LibScie is guided by the following provisions.

3. Except for the following provisions, the Supporting Members have no right to participate or determine or control any action or decision of LibScie or LibScie's management. In particular, the Supporting Members have no powers to manage and/or represent LibScie. The Supporting Members will in no way participate in the profits or losses of LibScie whatsoever.

4. The contract about the Supporting Membership is concluded when the User chooses the subscription plan, proceeds to the payment page and makes a binding offer by clicking on “Pay”. LibScie will then accept the offer and send a confirmation email to the User.

### 8.2 Rights of Supporting Members

1. **Information Request:** Each Supporting Member has the right to request specific information from LibScie, pertaining to information that has not yet been shared within the Membership Area.

   1. These requests serve the purpose of transparency and accountability of LibScie to the Supporting Members, comparable to freedom of information requests.

   2. The request may include, but is not limited to, operational statistics (e.g., finances, registrations).

   3. The request does not need to be justified by the requester.

   4. LibScie must provide a response within four (4) weeks upon receipt. LibScie may announce a delayed response before the end of those four weeks, to a maximum of eight (8) weeks after the request was received.

   5. LibScie can deny a request with plausible justification (e.g., previously answered, lack of specificity, privacy objections, not enough resources to fulfill requests, secrecy obligations). LibScie must make best efforts to provide answers to requests to a reasonable extent.

   6. Responses to requests will be distributed among all active Supporting Members at that time.

   7. The requester's identity will not be made public by LibScie.

2. **Right to petition:** Each Supporting Member has the right to petition. Such petition can have a call to a certain action or a call to cease and desist from a certain action as a subject.

   1. LibScie is bound to respond to and take a stand on petitions that are issued by a collective of at least 50 Supporting Members or at least 5% of active Supporting Members. LibScie shall take the subject of the petition into consideration. However, LibScie is not obligated to carry out or implement the requested action or cease and desist in any way.

   2. LibScie must response to a petition in the same timeframe and procedure as for request for information set out in Section 8.2.1.4.

   3. A petition can include a call for a Special Assembly. Such petition must include a set of proposed agenda items and descriptions for each item. LibScie must then schedule a Special Assembly as soon as possible. Where the most recent Assembly or Special Assembly took place not more than eight (8) weeks prior to the moment the petition is handed over to LibScie, LibScie has the right to schedule the petition not before this 8 week period is over.

3. **Poison Pill:** The Supporting Membership shall provide safety that LibScie remains in safe hands. Therefore, LibScie and its shareholders must inform all Supporting Members about any acquisition offers to either itself or to its shareholders that would result in a major shareholder change. [The Poison Pill](https://researchequals.com/legal/poison-pill) is a separate three-sided contract concluded between LibScie, the Supporting Member and the Shareholder, concluded during signup.

### 8.3 Assemblies

1. LibScie shall conduct regular Assemblies for its Supporting Members.

   1. Assemblies convene once every quarter.

   2. Assemblies can be held in-person, virtual or hybrid.

   3. Assemblies must be called six weeks in advance.

   4. Assemblies serve an informational purpose about the most recent developments within LibScie. Assemblies can also include votes (see below Section 8.4).

2. LibScie shall be responsible for the organization. LibScie shall also name a person filling the role of the chair for each Assembly. The chair of an Assembly will decide all matters of process that are not dealt with in this agreement.

3. Agendas for Assemblies shall be announced by Liberate Science at least two workweeks before the date of the Assembly. Supporting members can propose agenda items to LibScie through petitions. They shall be given to LibScie up to three weeks prior to an Assembly to Liberate Science.

4. LibScie may specify additional rules regarding convening and conducting of an Assembly that specify the provisions of these terms. These rules will be communicated to all Supporting Members and be accessible in the Membership Area.

### 8.4 Voting Procedures

1. In case a vote is called, the following voting procedures shall be required:

   1. For a minority vote: >25% of votes cast

   2. Majority vote: >50% of votes cast

   3. Special majority vote: >75% of votes cast

2. Votes are valid if a quorum is reached (i.e., at least 20% of supporting members voted).

### 8.5 Privacy and Confidentiality

1. The Supporting Member agrees to not disclose any information about other Supporting Members to a third party without their consent.

2. The Supporting Member agrees to respect any notices of explicit confidentiality. LibScie as well as any Supporting Members that shares original information may deem them as "confidential", "secret", or other terminology denoting it's circulation is limited to the Supporting Members.

3. The Supporting Member agrees that they may disclose information shared by LibScie, unless it is marked confidential, secret or in a similar way.

## 9. Payment

1. All prices shown on the Platform are final prices including VAT and - if applicable - transport costs.

2. For some of the chargeable features such as the “Pay to close” option or Collections, LibScie may offer a “Pay what you want” option. If a User chooses this option, they can within a predefined range – decide the exact price that they wish to pay for the respective feature.

3. The payment is due immediately after the conclusion of contract. LibScie uses the payment provider Stripe (of Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Ireland). Stripe provides several options to process the payment, including Credit Card, iDeal, Klarna, Apple Pay and Google Pay. LibScie will show the specific options on the Platform. A transfer via SEPA is not supported. The payment process may be subject to separate terms depending on the chosen option.

## 10. Term and Termination

1. The term of this Agreement commences with the User's registration. Both parties can terminate the Agreement with effect to the end of each month by sending a termination notice at least in written form (email to suffice). The User can delete their Account at any time. Deleting the Account will not affect published Research Modules on the Platform and Workspaces linked to these Modules.

2. The Term of the Supporting Membership commences with its purchase and lasts either a month or a year, depending on the Supporting Member’s choice. The Parties can terminate the Supporting Membership at any time with effect to the end of the respective contractual period. After this first contractual period, the Membership will automatically renew itself for an indefinite period. The Parties may then terminate the contract with effect to the end of each month. If the Supporting Member is on a yearly payment plan and terminates the contract before the end of the payment period, LibScie shall refund the remaining remuneration between the effective date of termination and the end of the payment period.

3. The right of both parties to terminate this Agreement for good cause shall remain unaffected.

4. The licenses granted by the User to LibScie as well as the publication of the metadata of the Research Module on the Platform shall remain unaffected by the termination.

## 11. Availability and Maintenance

1. LibScie shall implement appropriate measures to ensure the continuous availability and error-free functionality of the Platform. However, the User acknowledges that for technical reasons and due to the dependence on external influences, LibScie cannot guarantee the uninterrupted availability of the platform. LibScie provides the User with statistics on its up- and downtimes on [https://up.researchequals.com/](https://up.researchequals.com/).

2. LibScie will occasionally carry out maintenance tasks to ensure the functionality or extension of the platform. These tasks may lead to a temporary impairment of the usability of the Platform. Insofar LibScie shall carry out the maintenance tasks during periods of low use.

## 12. Warranty

If the User is a Consumer and chooses a Pay to Close License model, the statutory regulations ([Sec. 327 et seq. BGB](https://www.gesetze-im-internet.de/englisch_bgb/englisch_bgb.html#p1204)) regarding the warranty for digital products apply to the publication under the restricted license.

## 13. Liability and Indemnification

1. LibScie shall be liable in accordance with the statutory provisions.

2. The User is responsible for ensuring the routine backup of User data, in particular the Content uploaded onto the Platform. Irrespective of Sections 9.1 to 9.6 of these Terms, if the User suffers damages that result from the loss of data, LibScie shall in each case only be liable for such damages that could not have been avoided by carrying out data backups of all relevant data in regular intervals.

3. The User agrees to indemnify, defend and hold LibScie, its officers, directors, agents, affiliates, distribution partners, licensors and suppliers harmless from and against any and all claims, actions, proceedings, costs, liabilities, losses and expenses (including, but not limited to, reasonable attorneys' fees) (collectively, “Claims”) suffered or incurred by such indemnified parties resulting from or arising out of any actual or alleged breach of the User's obligations, warranties and guarantees under these Terms or violation of any third party's rights, provided that the breach or violation in question was or would have been a culpable breach or violation. LibScie shall inform the User without delay of any such Claim, and will provide the User with any reasonably available information on the Claim to facilitate the User's cooperation in defending against the Claim. The User shall cooperate as fully as reasonably required in the defense of any Claim. LibScie reserves the right, at its own expense, to assume the exclusive defense and control of any matter subject to indemnification by the User.

## 14. Right of Withdrawal

If the user acts as a Consumer, the User has a fourteen-day right of withdrawal. Regarding this right of withdrawal, please refer to [the Addendum 1](https://researchequals.com/right-of-withdrawal).

## 15. Data Protection

1. For a comprehensive information on how LibScie collects, processes or uses personal data of the User in the context of the Agreement and the usage of the Platform, please refer to LibScie's [Privacy Policy](https://researchequals.com/privacy).

2. Insofar as the Content, Research Modules or any other material of the User that the User provides to the Platform to make it publicly available contains personal data of third parties, the User remains the controller of such data and LibScie shall act as the User's processor of personal data pursuant to the GDPR. For these purposes, the parties conclude the data processing agreement in [Addendum 2](https://researchequals.com/dpa).

3. It is stated for clarification that LibScie will act as a processor only with regard to personal data included in the Content or Research Module and not with regard to the Content or Research Module as such.

4. The parties agree that LibScie may fulfil any deletion request based on [the Data Processing Agreement](https://researchequals.com/dpa), especially according to its Clause 10 (d), by anonymization of the personal data included in the Content and/or Research Module instead of deleting the Content and/or Research Module itself. For the deletion of the Research Module itself Section 5 of the Terms applies.

## 16. Changes to the Terms

1. LibScie has the right to introduce additional functions to the Platform and add corresponding rules to the Terms. LibScie shall announce these changes at least four weeks before they enter into force to the user by email. If the User does not object in text form (e.g. letter, fax, e-mail) within a period of two weeks, beginning with the day following the announcement of the changes, LibScie assumes that the User agrees to the changes.

2. LibScie shall inform the User in the notice of his right to object, its requirements and consequences. If the User objects to the changes, the contractual relationship shall be continued under the most recent version of the Terms before the change. In such case, LibScie reserves the right to terminate the contractual relationship with effect to the next possible date.

3. Otherwise, a change of the terms of use is possible at any time with the consent of the user.

## 17. Miscellaneous

1. The sole place of jurisdiction for all differences arising out of or in connection with this Agreement shall be Berlin, Germany if the User is a merchant pursuant to the German Commercial Code (Handelsgesetzbuch), a legal entity of public law or a public special fund. Additionally, this shall be the case if the User's place of residence or usual place of residence is unknown at the time of making the complaint is filed or it is moved out of the scope of the German Code of Civil Procedure after the Agreement is concluded. Statutory provisions regarding exclusive jurisdiction shall remain unaffected.

2. This Agreement shall be governed and construed in accordance with the laws of the Federal Republic of Germany under exclusion of German International Private Law and the UN Convention on the International Sale of Movable Goods.

3. If any provision of this Agreement is entirely or partly invalid or unenforceable, this shall not affect the validity and enforceability of any other provision of this Agreement. The invalid or unenforceable provision shall be regarded as replaced by such valid and enforceable provision that as closely as possible reflects the economic purpose that both parties hereto had pursued with the invalid or unenforceable provision.

4. The European Commission provides an Online Dispute Resolution (ODR) platform for the out-of-court resolution of disputes concerning contractual obligations with consumers as it is defined in Article 4 of EU Directive No 11/2013. The platform can be accessed under [http://ec.europa.eu/consumers/odr/](http://ec.europa.eu/consumers/odr/). Neither does LibScie participates in such ODR nor does LibScie use alternative dispute resolution (ADR) procedures to resolve disputes with consumers.

5. Information about LibScie:

   Liberate Science GmbH (c/o ImpactHub), Rollbergstraße 28A, 12053 Berlin, Germany, info@libscie.org;

   Registered at Amtsgericht Charlottenburg (Berlin), HRB 211 450, VAT ID DE326772207, EORI DE804962659955787;

   Legal Representative: Chris Hartgerink

Berlin, December 2023
`

const md = new Markdown()

const TermsPage: BlitzPage = () => {
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
        <div className="mx-4 my-8 max-w-3xl text-black dark:text-white lg:mx-auto">
          <div
            className="coc "
            dangerouslySetInnerHTML={{ __html: md.render(termsMarkdown) }}
          ></div>
        </div>
      </main>
    </>
  )
}

TermsPage.suppressFirstRenderFlicker = true
TermsPage.getLayout = (page) => (
  <Layout title="R= Terms">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default TermsPage
