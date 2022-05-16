import {createTheme} from "@mui/material";

export const defaultTheme = createTheme({
    palette: {
        primary: {
            main: '#d7ae25',
            dark: '#604C18',
            contrastText: '#292420',
        },
        secondary: {
            main: '#292420',
            contrastText: '#d7ae25',
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