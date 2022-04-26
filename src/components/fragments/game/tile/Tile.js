import PropTypes from "prop-types";
import React, {useEffect} from "react";
import TileModel from "../../../../models/TileModel";
import TileBackground from "./TileBackground";
import TileIndicator from "./TileIndicator";
import PathIndicator from "./PathIndicator";

const Tile = props => {

    const onClickTile = () => {
        if (props.onClick) {
            props.onClick(props.tile);
        }
    }

    return (
        <div className="tileContainer"
             onClick={onClickTile}
        >
            <TileBackground type={props.tile.type} variant={props.tile.variant}/>
            <TileIndicator indicatorType={props.tile.indicatorType}/>
            <PathIndicator pathPartType={props.tile.arrowPart} pathPartDirection={props.tile.arrowDirection}/>
        </div>
    );
}

Tile.propTypes = {
    tile: PropTypes.instanceOf(TileModel).isRequired,
    onClick: PropTypes.func
}

export default Tile;
