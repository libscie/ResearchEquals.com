import { BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import Markdown from "markdown-it"

import Navbar from "../core/components/Navbar"
import LayoutLoader from "app/core/components/LayoutLoader"

const privacyMarkdown = `
# Privacy policy

Liberate Science GmbH, Ebertystraße 44, 10249 Berlin (Germany) (“we”), operates the website ”ResearchEquals” (the “Platform or the “Site”), accessible at [https://researchequals.com](https://researchequals.com/). With this privacy policy, we inform you about the personal data we collect when you visit our Site and how we process it. Thereby, we also fulfil our obligation to inform you pursuant to Article 13 General Data Protection Regulation (GDPR).

## I. Identity of the controller

Liberate Science GmbH

Ebertystraße 44

10249 Berlin (Germany)

[info@libscie.org](mailto:info@libscie.org)

## II. Purposes of processing, its legal basis and the period for which the data will be stored

### 1. General use of the Site

Generally, we do not store personal data while you use our Site with the exception that our webserver registers all connections to the Site automatically and collects the following technical information about your visit:

- IP address
- Name of the files accessed
- Information about the transmission
- Date and time of the connection
- Amount of data transmitted
- Operating system and
- Web browser/user agent

We process this data to establish a connection to your device over the Internet. We store the aforementioned data in log files in order to ensure the security and integrity of our IT systems. The respective purposes of the processing also constitute our legitimate interests we pursue with it (Art. 6 par. 1 lit. f) GDPR). We retain our log files for 14 days and delete them thereafter.

### 2. Contact

You can contact us, for example, by writing an email. In such case, we will process the personal data you provide us with in order to answer your request. This may include especially your name, email address, subject of your message and the message itself. We will retain your messages until we have fulfilled your request. Afterwards, we will delete it immediately. We base the processing for such purposes on Art. 6 par. 1 lit. f) GDPR, while the purposes of the processing also constitute our legitimate interests we pursue with it.

### 3. Registration on the Platform

To use the publishing functions of our platform you have to register with us. During registration, we will ask you for an email address, a name of your initial workspace and a password. We will use your email address to send you a confirmation email to validate your address and account. If you do not validate your email address, your account will be deleted after 30 days. If you validate your email address, your account will be active until you delete it by using the functions of the platform. The legal basis for the processing described above is Art. 6 par. 1 lit. b) GDPR.

### 4. Functions of the Platform

On our platform we provide you with the necessary tools to publish content under cer-tain open access licenses. Some of these more open licenses are free while for other more restricted licenses you have to pay a fee (“pay to close”). We base any processing that is required to provide you with the functions of the platform or other services ac-cording to our terms of services on Art. 6 par. 1 lit. b) GDPR.

#### a) Publishing Content in general

We will process any of the information you provide to us – including meta information of the content and information about co-authors – to provide you with the functions of the platform and enable you to publish your works. If you publish a work, we will make it accessible on the platform under the chosen license. The content and the related information form a scientific work for which you granted us certain rights. We will keep the content and the related information on the platform even if you may close your account. Deletion of the content is only possible under rare and exceptional circumstances.

#### b) Publishing Content under a restrictive license (“Pay to close”)

When you choose to publish your content under a restrictive license (“pay to close”) you have to pay a fee. For the payment we use the service provider Stripe (Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Ireland). We will transfer certain information to Stripe such as a transaction ID, your chosen license and its price. Stripe will independently collect the necessary payment information (such as your Credit Card number or similar). Stripe will transfer a confirmation to us if the payment was successful. For more information on the processing by Stripe please refer to Stripe's privacy policy, accessible under [https://stripe.com/de/privacy](https://stripe.com/de/privacy).

#### c) Connecting to other services

We provide you with options to connect to certain services (such as Facebook, Google Drive, Dropbox, OneDrive or similar services) to directly upload content to the platform. In such case you have to log into the chosen service and grant us permission to access the files. We will only access the account information you explicitly grant us access to and we will not be able to see your log in credentials.

#### d) Registration with Crossref

When you publish content, we will register the content and information about it (including your name as author) with CrossRef who will in turn provide your content with a so-called DOI, a unique identifier that helps to make your content accessible to the scientific community.

#### e) Analysis of the uploaded content

We may analyse the uploaded content to gain more insights into the research on the platform, our users or our services and use these insights to improve our service or general research purposes. These purposes also constitute our legitimate interest, we base our processing on (Art. 6 par. 1 lit. f) GDPR).

### 5. Newsletter

You can subscribe to our newsletter on our Site. In this case, we will process your email address for sending our newsletters based on your consent (Art. 6 para. 1 lit. a) GDPR) until you withdraw your consent. You can withdraw your consent at any time, for example, by clicking on the unsubscribe link provided in every newsletter email or by contacting [info@libscie.org](mailto:info@libscie.org).

In addition, we process the time of registration and your double opt-in confirmation. We process your data for pursuing our legitimate interest and to be able to prove our compliance with the law. The legal basis for this is Art. 6 par. 1 lit. f) GDPR and Art. 6 par. 1 lit. c) GDPR in conjunction with Art. 5 par. 2 DSGVO.

We may analyze your use of our newsletter, e.g. whether you have opened it or clicked on certain links, and process this data to optimize and improve our newsletters. This purpose also represents our legitimate interest that we pursue with this processing (Art. 6 par. 1 lit. f) DSGVO).

### 6. Legal obligations to retain documents

We have the statutory obligation to retain certain documents according to Sec. 257 HGB (German Commercial Code) and Sec. 147 AO (Fiscal Code of Germany) as well as social security laws and employment laws. These documents may also include personal data. Specifically, these are:

- Accounts and records, inventories, annual financial statements, single fiscal statements according to Sec. 325 par. 2a HGB, group fiscal statements, situation reports, group situation reports the opening balance sheet as well as the operat-ing instructions and other organizational documents needed for their compre-hension, accounting records, documents pursuant to Article 15(1) and Article 163 of the Union Customs Code.

These documents have to be retained for a period of 10 years.

- Trade or business letters received, reproductions of trade or business letters sent, other documents to the extent that these are of relevance for taxation.

These documents have to be retained for a period of 6 years

The respective storage period shall begin upon the end of the calendar year in which the last entry was made in the accounts, the inventory, the opening balance sheet, the annual financial statement or the situation report drawn up, the trade or business letter received or sent, the accounting record created, the record made or the other documents created. The legal basis for such processing is Art. 6 par. 1 lit. c) GDPR.

## III. Recipients and transfers to third countries

If we are not able to provide services ourselves, we use external service providers. These service providers are primarily providers of IT services, such as our web host, e-mail provider or telecommunications provider.

If not specifically mentioned elsewhere in this privacy policy, we do not transfer your data to third countries.

We use external service providers if we are unable to provide services ourselves or if it is not reasonable to do so. These external service providers are primarily providers of IT services, such as our hoster, email provider or telecommunications provider.

We use the following service providers in accordance with our instructions:

- Amazon Web Services EMEA SARL, Address, 38, Avenue John F. Kennedy LU-1855 Luxembourg
- Uploadcare Inc., Burrard St, Vancouver, BC V7X 1M8, Canada

The provider Uploadcare Inc. resides in a Canada, a so-called third country outside the European Union. Canada has an adequate level of data protection recognized as recognized by the European Commission. Amazon Web Services EMEA SARL may use sub processors that reside in third countries SFDC Ireland Ltd. has therefore implemented appropriate safeguards such as standard contractual clauses and binding corporate rules. You can obtain a copy under [https://d1.awsstatic.com/Processor_to_Processor_SCCs.pdf](https://d1.awsstatic.com/Processor_to_Processor_SCCs.pdf). Furthermore, a transfer is also permitted under Art. 49 par. 1 lit. b) GDPR.

## IV. Rights of the data subject

If the respective requirements are met, the GDPR grants you certain rights as a data subject.

**Art. 15 GDPR – Right of access:** You shall have the right to obtain from us confirmation as to whether or not personal data concerning you are being processed, and, where that is the case, access to the personal data and certain information.

**Art. 16 GDPR – Right to rectification:** You shall have the right to obtain from us without undue delay the rectification of inaccurate personal data concerning you. Taking into account the purposes of the processing, you shall have the right to have incomplete personal data completed, including by means of providing a supplementary statement.

**Art. 17 GDPR – Right to erasure:** You shall have the right to obtain from us the erasure of personal data concerning you without undue delay.

**Art. 18 GDPR – Right to restriction of processing:** You shall have the right to obtain from us the restriction of processing.

**Art. 20 GDPR – Right to data portability:** You shall have the right to receive the personal data concerning you, which you have provided to us, in a structured, commonly used and machine-readable format and you shall have the right to transmit those data to another controller without hindrance from us. You shall also have the right to have the personal data transmitted directly from us to another controller, where technically feasible.

**Art. 77 GDPR – Right to lodge a complaint with a supervisory authority:** Without prejudice to any other administrative or judicial remedy, you shall have the right to lodge a complaint with a supervisory authority, in particular in the Member State of your habitual residence, place of work or place of the alleged infringement if you consider that the processing of personal data relating to you infringes the GDPR.

## V. Especially right to object and withdrawal of consent

**Art. 21 GDPR – Right to Object:** You shall have the right to object, on grounds relating to your particular situation, at any time to processing of personal data concerning you, which is based on legitimate interests or for the performance of a task carried out in the public interest or in the exercise of official authority vested in the controller

In such case, we shall no longer process the personal data unless we demonstrate compelling legitimate grounds for the processing, which override your interests, rights and freedoms or where the processing is necessary for the establishment, exercise or defence of legal claims.

Where personal data are processed for direct marketing purposes, you shall have the right to object at any time for such marketing, which includes profiling to the extent that it is related to such direct marketing.

If you wish to object to any processing of data, you may send us an email to one of our aforementioned email addresses.

**Art. 7 par. 3 GDPR – Withdrawal of Consent:** If you have given us your consent, you have the right to withdraw your consent at any time. In case of withdrawal, all data processing based on your consent before your withdrawal will remain lawful.

## VI. Obligation to provide us with personal data

You have no statutory or contractual obligation to provide us with any personal data. However, we may not be able to provide you with our services if you decide not to do so.

## VII. Existence of automated individual decision-making, including profiling

We do not use automated individual decision-making, including profiling pursuant to Art. 22 GDPR, which produces legal effects concerning you or similarly significantly affects you.

## VIII. Internet specific processing or use of personal data

### 1. General Storage of or Access to Information on your End Device

For providing you the services of our Site, we store or access information on your end device mainly by using cookies or similar technologies. Cookies are small text files, which are transferred from the Site or third parties and stored on your device. Cookies cannot execute programs or infect your device with computer viruses. Some cookies are stored only for your current browser session and will be deleted once you close your browser. Other cookies may be stored on your device for a certain period. You can obtain more information on how long specific cookies are stored within your end device's or browser software's settings.

We use cookies for different purposes, but only if they are strictly necessary to provide our services to you according to Sec. 25 par. 2 Nr. 2 TTDSG. If at some point this should not be the case, we will ask for your informed consent. We use the following essential cookies by default to provide you with the website functionality:

- Anonymous session token (for account access)
- Anti-Cross Site Request Forgery (for security purposes)
- Public data token (to provide easy access to public account data)

Typically, these cookies do not contain personal data. However, if that may be the case in certain situations, the processing of such data is based on Art. 6 par. 1 lit. f) GDPR and the aforementioned purposes constitute the legitimate interests we pursue with them.

### 2. Splitbee

We use the service Splitbee provided by Tobias Lins e.U. Alserbachstraße 10 1090 Vienna. Splitbee helps us to analyze your use of our Site. It collects certain information such as a unique ID, your country, page views, the referrer, the user agent and usage duration. Splitbee does not store an IP Address or any information that would make it possible to identify you as a natural person. Our use of Splitbee also does not store any cookies or other information on your end device. Any processing of personal data for these purposes is based on Art. 6 par. 1 lit. f) GDPR whereas our legitimate interest is to get insights how our Site is used.

You can opt-out by enabling the Do Not Track functionality in your browser.

### 3. Crisp

We use the service Crisp provided by Crisp IM SARL 2 Boulevard de Launay, 44100 Nantes, France. Crisp helps us provide chat support and live assistance in your use of our Site. It collects certain information such as messages exchanged, activity status and datetime, IP address, device type (operating system and browser), geolocation (as based on IP), timezone, preferred language, page activity, professional life data (position, employer, business address), and guesses data from public information on Google (Avatar, Twitter/Facebook handle). Additional consent can be actively provided to process email and phone number. Any processing of personal data for these purposes is based on Art. 6 par. 1 lit. f) GDPR whereas our legitimate interest is to provide actionable assistance in the use of our Site.
`

const md = new Markdown()

const PrivacyPage: BlitzPage = () => {
  return (
    <>
      <Navbar />
      <main className="bg-white dark:bg-gray-900 lg:relative">
        <div className="mx-4 my-8 max-w-3xl text-black dark:text-white lg:mx-auto">
          <div
            className="coc "
            dangerouslySetInnerHTML={{ __html: md.render(privacyMarkdown) }}
          ></div>
        </div>
      </main>
    </>
  )
}

PrivacyPage.suppressFirstRenderFlicker = true
PrivacyPage.getLayout = (page) => (
  <Layout title="R= Privacy policy">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default PrivacyPage
