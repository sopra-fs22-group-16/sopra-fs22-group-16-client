import {createTheme} from "@mui/material";

const defaultTheme = createTheme({
    palette: {
        primary: {
            main: '#FBC12E',
            dark: '#604C18',
            contrastText: '#292420',
        },
        secondary: {
            main: '#292420',
            contrastText: '#FBC12E',
        },
        text: {
            primary: '#292420'
        },
        background: {
            main: '#414141',
        }
    },
    typography: {
        fontSize: 13,
    },
});

export default defaultTheme;
