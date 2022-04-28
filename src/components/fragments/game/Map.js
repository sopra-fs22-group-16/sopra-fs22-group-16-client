import React from "react";
import PropTypes from "prop-types";
import Tile from "./tile/Tile";

import "styles/views/game/Map.scss"
import Unit from "./unit/Unit";
import DropDown from "../../ui/DropDown";

const Map = props => {

    let tiles = null;
    if (props.mapData) {
        tiles = props.mapData.map((row, y) => (
            <tr key={y}>
                {
                    row.map((tile, x) => (
                        <td key={x}>
                            <Tile tile={tile}
                                  onClick={props.onClickTile}
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
            <Unit key={id} unit={unit} onClick={props.onClickUnit}/>
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
            {props.children}
        </div>
    );

}

Map.propTypes = {
    mapData: PropTypes.array.isRequired,
    unitData: PropTypes.array.isRequired,
    onClickTile: PropTypes.func.isRequired,
    onClickUnit: PropTypes.func.isRequired,

}

export default Map;
