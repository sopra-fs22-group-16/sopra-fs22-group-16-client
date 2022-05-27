import React from 'react';
import { useHistory } from 'react-router-dom';

import BaseContainer from "components/ui/BaseContainer";
import { Button } from 'components/ui/Button';

import map_example from 'styles/images/info/map_example.png'
import move_example from 'styles/images/info/move_example.png'
import attack_example_1 from 'styles/images/info/attack_example_1.png'
import attack_example_2 from 'styles/images/info/attack_example_2.png'
import attack_example_3 from 'styles/images/info/attack_example_3.png'
import end_example from 'styles/images/info/end_example.png'
import surrender_example from 'styles/images/info/surrender_example.png'

import 'styles/views/InfoPage.scss';

const InfoPage = () => {
    const history = useHistory();

    const returnHome = () => {
        history.push('/home');
    }

    return (
        <BaseContainer>
            <div className="infopage buttons">
                <Button className="return" onClick={() => returnHome()}>RETURN HOME</Button>
            </div>
            <div className="infopage text">Hannibal is a turn-based strategy game in which players can play against each
                other over the web. Users can create 1vs1 public or private games without registration. However, it is
                possible to register to keep records of the games played and compete with other users to be at the top of the
                leaderboard.
            </div>
            <div className="infopage text">Players start with different units placed on a map with the goal of eliminating
                all enemy's units. Each turn, each player must perform one action on each of his units: attack or move.
                Units are limited to one action per turn. Units that have not yet performed an action are marked with an icon
                above them.
            </div>
            <img src={map_example} className={"infopage image"} alt={""} />
            <div className="infopage text">By selecting each of the units still available, it is possible to display the
                movement range (filled squares) and attack range (empty squares). By clicking on one of the tiles within the
                movement range, a pop-up window will appear, allowing the player to move the unit to the chosen location.
            </div>
            <img src={move_example} className={"infopage image"} alt={""} />
            <div className="infopage text">If an enemy is in range when selecting a unit, the tiles where
                the enemies are standing will be highlighted in red. There are two ways of attacking an enemy: first, we
                can click directly on the tile where the enemy is and choose the option attack.
            </div>
            <img src={attack_example_1} className={"infopage image"} alt={""} />
            <div className="infopage text">In order to aid player strategy, prior to attacking a unit we can see the
                percentage of life lost by the enemy and by the player's own unit, due to enemy counter-attack.
            </div>
            <div className="infopage text">Another option is to select a tile from which the enemy is still within attack
                range, and attack from there.
            </div>
            <img src={attack_example_2} className={"infopage image"} alt={""} />
            <div className="infopage text">After selecting attack, only the attack range will be displayed and the player can
                attack to the units in that range.
            </div>
            <img src={attack_example_3} className={"infopage image"} alt={""} />
            <div className="infopage text">A pop-up will be shown to the players after the end of each player's turn, indicating
                who is playing next. The game ends when a player eliminates all enemy units. A window will appear showing the
                result of the game of each player. From this window it is possible to see statistics of the game, to play again,
                or go back to the home page.
            </div>
            <img src={end_example} className={"infopage image"} alt={""} />
            <div className="infopage text">If a player wants to leave a game at any time, they can click on the surrender flag
                in the lower left corner of the map.
            </div>
            <img src={surrender_example} className={"infopage image"} alt={""} />
            <div className="infopage buttons">
                <Button className="return" onClick={() => returnHome()}>RETURN HOME</Button>
            </div>
        </BaseContainer>
    );
};

export default InfoPage;
