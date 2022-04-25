import {UnitViewDirection} from "../components/fragments/game/unit/UnitViewDirection";
import {UnitTypes} from "../components/fragments/game/unit/data/UnitTypes";
import {TileIndicatorType} from "../components/fragments/game/tile/TileIndicatorType";

class UnitModel {
    constructor(x, y, data = {}) {
        this.x = x;
        this.y = y;
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
            this.viewDirection = this.teamId ? UnitViewDirection.west : UnitViewDirection.east;
        } else {
            this.viewDirection = this.teamId ? UnitViewDirection.southWest : UnitViewDirection.southEast;
        }
        this.selected = false;
        this.movableTiles = null;
        this.attackableTiles = null;

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

        this.movableTiles.forEach((movableTile) => {
            let node = null;
            let frontier = [[movableTile, 0]]; // tile, distance

            while (frontier.length > 0) {
                node = frontier.shift();
                let tile = node[0];
                let distance = node[1];

                // If node is not in attackableTiles yet and it is traversable add it
                if (!attackableTiles.includes(tile) && tile.traversable) {
                    attackableTiles.push(tile);
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
                        }

                    }
                });

            }
        });

        this.attackableTiles = attackableTiles;
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
