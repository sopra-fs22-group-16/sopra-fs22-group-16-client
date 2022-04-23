import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import TileModel from "../../../../models/TileModel";
import TileBackground from "./TileBackground";
import TileIndicator from "./TileIndicator";
import Unit from "../unit/Unit";
import PathIndicator from "./PathIndicator";
import {ArrowPartType} from "./types/ArrowPartType";

const Tile = props => {


    const onClickTile = () => {
        if (props.onClick) {
            props.onClick(props.tile);
        }
    }

    const onEnterTile = () => {
        props.onMouseEnter(props.tile);
    }

    let unit = null;
    if (props.tile.unit) {
        unit = <Unit unit={props.tile.unit}/>;
    }

    useEffect(() => {
        // Used that the tile updates automatically when tile changes
        console.log("Updating: " + props.tile);
    }, []);

    return (
        <div className="tileContainer"
             onClick={onClickTile}
             onMouseEnter={onEnterTile}
             onMouseLeave={() => props.onMouseLeave(props.tile)}>
            <TileBackground type={props.tile.type} variant={props.tile.variant}/>
            <TileIndicator indicatorType={props.tile.indicatorType}/>
            <PathIndicator pathPartType={props.tile.pathPart.type} pathPartDirection={props.tile.pathPart.direction}/>
            {unit}
        </div>
    );
}

Tile.propTypes = {
    tile: PropTypes.instanceOf(TileModel).isRequired,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
}

export default Tile;
