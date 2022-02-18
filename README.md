# ResearchEquals.com <img src="https://pbs.twimg.com/profile_images/1457432990661890059/OXxEMPhf_400x400.jpg" align="right" height="64" />

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-22-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![Discord online](https://img.shields.io/discord/933331539276759070?label=discord&style=flat-square)](https://discord.gg/SefsGJWWSw)

[ResearchEquals.com](https://researchequals.com) is a research module server, where researchers can publish building blocks of research and link them together in chronological order.

ResearchEquals is deployed on a continuous basis using [Flightcontrol](https://flightcontrol.dev/).

## Code of Conduct

You're welcome to our house in good faith – read our [code of conduct](https://www.notion.so/libscie/Code-of-Conduct-580ab64832a2478fad7d9dfad9d3da15) for the house rules applicable to all contributions. Good intent does not excuse behavior in violation of these house rules ([read more about why here](https://thebias.com/2017/09/26/how-good-intent-undermines-diversity-and-inclusion/)).

Our house may be different from yours, and if you find any of this unagreeable, that's perfectly okay, and we ask you respectfully to not contribute.

## Development

Please clone the repository and make sure you have [BlitzJS](blitzjs.com/) installed:

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
DATABASE_URL=postgres://<username>:<password>@localhost:5432/researchequals-dev
```

To get a fully functional development environment you need to add the environment variables as listed in `.env.example`. Please note most of these services are freemium and you can sign up for a free account.

Submitted pull requests are automatically deployed using Heroku (self-destroyed after 24 hours).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/AerynThrace"><img src="https://avatars.githubusercontent.com/u/51057483?v=4?s=100" width="100px;" alt=""/><br /><sub><b>AerynThrace</b></sub></a><br /><a href="#userTesting-AerynThrace" title="User Testing">📓</a></td>
    <td align="center"><a href="https://github.com/Bubblbu"><img src="https://avatars.githubusercontent.com/u/6946077?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Asura Enkhbayar</b></sub></a><br /><a href="#userTesting-Bubblbu" title="User Testing">📓</a></td>
    <td align="center"><a href="http://daniellombrana.es"><img src="https://avatars.githubusercontent.com/u/131838?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Daniel Lombraña González</b></sub></a><br /><a href="#userTesting-teleyinex" title="User Testing">📓</a></td>
    <td align="center"><a href="https://chem-bla-ics.blogspot.com/"><img src="https://avatars.githubusercontent.com/u/26721?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Egon Willighagen</b></sub></a><br /><a href="#userTesting-egonw" title="User Testing">📓</a> <a href="#example-egonw" title="Examples">💡</a> <a href="#ideas-egonw" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/libscie/ResearchEquals.com/commits?author=egonw" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/EstherPlomp"><img src="https://avatars.githubusercontent.com/u/46314469?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Esther Plomp</b></sub></a><br /><a href="#userTesting-EstherPlomp" title="User Testing">📓</a></td>
    <td align="center"><a href="https://gianluca.dellavedova.org"><img src="https://avatars.githubusercontent.com/u/147768?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Gianluca Della Vedova</b></sub></a><br /><a href="#ideas-gdv" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/kaodro"><img src="https://avatars.githubusercontent.com/u/22129061?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kasia</b></sub></a><br /><a href="#translation-kaodro" title="Translation">🌍</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://htp://www.rivervalleytechnologies.com"><img src="https://avatars.githubusercontent.com/u/4387243?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kaveh Bazargan</b></sub></a><br /><a href="https://github.com/libscie/ResearchEquals.com/issues?q=author%3Akaveh1000" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://metasciencelab.elte.hu/index.php/members/marton-kovacs/"><img src="https://avatars.githubusercontent.com/u/43272864?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Marton Kovacs</b></sub></a><br /><a href="#userTesting-marton-balazs-kovacs" title="User Testing">📓</a></td>
    <td align="center"><a href="http://minaabadir.ca"><img src="https://avatars.githubusercontent.com/u/3389914?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mina Abadir</b></sub></a><br /><a href="#infra-mabadir" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="http://naoyukisunami.com"><img src="https://avatars.githubusercontent.com/u/17035406?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nami Sunami</b></sub></a><br /><a href="#translation-nsunami" title="Translation">🌍</a> <a href="#design-nsunami" title="Design">🎨</a> <a href="#ideas-nsunami" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/libscie/ResearchEquals.com/issues?q=author%3Ansunami" title="Bug reports">🐛</a> <a href="https://github.com/libscie/ResearchEquals.com/commits?author=nsunami" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/nathan-at-jisc"><img src="https://avatars.githubusercontent.com/u/58425475?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nathan Sainsbury</b></sub></a><br /><a href="https://github.com/libscie/ResearchEquals.com/issues?q=author%3Anathan-at-jisc" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://sobrakseaton.com"><img src="https://avatars.githubusercontent.com/u/28573875?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Patrick Sobrak-Seaton</b></sub></a><br /><a href="#design-psobrakseaton" title="Design">🎨</a> <a href="https://github.com/libscie/ResearchEquals.com/commits?author=psobrakseaton" title="Tests">⚠️</a> <a href="#userTesting-psobrakseaton" title="User Testing">📓</a></td>
    <td align="center"><a href="https://github.com/samteplitzky"><img src="https://avatars.githubusercontent.com/u/13663076?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sam Teplitzky</b></sub></a><br /><a href="#userTesting-samteplitzky" title="User Testing">📓</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/SarahanneMField"><img src="https://avatars.githubusercontent.com/u/99656061?v=4?s=100" width="100px;" alt=""/><br /><sub><b>SarahanneMField</b></sub></a><br /><a href="#userTesting-SarahanneMField" title="User Testing">📓</a></td>
    <td align="center"><a href="https://simon.events"><img src="https://avatars.githubusercontent.com/u/770632?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Simon</b></sub></a><br /><a href="https://github.com/libscie/ResearchEquals.com/issues?q=author%3APonjimon" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://internethealthreport.org"><img src="https://avatars.githubusercontent.com/u/22150791?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Solana</b></sub></a><br /><a href="#translation-Solanasaurus" title="Translation">🌍</a></td>
    <td align="center"><a href="http://tefkah.com"><img src="https://avatars.githubusercontent.com/u/21983833?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Thomas F. K. Jorna</b></sub></a><br /><a href="https://github.com/libscie/ResearchEquals.com/issues?q=author%3AThomasFKJorna" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/InquisitiveVi"><img src="https://avatars.githubusercontent.com/u/23527107?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vinodh Ilangovan</b></sub></a><br /><a href="#a11y-InquisitiveVi" title="Accessibility">️️️️♿️</a></td>
    <td align="center"><a href="https://github.com/ab-ioi"><img src="https://avatars.githubusercontent.com/u/98346737?v=4?s=100" width="100px;" alt=""/><br /><sub><b>ab-ioi</b></sub></a><br /><a href="#userTesting-ab-ioi" title="User Testing">📓</a></td>
    <td align="center"><a href="https://github.com/coglebed"><img src="https://avatars.githubusercontent.com/u/73071333?v=4?s=100" width="100px;" alt=""/><br /><sub><b>coglebed</b></sub></a><br /><a href="#translation-coglebed" title="Translation">🌍</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/Senficon"><img src="https://avatars.githubusercontent.com/u/762381?v=4?s=100" width="100px;" alt=""/><br /><sub><b>senficon</b></sub></a><br /><a href="#ideas-senficon" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
