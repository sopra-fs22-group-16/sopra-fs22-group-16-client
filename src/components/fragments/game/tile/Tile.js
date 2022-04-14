import PropTypes from "prop-types";
import React from "react";
import TileModel from "../../../../models/TileModel";
import TileBackground from "./TileBackground";
import TileIndicator from "./TileHighlight";

const Tile = props => {

    const onClickTile = () => {
        if (props.onClick) {
            props.onClick(props.tile);
        }
    }

    return (
        <div className="tileContainer" onClick={onClickTile}>
            <TileBackground type={props.tile.type} variant={props.tile.variant}/>
            <TileIndicator indicatorType={props.tile.indicatorType}/>
        </div>
    );
}

Tile.propTypes = {
    tile: PropTypes.instanceOf(TileModel).isRequired,
    onClick: PropTypes.func,
}

export default Tile;
