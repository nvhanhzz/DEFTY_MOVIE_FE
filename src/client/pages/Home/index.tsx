import Carousel from "./Carousel";
import {useEffect, useState} from "react";
import {getShowOns} from "../../services/showOnService.tsx";
import {message, Spin} from "antd";
import {useTranslation} from "react-i18next";
import {MovieShowOn} from "./MovieCard";
import {LoadingOutlined} from "@ant-design/icons";
import ShowOn from "./ShowOn";

export interface ShowOnInterface {
    id: number;
    position: number;
    contentId: number;
    contentType: string;
    contentName: string;
    status: number;
    note: string;
    contentItems: MovieShowOn[];
}

function Home() {
    const [showOns, setShowOns] = useState<ShowOnInterface[]>([]);
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchShowOns = async () => {
            setIsLoading(true);
            try {
                const response = await getShowOns();
                const result = await response.json();
                if (!response.ok || result.status === 404) return;
                const showOnsSorted: ShowOnInterface[] = result.data.content.sort((a: ShowOnInterface, b: ShowOnInterface) => a.position - b.position);

                setShowOns(showOnsSorted);
            } catch (e) {
                console.error(e);
                message.error(t('client.message.fetchError'));
            } finally {
                setIsLoading(false);
            }
        }

        fetchShowOns();
    }, []);

    return (
        <>
            <Carousel />
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                    <Spin indicator={<LoadingOutlined spin />} />
                </div>
            ) : (
                showOns.map((showOn: ShowOnInterface) => (
                    <ShowOn key={showOn.id} {...showOn} />
                ))
            )}
        </>
    );
}

export default Home;