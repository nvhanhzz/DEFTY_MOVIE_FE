import {Outlet} from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./ClientLayoutDefault.scss";

function ClientLayoutDefault() {
    return (
        <div className="defty-movie">
            <Header />
            <div className="content">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default ClientLayoutDefault;