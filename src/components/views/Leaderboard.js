import React, { useState, useEffect } from 'react';
import { api } from 'helpers/api';
import { useHistory, useLocation } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import BaseContainer from "components/ui/BaseContainer";
import { defaultTheme } from "styles/themes/defaulTheme";
import { ThemeProvider } from "@emotion/react";

import CustomPopUp from "components/ui/CustomPopUp";

import 'styles/views/Leaderboard.scss';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { Pagination } from "@mui/material";

const Leaderboard = () => {

    const usersPerPage = 5;

    const history = useHistory();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState("RANKED_SCORE");
    const [ascending, setAscending] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState({
        page: 0,
        length: 0,
        limit: usersPerPage,
        total: 0,
        users: []
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [getDataFailed, setGetDataFailed] = useState(false);

    const returnHome = () => {
        history.push('/home');
    }

    useEffect(() => {
        obtainAndLoadUserInfo();
    }, [activeTab, ascending]);

    const obtainAndLoadUserInfo = async () => {
        try {
            const response = await api.get(`/v1/users?`
                + `sortBy=${activeTab}`
                + `&ascending=${ascending ? "True" : "False"}`
                + `&pageNumber=${leaderboardData.page}`
                + `&perPage=${usersPerPage}`);

            setLeaderboardData((previous) => {
                return ({ ...response.data, page: previous.page })
            });

        } catch (error) {
            setGetDataFailed(true);
        }
    }

    const gotoUser = (userId) => {
        history.push(`/user/${userId}`);
    }

    const UserInfo = ({ place, userData }) => {
        return (
            <tr onClick={() => {
                gotoUser(userData.id)
            }}>
                <td>
                    {place}
                </td>
                <td>
                    {userData.username}
                </td>
                <td>
                    {userData.rankedScore}
                </td>
                <td>
                    {userData.wins}
                </td>
                <td>
                    {userData.losses}
                </td>
            </tr>
        );
    };

    let content
    content = leaderboardData.users.map((data, key) => {
        let offset = leaderboardData.page * usersPerPage;
        let place = ascending ? leaderboardData.total - offset - key : offset + key + 1;
        return (
            <UserInfo
                key={key}
                place={place}
                userData={data}
            />
        );
    }
    );

    // Fill rest with Spacers
    for (let i = leaderboardData.length; i < usersPerPage; ++i) {
        content.push(
            <tr key={(leaderboardData.length + i)}>
                <td colSpan="5" />
            </tr>);
    }

    const onClickTab = (tab) => {
        if (tab === activeTab) {
            setAscending((prevState => !prevState));
        } else {
            setAscending(false);
            setActiveTab(tab);
        }
    }

    let rsIcon = <ArrowUpwardIcon color={"secondary"} />;
    let winsIcon = <ArrowUpwardIcon color={"secondary"} />;
    let lossesIcon = <ArrowUpwardIcon color={"secondary"} />;
    if (activeTab === "RANKED_SCORE") {
        if (ascending) {
            rsIcon = <ArrowUpwardIcon />;
        } else {
            rsIcon = <ArrowDownwardIcon />;
        }
    } else if (activeTab === "WINS") {
        if (ascending) {
            winsIcon = <ArrowUpwardIcon />;
        } else {
            winsIcon = <ArrowDownwardIcon />;
        }
    } else if (activeTab === "LOSSES") {
        if (ascending) {
            lossesIcon = <ArrowUpwardIcon />;
        } else {
            lossesIcon = <ArrowDownwardIcon />;
        }
    }

    return (
        <BaseContainer>
            <ThemeProvider theme={defaultTheme}>
                <div className="Leaderboard container">
                    <label className="PublicLobbies h1"> Leaderboard </label>

                    <table className="Leaderboard table">
                        <thead>
                            <tr className="">

                                <th />
                                <th>
                                    <div className={"container"}>
                                        <div>NAME</div>
                                        <ArrowUpwardIcon style={{ visibility: "hidden" }} /></div>
                                </th>
                                <th onClick={() => onClickTab("RANKED_SCORE")} className={"clickable"}>
                                    <div className={"container"}>
                                        <div>RS</div>
                                        {rsIcon}</div>
                                </th>
                                <th onClick={() => onClickTab("WINS")} className={"clickable"}>
                                    <div className={"container"}>
                                        <div>WINS</div>
                                        {winsIcon}</div>
                                </th>
                                <th onClick={() => onClickTab("LOSSES")} className={"clickable"}>
                                    <div className={"container"}>
                                        <div>LOSSES</div>
                                        {lossesIcon}</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {content}
                        </tbody>
                    </table>

                    <Pagination count={Math.ceil(leaderboardData.total / usersPerPage)} onChange={(e, pageNumber) => {
                        leaderboardData.page = (pageNumber - 1);
                        obtainAndLoadUserInfo();
                    }} shape="rounded" color="primary" />

                    <div className="Leaderboard button-container">
                        <Button className=""

                            width="100%"
                            onClick={() => returnHome()}
                        >
                            RETURN HOME
                        </Button>
                    </div>


                </div>
                <CustomPopUp open={getDataFailed} information={"Could not get user data - Please try again later!"}>
                    <Button onClick={() =>
                        history.push('/home')
                    }>
                        Return Home
                    </Button>
                </CustomPopUp>
                <CustomPopUp open={errorMessage !== ''} information={errorMessage}>
                    <Button onClick={() =>
                        setErrorMessage("")
                    }>
                        Close
                    </Button>
                </CustomPopUp>
            </ThemeProvider>
        </BaseContainer>
    );
};


export default Leaderboard;