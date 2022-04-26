import {Direction} from "../components/fragments/game/unit/Direction";
import {UnitTypes} from "../components/fragments/game/unit/data/UnitTypes";
import {TileIndicatorType} from "../components/fragments/game/tile/types/TileIndicatorType";
import {ArrowPartType} from "../components/fragments/game/tile/types/ArrowPartType";

class UnitModel {
    constructor(y, x, data = {}) {
        this.y = y;
        this.x = x;
        this.type = null;
        this.health = 0;
        this.defense = 0;
        this.attackDamage = 0;
        this.attackRange = 0;
        this.movementRange = 0;
        this.commands = [];
        this.teamId = null;
        this.userId = null;
        Object.assign(this, data);
        // if teamId === 0 (red) look southWest/west else teamId === 1 (blue) look southEast/east
        if (this.type === UnitTypes.war_elephant) {
            this.viewDirection = this.teamId ? Direction.west : Direction.east;
        } else {
            this.viewDirection = this.teamId ? Direction.southWest : Direction.southEast;
        }
        this.selected = false;
        this.movableTiles = null;
        this.attackableTiles = null;
        this.attackableTilesFromATile = null;
        this.pathGoal = null
        this.path = null;

    }

    calculatePathToTile = (goalY, goalX, map) => {
        // Check if movable is already calculated and that the goal is in range
        if (this.movableTiles == null || !this.movableTiles.includes(map[goalY][goalX])) return;

        // Check if the goal is already set and if it changed
        if (this.pathGoal != null && (this.pathGoal[0] === goalY && this.pathGoal[1] === goalX)) return;


        this.pathGoal = [goalY, goalX];
        this.path = null;

        // more or less implementation of A*
        let tile = map[this.y][this.x];

        let node = [tile, 0, 0, null]; // [tile, g(x), f(x) = g(x) + h(x), parent]

        // Check if the goal is the tile the unit stands on
        if (this.y === goalY && this.x === goalX) {
            this.path = [tile];
            return;
        }
        let frontier = [node]; // array sorted by f(x)
        let reached = [tile];

        while (frontier.length > 0) {
            // Get first element in frontier
            node = frontier.shift();

            let tile = node[0];
            let distance = node[1];

            // Check each tile up, down, left, right
            let tileOffset = [[-1, 0], [1, 0], [0, -1], [0, 1]];

            let childTile = null;

            tileOffset.forEach((tileOffset) => {
                // Calculate the position of the child
                let yPos = tile.y + tileOffset[0];
                let xPos = tile.x + tileOffset[1];

                // Check if tile is in map
                if (yPos >= 0 && yPos < map.length && xPos >= 0 && xPos < map[yPos].length) {
                    // get child tile
                    childTile = map[yPos][xPos];

                    // Check if childTile is in movableTiles
                    if (this.movableTiles.includes(childTile)) {

                        if (childTile.y === goalY && childTile.x === goalX) {
                            this.path = [];
                            this.path.push(childTile);
                            this.path.push(tile);
                            // go back up and add tiles to path
                            let parent = node[3];
                            while (parent != null) {
                                // Add the parent tile to the path
                                this.path.push(parent[0]);
                                // Get the parent of the parent
                                parent = parent[3];
                            }
                            return;
                        }
                        if (!reached.includes(childTile)) {
                            reached.push(childTile);

                            let childDistance = distance + childTile.traversingCost;
                            let childHeuristic = Math.sqrt((goalY - childTile.y) ** 2 + (goalX - childTile.x) ** 2);
                            let childEstimatedCost = childDistance + childHeuristic;

                            frontier.push([childTile, childDistance, childEstimatedCost, node])

                        }
                    }

                }
            });

            // Check if a path was found
            if (this.path != null) {
                return;
            }

            // After all children have been added sort by f(x)
            frontier.sort(function (a, b) {
                return a[2] - b[2]
            });

        }

        // If no path was found return empty array
        this.pathGoal = [goalY, goalX];
        this.path = [];
    }

    calculateTilesInRange = (map) => {
        if (this.movableTiles === null || this.attackableTiles === null) {
            this.#calculateMovementRange(map);
            this.#calculateAttackRange(map);
        }
    }

    #calculateMovementRange = (map) => {
        let node = null;
        let movableTiles = [];
        let frontier = [[map[this.y][this.x], 0]]; // tile, distance

        while (frontier.length > 0) {
            // Get element in frontier
            node = frontier.shift();
            let tile = node[0];
            let distance = node[1];

            // If node is not in movableTiles yet, add it
            if (!movableTiles.includes(node[0])) {
                movableTiles.push(node[0]);
            }

            // If we reached maxRange we do not have to look at children of the tile
            // as they would all have greater distance than max range
            if (distance >= this.movementRange) continue;

            // Check each tile up, down, left, right
            let tileOffset = [[-1, 0], [1, 0], [0, -1], [0, 1]];

            let childTile = null;

            tileOffset.forEach((tileOffset) => {
                // Calculate the position of the child
                let yPos = tile.y + tileOffset[0];
                let xPos = tile.x + tileOffset[1];

                // Check if tile is in map
                if (yPos >= 0 && yPos < map.length && xPos >= 0 && xPos < map[yPos].length) {
                    // get child tile
                    childTile = map[yPos][xPos];

                    // Check if child is already in frontier or movableTiles,
                    // if it is it has smaller distance and we don't need to add it again
                    if (!frontier.includes(childTile) && !movableTiles.includes(childTile)) {
                        // Check if tile is traversable
                        if (childTile.traversable && childTile.unit === null) {
                            // Calculate the distance to the child
                            let childDistance = distance + childTile.traversingCost;

                            // Check that child is in range
                            if (childDistance <= this.movementRange) {
                                // Add child to frontier
                                frontier.push([childTile, childDistance]);
                            }
                        }
                    }
                }
            });
        }

        this.movableTiles = movableTiles;
    }

    #calculateAttackRange = (map) => {
        if (this.movableTiles === null) return;
        let attackableTiles = [];

        this.attackableTilesFromATile = {};

        this.movableTiles.forEach((movableTile) => {
            let node = null;
            let frontier = [[movableTile, 0]]; // tile, distance

            let attackableTilesFromThisTile = [];
            let foundHostileUnit = false;

            while (frontier.length > 0) {
                node = frontier.shift();
                let tile = node[0];
                let distance = node[1];

                // If node is not in attackableTiles yet and it is traversable add it
                if (!attackableTiles.includes(tile) && tile.traversable) {
                    attackableTiles.push(tile);
                }

                if(!attackableTilesFromThisTile.includes(tile) && tile.traversable){
                    attackableTilesFromThisTile.push(tile);
                }

                // If we reached maxRange we do not have to look at children of the tile
                // as they would all have greater distance than max range
                if (distance >= this.attackRange) continue;

                // Check each tile up, down, left, right
                let tileOffset = [[-1, 0], [1, 0], [0, -1], [0, 1]];

                let childTile = null;

                tileOffset.forEach((tileOffset) => {
                    // Calculate the position of the child
                    let yPos = tile.y + tileOffset[0];
                    let xPos = tile.x + tileOffset[1];

                    // Check if tile is in map
                    if (yPos >= 0 && yPos < map.length && xPos >= 0 && xPos < map[yPos].length) {
                        // get child tile
                        childTile = map[yPos][xPos];

                        // Calculate the distance to the child
                        let childDistance = distance + childTile.traversingCost;

                        // Check that child is in range
                        if (childDistance <= this.attackRange) {
                            // Add child to frontier
                            frontier.push([childTile, childDistance]);
                            if(childTile.unit !== null && childTile.unit.teamId !== this.teamId){
                                foundHostileUnit = true;
                            }
                        }

                    }
                });

            }

            if(foundHostileUnit){
                if(!this.attackableTilesFromATile[movableTile.y]){
                    this.attackableTilesFromATile[movableTile.y] = {};
                }
                this.attackableTilesFromATile[movableTile.y][movableTile.x] = attackableTilesFromThisTile;

            }
        });

        this.attackableTiles = attackableTiles;
    }

    showPathIndicator = (show) => {
        // Update the tiles that they show the attack range indicator
        let lastX = 0;
        let lastY = 0;
        let lastDir = Direction.north;
        let lastTile = null;

        if (this.path != null)
            this.path.forEach((tile) => {
                if (show) {
                    if (this.pathGoal[0] === tile.y && this.pathGoal[1] === tile.x) {
                        tile.arrowPart = ArrowPartType.end;
                    } else if (this.y === tile.y && this.x === tile.x) {
                        tile.arrowPart = ArrowPartType.start;
                    } else {
                        tile.arrowPart = ArrowPartType.straight;
                    }


                    if (tile.y < lastY) {
                        tile.arrowDirection = Direction.south;
                        if (lastTile != null) {
                            if (lastTile.arrowPart !== ArrowPartType.end) {
                                if (lastDir === Direction.east) {
                                    lastTile.arrowPart = ArrowPartType.corner;
                                    lastTile.arrowDirection = Direction.south;
                                } else if (lastDir === Direction.west) {
                                    lastTile.arrowPart = ArrowPartType.corner;
                                    lastTile.arrowDirection = Direction.west;
                                }
                            } else {
                                lastTile.arrowDirection = Direction.south;
                            }
                        }


                        lastDir = Direction.north;
                    } else if (tile.y > lastY) {
                        tile.arrowDirection = Direction.north;

                        if (lastTile != null) {
                            if (lastTile.arrowPart !== ArrowPartType.end) {
                                if (lastDir === Direction.east) {
                                    lastTile.arrowPart = ArrowPartType.corner;
                                    lastTile.arrowDirection = Direction.east;
                                } else if (lastDir === Direction.west) {
                                    lastTile.arrowPart = ArrowPartType.corner;
                                    lastTile.arrowDirection = Direction.north;
                                }
                            } else {
                                lastTile.arrowDirection = Direction.north;
                            }
                        }


                        lastDir = Direction.south;
                    } else if (tile.x > lastX) {
                        tile.arrowDirection = Direction.west;
                        if (lastTile != null) {
                            if (lastTile.arrowPart !== ArrowPartType.end) {
                                if (lastDir === Direction.north) {
                                    lastTile.arrowPart = ArrowPartType.corner;
                                    lastTile.arrowDirection = Direction.north;
                                } else if (lastDir === Direction.south) {
                                    lastTile.arrowPart = ArrowPartType.corner;
                                    lastTile.arrowDirection = Direction.west;
                                }
                            } else {
                                lastTile.arrowDirection = Direction.west;
                            }
                        }


                        lastDir = Direction.east;
                    } else if (tile.x < lastX) {
                        tile.arrowDirection = Direction.east;
                        if (lastTile != null) {
                            if (lastTile.arrowPart !== ArrowPartType.end) {
                                if (lastDir === Direction.north) {
                                    lastTile.arrowPart = ArrowPartType.corner;
                                    lastTile.arrowDirection = Direction.east;
                                } else if (lastDir === Direction.south) {
                                    lastTile.arrowPart = ArrowPartType.corner;
                                    lastTile.arrowDirection = Direction.south;
                                }
                            } else {
                                lastTile.arrowDirection = Direction.east;
                            }
                        }


                        lastDir = Direction.west;
                    }

                    lastX = tile.x;
                    lastY = tile.y;
                    lastTile = tile;
                } else {
                    tile.arrowPart = ArrowPartType.none;

                }
            });
    }

    showRangeIndicator = (show) => {
        // Update the tiles that they show the attack range indicator
        if (this.attackableTiles !== null)
            this.attackableTiles.forEach((tile) => {
                if (show) {
                    if (tile.unit && tile.unit.teamId !== this.teamId) {
                        tile.indicatorType = TileIndicatorType.hostileUnit;
                    } else {
                        tile.indicatorType = TileIndicatorType.attackRange;
                    }
                } else {
                    tile.indicatorType = TileIndicatorType.none;
                }
            })

        // Update the tiles that they show the movement range indicator
        if (this.movableTiles !== null)
            this.movableTiles.forEach((tile) => {
                if (show) {
                    if (tile.indicatorType !== TileIndicatorType.hostileUnit) {
                        tile.indicatorType = TileIndicatorType.movementRange;
                    }
                } else {
                    tile.indicatorType = TileIndicatorType.none;
                }

            })
    }

}

export default UnitModel;
