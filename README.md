# ![Logo](https://raw.githubusercontent.com/sopra-fs22-group-16/sopra-fs22-group-16-client/master/public/favicon.ico) SoPra FS22 - Hannibal Client

<p style="text-align: justify;">
Hannibal is a turn-based strategy game in which players can play against each other over the web. Users can create 1vs1 public or private games without registration. However, it is possible to register to keep records of the games played and compete with other users to be at the top of the leaderboard.
</p>

## Table of content

- [Technologies](#technologies)
- [Getting started](#getting-started)
    - [Prerequisites and Installation](#prerequisites-and-installation)
	- [Build](#build)
	- [Testing](#testing)
	- [Deployment](#deployment)
- [Illustrations](#illustrations)
- [Roadmap](#roadmap)
- [Authors](#authors)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Links](#links)

## Technologies

React, GitHub, Heroku, Mui, JavaScript, Rest, Figma, QR-Code component, socket component

## Getting started
<p style="text-align: justify;">
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.
</p>

### Prerequisites and Installation
Get the [Hannibal server](https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-server) and [Hannibal client](https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client) repository from GitHub and follow the installation guide in each repository.

For your local development environment, you will need [Node.js](https://nodejs.org). All other dependencies, including React, get installed with:

```bash
npm install
```

Run this command before you start your application for the first time. Next, you can start the app with:

```bash
npm run dev
```

Now you can open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build
This command builds the app for production to the `build` folder.
```bash
npm run build
```
It correctly bundles React in production mode and optimizes the build for the best performance: the build is minified, and the filenames include hashes.<br>

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Testing
There are currently no tests on the client version of Hannibal.

Tests can be run with the command:  
```bash
npm run test
```

This launches the test runner in an interactive watch mode. 
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.


### Deployment
After each commit to the master branch, automatic Github Actions get executed which deploy our application to [Heroku](https://www.heroku.com/).

## Illustrations

## Roadmap

## Authors

* **Luis Torrejón Machado** - *???* - [luis-tm](https://github.com/luis-tm)
* **Paul Luley** - *???* - [paolovic](https://github.com/paolovic)
* **Maria Korobeynikova** - *???* - [mkorob](https://github.com/mkorob)
* **Hilal Çomak** - *???* - [hilalcomak](https://github.com/hilalcomak)
* **Alessio Brazerol** - *???* - [apple00juice](https://github.com/apple00juice)

## License
This project is licensed under [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html), which guarantees end users the freedoms to run, study, share and modify the software.

## Acknowledgments
* TODO: SOPRA TEMPLATE CLIENT
* TODO: SOPRA TEMPLATE SERVER
* Thanks to Lucas Pelloni and Kyrill Hux for working on the template.
* Thanks to Melih Catal who supported us as a Tutor and Scrum Master during this project.

## Links
* [Hannibal Client Website](https://sopra-fs22-group-16-client.herokuapp.com/)
* [Hannibal Server Website](https://sopra-fs22-group-16-server.herokuapp.com/)
* [SonarCloud](https://sonarcloud.io/organizations/sopra-fs22-group-16/projects)
* [Issue tracker](https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/issues)
