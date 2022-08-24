import { Chip, Container, Divider, Grid, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material"
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useContext, useState } from "react";
import ColorModeContext, { themeMode } from "../services/ThemeContext";
import CardPreview from "../components/cards/CardsPreview";
import { Recipe } from "../types";

const Settings: React.FunctionComponent = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return <Container>
        <Divider>
            <Chip label="Theming" />
        </Divider>
        <Grid
        mt={1}
      container
      justifyContent="space-evenly"
      alignItems="center"
      spacing={ 2 }
      columns={ 12 }
    >
        <Grid item xs={5}>
          <Typography>{theme.palette.mode.charAt(0).toUpperCase() + theme.palette.mode.slice(1)} mode</Typography>
        </Grid>
        <Grid item xs={5}>
        <ToggleButtonGroup fullWidth
                                           value={theme.palette.mode}
                                           exclusive
                                           onChange={(event, value) => {
                                               colorMode.toggleColorMode()
                                           }}
                                           color='primary'
                        >
                            <ToggleButton value="light" aria-label="left aligned">
                                <LightModeIcon/>
                            </ToggleButton>
                            <ToggleButton value="dark" aria-label="centered">
                                <DarkModeIcon/>
                            </ToggleButton>
                        </ToggleButtonGroup>
        </Grid>
    </Grid>
    </Container>
}

export default Settings