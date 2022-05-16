import React, {useState} from "react";
import {api} from "../../../helpers/api";
import PropTypes from "prop-types";
import Tile from "./tile/Tile";
import PositionData from "models/PositionData";
import HealthData from "models/HealthData";
import Socket from "../../socket/Socket";
import "styles/views/game/Map.scss"
import Unit from "./unit/Unit";
import DropDown from "../../ui/DropDown";
import DamageIndicator from "../../ui/DamageIndicator";
import {UnitTypes} from "./unit/data/UnitTypes";
import {Direction} from "./unit/Direction";
import CustomPopUp from "components/ui/CustomPopUp";
import {Button} from "components/ui/Button";

function timer(ms) {
    return new Promise(res => setTimeout(res, ms));
}

const Map = props => {

    const playerId = parseInt(localStorage.getItem("playerId"));
    const teamId = playerId; // TODO: Get Team Id
    const token = localStorage.getItem("token");

    const [selectedUnit, setSelectedUnit] = useState(null);

    const [lock, setLock] = useState(false);

    const [dropDown, setDropDown] = useState({
        open: false,
        showAttack: false,
        showWait: false,
        y: 0,
        x: 0,
        target: null
    });
    const [damageIndicator, setDamageIndicator] = useState({
        open: false,
        y: 0,
        x: 0,
        leftDamage: 0,
        rightDamage: 0,
        leftRed: true
    });
    const [errorMessage, setErrorMessage] = useState("");

    const onClickUnit = (unit) => {
        if (!lock && unit.moved === false && props.playerIdCurrentTurn === playerId) {
            // If we click on the same unit
            if (selectedUnit === unit) {
                onClickTile(props.mapData[selectedUnit.y][selectedUnit.x]);
            } else if (unit.userId === playerId) {
                if (selectedUnit) {
                    hideUnitIndicators(selectedUnit);
                    hideDropDownsAndPopUps();
                }

                // Set the clicked unit as the selected unit
                setSelectedUnit(unit);
                // Calculate the movement and attack range
                unit.calculateTilesInRange(props.mapData);
                // Show the attack and movement range
                unit.showRangeIndicator(true);

            } else if (selectedUnit && unit.teamId !== teamId) {

                const tile = props.mapData[unit.y][unit.x];

                if (selectedUnit.tilesInAttackRange.includes(tile)) {
                    selectedUnit.showPathIndicator(false)

                    if (selectedUnit.traversableTiles !== null) {
                        selectedUnit.calculatePathToUnit(unit.y, unit.x, props.mapData);
                        selectedUnit.calculateIdleDirection();
                        setDropDown({
                            open: true,
                            showAttack: true,
                            showWait: true,
                            y: tile.y * 48,
                            x: (tile.x + 1) * 48,
                            target: tile
                        })
                    } else {
                        setDropDown({
                            open: true,
                            showAttack: true,
                            showWait: false,
                            y: tile.y * 48,
                            x: (tile.x + 1) * 48,
                            target: tile
                        })
                    }

                    let leftRed = teamId === 0 ? (selectedUnit.x > unit.x) : (selectedUnit.x <= unit.x);

                    let outGoingDamage = selectedUnit.calculateOutgoingAttackDamage(unit, props.mapData);
                    let inGoingDamage = unit.calculateOutgoingAttackDamage(selectedUnit, props.mapData) / 3;

                    let outGoingPercentage = Math.min(100 / unit.health * outGoingDamage, 100);
                    let inGoingPercentage = Math.min(100 / selectedUnit.health * inGoingDamage, 100);

                    let leftPercentage = inGoingPercentage;
                    let rightPercentage = outGoingPercentage;

                    if ((teamId === 0 && leftRed) || (teamId === 1 && !leftRed)) {
                        leftPercentage = outGoingPercentage;
                        rightPercentage = inGoingPercentage;
                    }

                    setDamageIndicator({
                        open: true,
                        y: (tile.y - 2) * 48,
                        x: tile.x * 48,
                        leftDamage: leftPercentage,
                        rightDamage: rightPercentage,
                        leftRed: leftRed
                    })

                    selectedUnit.showPathIndicator(true);
                }
            }
        }

    }


    const onClickTile = (tile) => {
        if (!lock && props.playerIdCurrentTurn === playerId) {
            if (selectedUnit && selectedUnit.traversableTiles?.includes(tile)) {
                // Hide the old path
                selectedUnit.showPathIndicator(false);
                hideDropDownsAndPopUps();

                // Calculate the new path and view direction to the tile
                selectedUnit.calculatePathToTile(tile.y, tile.x, props.mapData);
                selectedUnit.calculateIdleDirection();

                // Show the new path
                selectedUnit.showPathIndicator(true);

                if (selectedUnit.canAttackFromTile(tile)) {
                    // Show large drop down as at least one unit is in range
                    setDropDown({
                        open: true,
                        showAttack: true,
                        showWait: true,
                        y: tile.y * 48,
                        x: (tile.x + 1) * 48,
                        target: tile
                    })
                } else {
                    // Show small drop down as no unit is in range
                    setDropDown({
                        open: true,
                        showAttack: false,
                        showWait: true,
                        y: tile.y * 48,
                        x: (tile.x + 1) * 48,
                        target: tile
                    })
                }

            } else if (selectedUnit && (!tile.traversableTiles?.includes(tile) && !tile.tilesInAttackRange?.includes(tile))) {
                // Deselect unit when clicking outside movement and attack range
                hideUnitIndicators(selectedUnit);
                hideDropDownsAndPopUps();
                setSelectedUnit(null);
            }
        }
    }

    const onClickAttack = async (tile) => {

        // if clicking directly on the unit, move up the path
        if (tile.unit && tile.unit.teamId !== teamId) {

            //lock other actions while attacking
            setLock(true);

            // Set that the unit is selected
            selectedUnit.moved = true;

            props.mapData[selectedUnit.y][selectedUnit.x].unit = null;

            hideUnitIndicators(selectedUnit);
            hideDropDownsAndPopUps();

            try {

                const requestBody = {
                    "attacker": {"x": selectedUnit.x, "y": selectedUnit.y},
                    "defender": {"x": tile.unit.x, "y": tile.unit.y},
                    "attackerDestination": {"x": selectedUnit.pathGoal[1], "y": selectedUnit.pathGoal[0]}
                };

                // attack command specified
                await api.put(`/v1/game/match/${props.id}/command/attack`, JSON.stringify(requestBody), {headers: {'token': token || ''}});

            } catch (error) {
                if (error.response?.status) {
                    if (error.response?.status === 403) {
                        setErrorMessage("Are you sure it's your turn to play?");
                    } else {
                        setErrorMessage("Something went wrong with communicating to server!");
                    }
                } else {
                    console.log(error);
                }
                setLock(false);
            }


        } else {
            selectedUnit.showRangeIndicator(false);
            selectedUnit.traversableTiles = null;
            selectedUnit.tilesInAttackRange = selectedUnit.tilesInAttackRangeSpecificTile[tile.y][tile.x];
            selectedUnit.showRangeIndicator(true);
            hideDropDownsAndPopUps();
        }
    }

    const onClickWait = async (tile) => {
        // pressing wait on the tile with unit is the same as attack
        if (!tile.unit) {

            //lock other actions while moving
            setLock(true);

            // Set that the unit is selected
            selectedUnit.moved = true;

            //delete unit from map array
            props.mapData[selectedUnit.y][selectedUnit.x].unit = null;

            //remove current reachable tiles and arrow path indicator
            hideUnitIndicators(selectedUnit);
            hideDropDownsAndPopUps();

            try {
                const requestBody = {
                    "start": {"x": selectedUnit.x, "y": selectedUnit.y},
                    "destination": {"x": selectedUnit.pathGoal[1], "y": selectedUnit.pathGoal[0]}
                };


                // attack command specified
                await api.put(`/v1/game/match/${props.id}/command/move`, JSON.stringify(requestBody), {headers: {'token': token || ''}});


            } catch (error) {

                if (error.response.status === 403) {
                    setErrorMessage("Are you sure it's your turn to play?");
                } else {
                    setErrorMessage("Something went wrong with communicating to server!")
                    console.log(error);
                }

                setLock(false);
            }

        }
    }


    // refresh view when receiving a message from the socket
    // TODO: resolve 
    const onMessage = async (msg) => {
        console.log(msg);
        setSocketHealth(msg.unitHealths);
        //alert(props.playerIdCurrentTurn !== playerId);

        // only update health if the player is not moving, otherwise in respective move functions
        if (msg.move?.start && msg.move?.destination) {
            let positionStart = new PositionData(msg.move.start);
            let positionEnd = new PositionData(msg.move.destination);
            // change unit to be the Unit from Units
            let unitStart = null;
            props.unitData.forEach((unit) => {
                if (positionStart.x === unit.x && positionStart.y === unit.y) {
                    unitStart = unit;
                }
            })

            unitStart.calculateTilesInRange(props.mapData);
            unitStart.calculatePathToTile(positionEnd.y, positionEnd.x, props.mapData);
            await executePathMovement(unitStart);
            unitStart.moved = true;

            props.mapData[positionStart.y][positionStart.x].unit = null;
            props.mapData[positionEnd.y][positionEnd.x].unit = unitStart;

            cleanUpUnits();

            setSelectedUnit(null);
            //unlock
            setLock(false);
        }

        if (msg.unitHealths) {
            // after it is done, update health
            updateHealth(msg.unitHealths);
        }

        // Force a redraw
        setDropDown({...dropDown, open: false});

        //update turn and reset all performed action
        if (msg.turnInfo) {
            props.onChangeTurn(msg.turnInfo);
            props.unitData.forEach((unit) => {
                unit.moved = false;
            })
        }
    }


    const updateHealth = (healthMessage) => {

        healthMessage.forEach((healthUnit) => {
                let healthDataUnit = new HealthData(healthUnit);
                // change unit to be the Unit from Units
                let unitPosition = null;
                props.unitData.forEach((unit) => {
                    if (healthDataUnit.unitPosition.x === unit.x && healthDataUnit.unitPosition.y === unit.y) {
                        unitPosition = unit;
                    }
                })

                if (unitPosition) {

                    if (healthDataUnit.health <= 0) {
                        props.mapData[healthDataUnit.unitPosition.y][healthDataUnit.unitPosition.x].unit = null;
                        unitPosition.health = 0;
                        // Remove unit from unit array
                        props.unitData.splice(props.unitData.indexOf(unitPosition), 1);
                    } else {

                        unitPosition.health = healthDataUnit.health;
                    }
                } else {
                    console.log("unit not found");
                }

            }
        )
    }


    // refresh view when receiving a message from the socket

    const executePathMovement = async (unitMove) => {
        //set animation
        unitMove.animation = "run";

        //update position
        let startViewDirection = unitMove.viewDirection;
        let oldX = unitMove.x;
        let oldY = unitMove.y;
        let xCounter = 0;
        let yCounter = 0;
        let goingSouth = oldY <= unitMove.pathGoal[0];
        let goingEast = oldX === unitMove.pathGoal[1] ? unitMove.viewDirection.name.includes("east") : oldX < unitMove.pathGoal[1];
        for (const tilePath of unitMove.path.reverse()) {
            if (oldX !== tilePath.x) {
                if (yCounter !== 0) {
                    await performMovement(oldY, oldX, yCounter, unitMove, true, goingSouth, goingEast);
                    yCounter = 0;
                }
                goingEast = oldX < tilePath.x;
                ++xCounter;
                oldX = tilePath.x;
            } else if (oldY !== tilePath.y) {
                if (xCounter !== 0) {
                    await performMovement(oldY, oldX, xCounter, unitMove, false, goingSouth, goingEast);
                    xCounter = 0;
                }
                goingSouth = oldY < tilePath.y;
                ++yCounter;
                oldY = tilePath.y;
            }
        }

        // Check if there is left over movement
        if (xCounter !== 0) {
            await performMovement(oldY, oldX, xCounter, unitMove, false, goingSouth, goingEast);
        } else if (yCounter !== 0) {
            await performMovement(oldY, oldX, yCounter, unitMove, true, goingSouth, goingEast);
        }

        // Set oldY and oldX to current position
        // Prevents unit from redoing last animation each redraw
        unitMove.oldY = unitMove.y;
        unitMove.oldX = unitMove.x;

        //reset animation
        unitMove.animation = "idle";
        if ((unitMove.type === UnitTypes.WAR_ELEPHANT) &&
            (unitMove.viewDirection === Direction.north || unitMove.viewDirection === Direction.south)) {
            unitMove.viewDirection = startViewDirection;
        }

    }

    const performMovement = async (y, x, steps, unitMove, verticalMovement, goingSouth, goingEast) => {
        if (unitMove.type === UnitTypes.WAR_ELEPHANT) {
            if (verticalMovement) {
                if (goingSouth) {
                    unitMove.viewDirection = Direction.south;
                } else {
                    unitMove.viewDirection = Direction.north;
                }
            } else {
                if (goingEast) {
                    unitMove.viewDirection = Direction.east;
                } else {
                    unitMove.viewDirection = Direction.west;
                }
            }
        } else {
            if (goingSouth && goingEast) {
                unitMove.viewDirection = Direction.southEast;
            } else if (goingSouth && !goingEast) {
                unitMove.viewDirection = Direction.southWest;
            } else if (!goingSouth && goingEast) {
                unitMove.viewDirection = Direction.northEast;
            } else if (!goingSouth && !goingEast) {
                unitMove.viewDirection = Direction.northWest;
            }
        }

        unitMove.move(y, x);

        props.unitData.sort((a, b) => a.y - b.y);
        //FIXME: FIND A BETTER WAY TO FORCE A REDRAW
        setDropDown({...dropDown, open: false});
        let time = (unitMove.movementSpeed * steps);
        await timer(time);
    }


    const onClickCancel = () => {
        hideUnitIndicators(selectedUnit);
        hideDropDownsAndPopUps();
        setSelectedUnit(null);
    }

    const hideUnitIndicators = (unit) => {
        unit.showRangeIndicator(false);
        if (unit.path) {
            unit.showPathIndicator(false);
        }
    }

    const hideDropDownsAndPopUps = () => {
        setDropDown({...dropDown, open: false})
        setDamageIndicator({...damageIndicator, open: false});
    }

    const cleanUpUnits = () => {
        // Clear all previously calculated data
        props.unitData.forEach((unit) => {
            unit.tilesInAttackRange = null;
            unit.tilesInAttackRangeSpecificTile = null;
            unit.traversableTiles = null;
            unit.path = null;
            unit.pathGoal = null;
        })
    }

    let tiles = null;
    if (props.mapData) {
        tiles = props.mapData.map((row, y) => (
            <tr key={y}>
                {
                    row.map((tile, x) => (
                        <td key={x}>
                            <Tile tile={tile}
                                  onClick={onClickTile}
                            />
                        </td>
                    ))
                }
            </tr>
        ));
    }


    let units = null;
    if (props.unitData) {
        units = props.unitData.map((unit, id) => (
            <Unit key={id}
                  unit={unit}
                  onClick={onClickUnit}
                  showMarker={unit.userId === playerId && unit.moved === false && unit.userId === props.playerIdCurrentTurn}
            />
        ));
    }

    return (
        <div className={"mapContainer"}>
            <table cellPadding={0} cellSpacing={0} border={0} id={"map"}>
                <tbody>
                {tiles}
                </tbody>
            </table>
            {units}
            <DamageIndicator open={damageIndicator.open}
                             y={damageIndicator.y}
                             x={damageIndicator.x}
                             leftDamage={damageIndicator.leftDamage}
                             rightDamage={damageIndicator.rightDamage}
                             leftRed={damageIndicator.leftRed}
            />
            <DropDown
                open={dropDown.open}
                showAttack={dropDown.showAttack}
                showWait={dropDown.showWait}
                y={dropDown.y}
                x={dropDown.x}
                onClickWait={onClickWait}
                onClickCancel={onClickCancel}
                onClickAttack={onClickAttack}
                target={dropDown.target}
            />
            <CustomPopUp open={errorMessage !== ''} information={errorMessage}>
                <Button onClick={() =>
                    setErrorMessage("")
                }>
                    Close
                </Button>
            </CustomPopUp>
            <Socket
                topics={window.location.pathname}
                onMessage={onMessage}
            />
        </div>
    );

}

Map.propTypes = {
    mapData: PropTypes.array.isRequired,
    unitData: PropTypes.array.isRequired,
    playerIdCurrentTurn: PropTypes.number,
    onChangeTurn: PropTypes.func,
}

export default Map;
