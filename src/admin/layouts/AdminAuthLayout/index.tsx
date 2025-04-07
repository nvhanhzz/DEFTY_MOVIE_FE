import { Outlet } from "react-router-dom";
import AlertContainer from "../../components/AlertContainer";

function AdminLayoutDefault() {
    return (
        <>
            <AlertContainer />
            <Outlet />
        </>
    );
}

export default AdminLayoutDefault;