import Carousel from "./Carousel";
import {useEffect, useState} from "react";
import {getShowOns} from "../../services/showOnService.tsx";
import {message, Spin} from "antd";
import {useTranslation} from "react-i18next";
import {MovieShowOn} from "./MovieCard";
import {LoadingOutlined} from "@ant-design/icons";
import ShowOn from "./ShowOn";
import {getBanners} from "../../services/bannerService.tsx";

export interface Banner {
    id: number;
    thumbnail: string;
    title: string;
    link: string;
    contentType: "movie" | "category";
    position: number;
    status: number;
    contentName: string | null;
    contentSlug: string | null;
    subBannerResponse: {
        description: string | null;
        numberOfChild: number | null;
        releaseDate: string | null;
    };
    bannerItems: [];
}

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
    const [banners, setBanners] = useState<Banner[]>([]);
    const [showOns, setShowOns] = useState<ShowOnInterface[]>([]);
    const { t } = useTranslation();
    const [isBannersLoading, setIsBannersLoading] = useState<boolean>(false);
    const [isShowOnsLoading, setIsShowOnsLoading] = useState<boolean>(false);

    const fetchBanners = async () => {
        setIsBannersLoading(true);
        try {
            const response = await getBanners();
            const result = await response.json();
            if (!response.ok || result.status === 404) return;

            const sortedBanners: Banner[] = result.data.content.sort((a: Banner, b: Banner) => a.position - b.position);

            setBanners(sortedBanners);
        } catch (e) {
            console.error(e);
            message.error(t('client.message.fetchError'));
        } finally {
            setIsBannersLoading(false);
        }
    };

    const fetchShowOns = async () => {
        setIsShowOnsLoading(true);
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
            setIsShowOnsLoading(false);
        }
    }

    useEffect(() => {
        fetchBanners();
        fetchShowOns();
    }, []);

    return (
        <>
            {
                isBannersLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                        <Spin indicator={<LoadingOutlined spin />} />
                    </div>
                ) : <Carousel banners={banners} />
            }
            {isShowOnsLoading ? (
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