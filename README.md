# ![Logo](https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/logo/war_elephant_purple.png) SoPra FS22 - Hannibal Client ![Logo](https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/logo/war_elephant_purple_left.png)

Hannibal is a turn-based strategy game in which players can play against each other over the web. Users can create 1vs1 public or private games without registration. However, it is possible to register to keep records of the games played and compete with other users to be at the top of the leaderboard.

### Motivation
The motivation of the game was to create something which is fun to play without learning too many rules, and something we envisioned people enjoying playing even outside the SoPra requirements. 


## Table of content

- [Technologies](#technologies)
- [High-level components](#high-level-components)
- [External Dependencies](#external-dependencies)
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

<img src="https://github.com/get-icon/geticon/blob/master/icons/npm.svg" width="16" height="16" />   [**npm**](https://www.npmjs.com) 	

<img src="https://upload.wikimedia.org/wikipedia/commons/4/47/React.svg" width="16" height="16" />   [**React**](https://reactjs.org/) 	

<img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg" width="16" height="16" /> [**JavaScript**](https://www.javascript.com/)	

<img src="https://user-images.githubusercontent.com/91155454/170842503-3a531289-1afc-4b9c-87c1-cc120d9229ce.svg" style='visibility:hidden;' width="16" height="16" /> [**REST**](https://en.wikipedia.org/wiki/Representational_state_transfer) 

<img src="https://user-images.githubusercontent.com/91155454/170843632-39007803-3026-4e48-bb78-93836a3ea771.png" style='visibility:hidden;' width="16" height="16" /> [**WebSocket**](https://en.wikipedia.org/wiki/WebSocket)

<img src="https://github.com/get-icon/geticon/blob/master/icons/heroku-icon.svg" width="16" height="16" /> [**Heroku**](https://www.heroku.com/)		

<img src="https://github.com/get-icon/geticon/blob/master/icons/github-icon.svg" width="16" height="16" /> [**GitHub**](https://github.com/)	

## High-level components

TODO:

## External Dependencies

<img src="https://github.com/get-icon/geticon/blob/master/icons/material-ui.svg" width="16" height="16" /> [**Mui**](https://mui.com/)		

<img src="https://user-images.githubusercontent.com/91155454/170842620-fd6f8352-6f42-41c2-b35a-6c7157cc2727.svg" width="16" height="16" /> [**react-qr-scanner**](https://www.npmjs.com/package/react-qr-scanner)

<img src="https://user-images.githubusercontent.com/91155454/170842854-9efaadbf-2d09-49c7-a738-d19fe8f9a257.png" width="16" height="16" /> [**sockjs-client**](https://www.npmjs.com/package/sockjs-client)	

## Getting started
<p>
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

<br clear="both"/>

<p>

<img align="left" width="25%" src="https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/Illustrations/Homepage.png">
	
<img align="right"  width="25%" src="https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/Illustrations/empty.png">
	
### Homepage

On the homepage of Hannibal, the user gets a general overview of the features. In the top right corner are multiple icon buttons. Pressing the Information icon redirects the user to a different page, where the user can get additional information about the flow of the game. The GitHub button leads the user to the GitHub project of Hannibal. The user has the possibility of joining existing lobbies by pressing <code>JOIN LOBBY</code>. The user can create new lobbies when pressing on the <code>CREATE LOBBY</code> button.

To keep records of the games played and compete with other users with their ranked score, the user can register an account by pressing <code>SIGN IN/CREATE USER</code>. To view the score of the best users in all of Hannibal, the user can press the <code>LEADERBOARD</code> button to get to a leaderboard which the user can sort by wins, losses or ranked score.

</p>	
	
<br clear="both"/>

<br>

<br>

<p>

<img align="left" width="25%" src="https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/Illustrations/CreateLobby.png">

<img align="right" width="25%" src="https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/Illustrations/PublicLobbies.png">

### Creating and joining a lobby

After pressing <code>CREATE LOBBY</code> the user is presented with a form where he can specify the name, the type and the visibility of the lobby. In game of type Ranked, the registered users compete against each other and in the end the wins, losses and ranked score get updated. With the option visibility, the user can decide if the lobby gets added to the list of public lobbies. 


After pressing <code>JOIN LOBBY</code> the user is presented with a list of public lobbies. The name, type, number of players and type of the lobby is indicated. The user can join the lobby if the user is eligible for the lobby by pressing on it.
	
If the user wants to join a specifig lobby, they can press <code>JOIN A LOBBY BY CODE</code>.
	
Additionally, the user can return to the home screen by pressing <code>RETURN HOME</code>.
	
</p>
	
<br clear="right"/>

<br>

<p>

<img align="left" width="25%" src="https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/Illustrations/JoinLobbyByCode.png">

<img align="right" width="25%" src="https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/Illustrations/JoinLobbyByQRCode.png">

### Joining a lobby by code
	
After pressing <code>JOIN A LOBBY BY CODE</code> the user gets presented with an inputfield where, the user can input a lobbycode. The user can validate the code by pressing <code>VALIDATE CODE</code>. 

Additianally, the user can press <code>Join using a QR code instead</code> to get the possibility to join a lobby by scanning a QR code.

The user can return to the list of public lobbies or the homepage by using the two buttons below.
	
</p>
	
<br clear="right"/>

<br>

<p>

<img align="left"  width="25%" src="https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/Illustrations/Lobby.png">

<img align="right"  width="25%" src="https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/Illustrations/empty.png">

### Lobby
	
In the lobby, the user can see the current settings of the lobby. This includes the name (NAME), the visibility (ACCESS), the type (TYPE), the number of players and respectively the maximal number of players (PLAYERS) and the number of ready players (READY). Below the lobby information is a table with the players currently in the lobby. The name of the play, the team and ready status is stated in each table row. The user can change his name by selecting the input field and then pressing the yellow button on the left of it. The user can change his ready status by clicking on the checkbox in the user's row.

The host of the lobby has access to three additional views. He can access them via the blue links above the lobby information and below the player table. With the above link, he has the possibility of changing the lobby settings. The link below the player's table allows the host to see the invitation code or the QR code.
	
</p>
	
<br clear="both"/>
<br>

<p>

<img align="left"  width="25%" src="https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/Illustrations/StartOfGame.png">

<img align="right"  width="25%" src="https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/Illustrations/game.png">

</p>
	
<br clear="both"/>

<p>

<img align="left"  width="25%" src="https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/Illustrations/MovementAndAttackRange.png">

<img align="right"  width="25%" src="https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/Illustrations/empty.png">

</p>
	
<br clear="both"/>
<br>

<p>

<img align="left"  width="25%" src="https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/Illustrations/Victory.png">

<img align="right"  width="25%" src="https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/Illustrations/Defeat.png">

</p>
	
<br clear="both"/>
<br>

<img align="left"  width="25%" src="https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/Illustrations/statisticsKPT.png">

<img align="right"  width="25%" src="https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/Illustrations/statisticsUPT.png">

</p>
	
<br clear="both"/>
<br>

## Roadmap

<p align="center">
<img align="center" src="https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/blob/ReadMe-media/images/Illustrations/Hannibalroadmap.png" width="50%"/>
</p>

## Authors

* **Luis Torrejón Machado**  - [luis-tm](https://github.com/luis-tm)
* **Paul Luley**  - [paolovic](https://github.com/paolovic)
* **Maria Korobeynikova** - [mkorob](https://github.com/mkorob)
* **Hilal Çomak** - [hilalcomak](https://github.com/hilalcomak)
* **Alessio Brazerol** - [apple00juice](https://github.com/apple00juice)

## License
This project is licensed under [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html), which guarantees end users the freedoms to run, study, share and modify the software.

## Acknowledgments
* This project is based on the [SoPra FS22 - Client Template](https://github.com/HASEL-UZH/sopra-fs22-template-client)
* Thanks to **Melih Catal** - [melihcatal](https://github.com/melihcatal) who supported us as a Tutor and Scrum Master during this project.

## Links
* [Hannibal Client Website](https://sopra-fs22-group-16-client.herokuapp.com/)
* [Hannibal Server Website](https://sopra-fs22-group-16-server.herokuapp.com/)
* [SonarCloud](https://sonarcloud.io/organizations/sopra-fs22-group-16/projects)
* [Issue tracker](https://github.com/sopra-fs22-group-16/sopra-fs22-group-16-client/issues)
