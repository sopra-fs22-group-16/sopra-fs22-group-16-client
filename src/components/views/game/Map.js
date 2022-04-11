import React from "react";
import {LinearProgress} from "@mui/material";
import PropTypes from "prop-types";
import {ThemeProvider} from "@emotion/react";

import {defaultTheme} from "../../../styles/themes/defaulTheme";

import "styles/views/game/Game.scss"
import "styles/views/game/Map.scss"

const Map = props => {

    let content = null;

    if(props.mapData){
        content = props.mapData?.map((data, key) => (
            <tr key={key}>
                {
                    data.map((tile, key2) => (
                        <td key={key2}>
                            <Tile type={tile.type} variant={tile.variant}/>
                        </td>
                    ))
                }
            </tr>
        ));
    }

    // If content is not set display loading bar
    if(!content) return (
        <div className={"loadingContainer"}>
            <ThemeProvider theme={defaultTheme}>
                <LinearProgress color="secondary"/>
            </ThemeProvider>
        </div>);

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
}

const Tile = props => {

    return (
        <div className="Tile">
            <img className={"pixelated"} src={"/tiles/" + props.type + "/" + props.variant + ".png"}
                 alt={"Tile"}
                 onDragStart={e => {
                     e.preventDefault()
                 }}/>
        </div>
    );
}

Tile.propTypes = {
    type: PropTypes.string,
    variant: PropTypes.string
}

export default Map;
