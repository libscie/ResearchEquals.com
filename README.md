# ResearchEquals.com <img src="https://ucarecdn.com/6b429a46-7b66-4f4a-9f8c-13338fb438c2/RBadgegh.png" align="right" height="64" />

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-34-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![Discord online](https://img.shields.io/discord/933331539276759070?label=discord&style=flat-square)](https://discord.gg/SefsGJWWSw)

[ResearchEquals.com](https://researchequals.com) is a research module server, where researchers can publish building blocks of research and link them together in chronological order.

ResearchEquals is deployed on a continuous basis using [Flightcontrol](https://flightcontrol.dev/) and translated on a continuous basis using [Weblate](https://github.com/libscie/ResearchEquals.com/wiki/Localization).

## Code of Conduct

You're welcome to our house in good faith – read our [code of conduct](https://www.notion.so/libscie/Code-of-Conduct-580ab64832a2478fad7d9dfad9d3da15) for the house rules applicable to all contributions. Good intent does not excuse behavior in violation of these house rules ([read more about why here](https://thebias.com/2017/09/26/how-good-intent-undermines-diversity-and-inclusion/)).

Our house may be different from yours, and if you find any of this unagreeable, that's perfectly okay, and we ask you respectfully to not contribute.

## Development

Development for this project uses `node` version 16. Please make sure you are using this version.

Please clone the repository and make sure you have [BlitzJS](https://www.blitzjs.com/) installed:

```
## Install BlitzJS if you don't have it
npm install -g blitz --legacy-peer-deps

## Clone repository
git clone https://github.com/libscie/researchequals.com
cd researchequals.com

## Install dependencies
npm install
```

Before you can run a local development version, please ensure you have a Postgres server you can create databases on. Add your preferred route to `.env.local` as such:

```
DATABASE_URL=postgres://myuser:mypassword@localhost:5432/researchequals-dev
```

If you don't have postgres running, you can use the `docker-compose` file which will set one up:

```
docker-compose up
```

To get a fully functional development environment you need to add the environment variables as listed in `.env.example`. For developing locally, you need to add these variables to two .env files: (1) `.env.local` and (2) `.env.test.local`. Please note most of these services are freemium and you can sign up for a free account.

You can migrate and seed your database with

```
npx prisma migrate dev

blitz db seed
```

You can start your development environment with

```
npm run dev
```

which defaults to `localhost:3000`.

Submitted pull requests are automatically deployed using Heroku (self-destroyed after 24 hours).

### Testing Stripe

If you want to develop the Stripe payment pipeline, you can activate using the following command (after installing the [`stripe-cli`](https://github.com/stripe/stripe-cli)):

```
stripe listen --forward-to localhost:3000/api/stripe_webhook
```

### Project Structure

All website pages are in `/pages`, database schemas, migrations, and seeds in `/db`, translations in `/langs`, mailer functions in `/mailers`, public files and images in `/public`, and tests in `/test`.

## Maintainers :building_construction:

These people spend their time making sure the platform is operational and improves over time. They're always available for messages of appreciation :purple_heart:

<table>
  <tr>
    <td align="center"><a href="http://naoyukisunami.com"><img src="https://avatars.githubusercontent.com/u/17035406?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nami Sunami</b></sub></a><br /></td>
    <td align="center"><a href="https://chjh.nl"><img src="https://avatars.githubusercontent.com/u/2946344?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Chris Hartgerink</b></sub></a><br /></td>
  </tr>

</table>

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/AerynThrace"><img src="https://avatars.githubusercontent.com/u/51057483?v=4?s=100" width="100px;" alt="AerynThrace"/><br /><sub><b>AerynThrace</b></sub></a><br /><a href="#userTesting-AerynThrace" title="User Testing">📓</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/AnnaVantVeer"><img src="https://avatars.githubusercontent.com/u/18264896?v=4?s=100" width="100px;" alt="AnnaVantVeer"/><br /><sub><b>AnnaVantVeer</b></sub></a><br /><a href="#ideas-AnnaVantVeer" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Bubblbu"><img src="https://avatars.githubusercontent.com/u/6946077?v=4?s=100" width="100px;" alt="Asura Enkhbayar"/><br /><sub><b>Asura Enkhbayar</b></sub></a><br /><a href="#userTesting-Bubblbu" title="User Testing">📓</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.win.ox.ac.uk/people/cassandra-gould-van-praag"><img src="https://avatars.githubusercontent.com/u/43407869?v=4?s=100" width="100px;" alt="Cassandra Gould van Praag"/><br /><sub><b>Cassandra Gould van Praag</b></sub></a><br /><a href="https://github.com/libscie/ResearchEquals.com/issues?q=author%3Acassgvp" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Dan-Rudmann"><img src="https://avatars.githubusercontent.com/u/52978069?v=4?s=100" width="100px;" alt="Dan Rudmann"/><br /><sub><b>Dan Rudmann</b></sub></a><br /><a href="#content-Dan-Rudmann" title="Content">🖋</a> <a href="#mentoring-Dan-Rudmann" title="Mentoring">🧑‍🏫</a> <a href="https://github.com/libscie/ResearchEquals.com/pulls?q=is%3Apr+reviewed-by%3ADan-Rudmann" title="Reviewed Pull Requests">👀</a> <a href="#ideas-Dan-Rudmann" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://daniellombrana.es"><img src="https://avatars.githubusercontent.com/u/131838?v=4?s=100" width="100px;" alt="Daniel Lombraña González"/><br /><sub><b>Daniel Lombraña González</b></sub></a><br /><a href="#userTesting-teleyinex" title="User Testing">📓</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://nordholmen.net"><img src="https://avatars.githubusercontent.com/u/1325054?v=4?s=100" width="100px;" alt="Daniel Nüst"/><br /><sub><b>Daniel Nüst</b></sub></a><br /><a href="#ideas-nuest" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/features/security"><img src="https://avatars.githubusercontent.com/u/27347476?v=4?s=100" width="100px;" alt="Dependabot"/><br /><sub><b>Dependabot</b></sub></a><br /><a href="#maintenance-dependabot" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://chem-bla-ics.blogspot.com/"><img src="https://avatars.githubusercontent.com/u/26721?v=4?s=100" width="100px;" alt="Egon Willighagen"/><br /><sub><b>Egon Willighagen</b></sub></a><br /><a href="#userTesting-egonw" title="User Testing">📓</a> <a href="#example-egonw" title="Examples">💡</a> <a href="#ideas-egonw" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/libscie/ResearchEquals.com/commits?author=egonw" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/EstherPlomp"><img src="https://avatars.githubusercontent.com/u/46314469?v=4?s=100" width="100px;" alt="Esther Plomp"/><br /><sub><b>Esther Plomp</b></sub></a><br /><a href="#userTesting-EstherPlomp" title="User Testing">📓</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://gianluca.dellavedova.org"><img src="https://avatars.githubusercontent.com/u/147768?v=4?s=100" width="100px;" alt="Gianluca Della Vedova"/><br /><sub><b>Gianluca Della Vedova</b></sub></a><br /><a href="#ideas-gdv" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://hanneoberman.github.io"><img src="https://avatars.githubusercontent.com/u/38891540?v=4?s=100" width="100px;" alt="Hanne Oberman"/><br /><sub><b>Hanne Oberman</b></sub></a><br /><a href="#ideas-hanneoberman" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://jeffspies.com"><img src="https://avatars.githubusercontent.com/u/512000?v=4?s=100" width="100px;" alt="Jeffrey Spies"/><br /><sub><b>Jeffrey Spies</b></sub></a><br /><a href="https://github.com/libscie/ResearchEquals.com/issues?q=author%3AJeffSpies" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://orcid.org/0000-0002-3464-0247"><img src="https://avatars.githubusercontent.com/u/12043988?v=4?s=100" width="100px;" alt="Jessie L Oliver"/><br /><sub><b>Jessie L Oliver</b></sub></a><br /><a href="#a11y-JessieLOliver" title="Accessibility">️️️️♿️</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/kaodro"><img src="https://avatars.githubusercontent.com/u/22129061?v=4?s=100" width="100px;" alt="Kasia"/><br /><sub><b>Kasia</b></sub></a><br /><a href="#translation-kaodro" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://htp://www.rivervalleytechnologies.com"><img src="https://avatars.githubusercontent.com/u/4387243?v=4?s=100" width="100px;" alt="Kaveh Bazargan"/><br /><sub><b>Kaveh Bazargan</b></sub></a><br /><a href="https://github.com/libscie/ResearchEquals.com/issues?q=author%3Akaveh1000" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://marioangst.com"><img src="https://avatars.githubusercontent.com/u/19803038?v=4?s=100" width="100px;" alt="Mario Angst"/><br /><sub><b>Mario Angst</b></sub></a><br /><a href="#ideas-marioangst" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://metasciencelab.elte.hu/index.php/members/marton-kovacs/"><img src="https://avatars.githubusercontent.com/u/43272864?v=4?s=100" width="100px;" alt="Marton Kovacs"/><br /><sub><b>Marton Kovacs</b></sub></a><br /><a href="#userTesting-marton-balazs-kovacs" title="User Testing">📓</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://minaabadir.ca"><img src="https://avatars.githubusercontent.com/u/3389914?v=4?s=100" width="100px;" alt="Mina Abadir"/><br /><sub><b>Mina Abadir</b></sub></a><br /><a href="#infra-mabadir" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://naoyukisunami.com"><img src="https://avatars.githubusercontent.com/u/17035406?v=4?s=100" width="100px;" alt="Nami Sunami"/><br /><sub><b>Nami Sunami</b></sub></a><br /><a href="#translation-nsunami" title="Translation">🌍</a> <a href="#design-nsunami" title="Design">🎨</a> <a href="#ideas-nsunami" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/libscie/ResearchEquals.com/issues?q=author%3Ansunami" title="Bug reports">🐛</a> <a href="https://github.com/libscie/ResearchEquals.com/commits?author=nsunami" title="Code">💻</a> <a href="https://github.com/libscie/ResearchEquals.com/commits?author=nsunami" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/nathan-at-jisc"><img src="https://avatars.githubusercontent.com/u/58425475?v=4?s=100" width="100px;" alt="Nathan Sainsbury"/><br /><sub><b>Nathan Sainsbury</b></sub></a><br /><a href="https://github.com/libscie/ResearchEquals.com/issues?q=author%3Anathan-at-jisc" title="Bug reports">🐛</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/nasainsbury"><img src="https://avatars.githubusercontent.com/u/58425475?v=4?s=100" width="100px;" alt="Nathan Sainsbury"/><br /><sub><b>Nathan Sainsbury</b></sub></a><br /><a href="https://github.com/libscie/ResearchEquals.com/commits?author=nasainsbury" title="Code">💻</a> <a href="#design-nasainsbury" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://sobrakseaton.com"><img src="https://avatars.githubusercontent.com/u/28573875?v=4?s=100" width="100px;" alt="Patrick Sobrak-Seaton"/><br /><sub><b>Patrick Sobrak-Seaton</b></sub></a><br /><a href="#design-psobrakseaton" title="Design">🎨</a> <a href="https://github.com/libscie/ResearchEquals.com/commits?author=psobrakseaton" title="Tests">⚠️</a> <a href="#userTesting-psobrakseaton" title="User Testing">📓</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/RobbievanAert"><img src="https://avatars.githubusercontent.com/u/11198300?v=4?s=100" width="100px;" alt="Robbie van Aert"/><br /><sub><b>Robbie van Aert</b></sub></a><br /><a href="https://github.com/libscie/ResearchEquals.com/issues?q=author%3ARobbievanAert" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/samteplitzky"><img src="https://avatars.githubusercontent.com/u/13663076?v=4?s=100" width="100px;" alt="Sam Teplitzky"/><br /><sub><b>Sam Teplitzky</b></sub></a><br /><a href="#userTesting-samteplitzky" title="User Testing">📓</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/SarahanneMField"><img src="https://avatars.githubusercontent.com/u/99656061?v=4?s=100" width="100px;" alt="SarahanneMField"/><br /><sub><b>SarahanneMField</b></sub></a><br /><a href="#userTesting-SarahanneMField" title="User Testing">📓</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://simon.events"><img src="https://avatars.githubusercontent.com/u/770632?v=4?s=100" width="100px;" alt="Simon"/><br /><sub><b>Simon</b></sub></a><br /><a href="https://github.com/libscie/ResearchEquals.com/issues?q=author%3APonjimon" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://internethealthreport.org"><img src="https://avatars.githubusercontent.com/u/22150791?v=4?s=100" width="100px;" alt="Solana"/><br /><sub><b>Solana</b></sub></a><br /><a href="#translation-Solanasaurus" title="Translation">🌍</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://tefkah.com"><img src="https://avatars.githubusercontent.com/u/21983833?v=4?s=100" width="100px;" alt="Thomas F. K. Jorna"/><br /><sub><b>Thomas F. K. Jorna</b></sub></a><br /><a href="https://github.com/libscie/ResearchEquals.com/issues?q=author%3AThomasFKJorna" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/InquisitiveVi"><img src="https://avatars.githubusercontent.com/u/23527107?v=4?s=100" width="100px;" alt="Vinodh Ilangovan"/><br /><sub><b>Vinodh Ilangovan</b></sub></a><br /><a href="#a11y-InquisitiveVi" title="Accessibility">️️️️♿️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://weblate.org/hosting/"><img src="https://avatars.githubusercontent.com/u/1607653?v=4?s=100" width="100px;" alt="Weblate (bot)"/><br /><sub><b>Weblate (bot)</b></sub></a><br /><a href="#translation-weblate" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ab-ioi"><img src="https://avatars.githubusercontent.com/u/98346737?v=4?s=100" width="100px;" alt="ab-ioi"/><br /><sub><b>ab-ioi</b></sub></a><br /><a href="#userTesting-ab-ioi" title="User Testing">📓</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/coglebed"><img src="https://avatars.githubusercontent.com/u/73071333?v=4?s=100" width="100px;" alt="coglebed"/><br /><sub><b>coglebed</b></sub></a><br /><a href="#translation-coglebed" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Senficon"><img src="https://avatars.githubusercontent.com/u/762381?v=4?s=100" width="100px;" alt="senficon"/><br /><sub><b>senficon</b></sub></a><br /><a href="#ideas-senficon" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
