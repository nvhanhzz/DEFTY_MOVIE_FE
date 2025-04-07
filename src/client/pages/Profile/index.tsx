import React from "react";
import "./Profile.scss";
import Sidebar from "./Sidebar";
import {Outlet} from "react-router-dom";

const Profile: React.FC = () => {
    return (
        <>
            <div className={"container"}>
                <Sidebar/>
                <main className="main-content">
                    <Outlet/>
                </main>
            </div>
        </>
    );
};

export default Profile;
