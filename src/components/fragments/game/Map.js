import React from "react";
import PropTypes from "prop-types";
import Tile from "./tile/Tile";

import "styles/views/game/Map.scss"

const Map = props => {

    let content = null;

    if (props.mapData) {
        content = props.mapData?.map((row, y) => (
            <tr key={y}>
                {
                    row.map((tile, x) => (
                        <td key={x}>
                            <Tile tile={tile}
                                  onClick={props.onClickTile}
                                  onMouseEnter={props.onMouseEnterTile}
                                  onMouseLeave={props.onMouseLeaveTile}
                            />
                        </td>
                    ))
                }
            </tr>
        ));
    }

    return (
        <table cellPadding={0} cellSpacing={0} border={0} id={"map"}>
            <tbody>
            {content}
            </tbody>
        </table>

    );

}

Map.propTypes = {
    mapData: PropTypes.array,
    onClickTile: PropTypes.func,
    onMouseEnterTile: PropTypes.func,
    onMouseLeaveTile: PropTypes.func,
}

export default Map;
