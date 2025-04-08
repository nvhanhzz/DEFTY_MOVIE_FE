import Title from 'antd/es/typography/Title';
import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import {Statistic, Row, Col, Card, Typography, message} from 'antd';
import {
    UserOutlined,
    VideoCameraOutlined,
    AppstoreAddOutlined,
    ReadOutlined,
    GiftOutlined,
    TagsOutlined, TeamOutlined,
} from '@ant-design/icons';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
    ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import {getMovies} from "../../services/movieService.tsx";
import {Movie} from "../Movie";
import {getUsers} from "../../services/userService.tsx";
import {getMembershipPackets} from "../../services/membershipPackageService.tsx";
import {MembershipPackage} from "../MembershipPackage";
import { getBanners } from '../../services/bannerService.tsx';
import {getArticles} from "../../services/articleService.tsx";
import {getCategories} from "../../services/categoryService.tsx";

const { Text } = Typography;

const data = [
    { name: 'Tháng 1', users: 400, exams: 240 },
    { name: 'Tháng 2', users: 300, exams: 139 },
    { name: 'Tháng 3', users: 200, exams: 980 },
    { name: 'Tháng 4', users: 278, exams: 390 },
    { name: 'Tháng 5', users: 189, exams: 480 },
];

const Dashboard: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalMovies, setTotalMovies] = useState(0);
    const [totalBanners, setTotalBanners] = useState(0);
    const [totalArticles, setTotalArticles] = useState(0);
    const [totalMembership, setTotalMembership] = useState(0);
    const [totalCategories, setTotalCategories] = useState(0);

    const onCardClick = (path: string) => {
        navigate(path);
    };

    const cardStyle = {
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
    };

    const fetchTotalUsers = async () => {
        try {
            const response = await getUsers(0, 1, {}); // Chỉ lấy metadata
            const result = await response.json();
            if (response.ok && result.data?.totalElements !== undefined) {
                setTotalUsers(result.data.totalElements);
            } else {
                setTotalUsers(0);
            }
        } catch (error) {
            console.error("Failed to fetch total users:", error);
        }
    };
    const fetchTotalMovies = async () => {
        try {
            const response = await getMovies(0, 1, {});
            const result = await response.json();
            if (response.ok && result?.data?.totalElements) {
                setTotalMovies(result.data.totalElements);
            }
        } catch (err) {
            console.error("Failed to fetch total movies:", err);
        }
    };

    const fetchTotalBanners = async () => {
        try {
            const response = await getBanners(0, 1, {});
            const result = await response.json();
            setTotalBanners(result.data.totalElements || 0);
        } catch {
            setTotalBanners(0);
        }
    };

    const fetchTotalArticles = async () => {
        try {
            const response = await getArticles(0, 1, {});
            const result = await response.json();
            setTotalArticles(result.data.totalElements || 0);
        } catch {
            setTotalArticles(0);
        }
    };
    const fetchTotalCategories = async () => {
        try {
            const response = await getCategories(0, 1, {});
            const result = await response.json();
            setTotalCategories(result.data.totalElements || 0);
        } catch {
            setTotalCategories(0);
        }
    };
    const fetchTotalMembership = async () => {
        try {
            const response = await getMembershipPackets(1, 1, {});
            const result = await response.json();
            if (response.ok && result?.data?.totalElements) {
                setTotalMembership(result.data.totalElements);
            }
        } catch (err) {
            console.error("Failed to fetch total membership:", err);
        }
    };

    useEffect(() => {
        fetchTotalUsers();
        fetchTotalMovies();
        fetchTotalBanners();
        fetchTotalArticles();
        fetchTotalMembership();
        fetchTotalCategories();
    }, []);

    const createCard = (icon: JSX.Element, title: string, value: number, color: string, path: string) => (
        <Card
            hoverable
            onClick={() => onCardClick(path)}
            style={{ ...cardStyle }}
            bodyStyle={{ padding: 20 }}
        >
            <Statistic
                title={
                    <span>
                        {React.cloneElement(icon, { style: { color, marginRight: 8 } })}
                        {title}
                    </span>
                }
                value={value}
                valueStyle={{ color, fontWeight: 'bold' }}
            />
        </Card>
    );

    return (
        <>
            <Title level={2} style={{ marginBottom: 24 }}>
                {t('admin.dashboard.title')}
            </Title>

            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} md={8}>
                    {createCard(<TeamOutlined />, t('admin.dashboard.totalUsers'), totalUsers, '#1890ff', '/admin/users')}
                </Col>
                <Col xs={24} sm={12} md={8}>
                    {createCard(<VideoCameraOutlined />, t('admin.dashboard.totalMovies'), totalMovies, '#722ed1', '/admin/movies')}
                </Col>
                <Col xs={24} sm={12} md={8}>
                    {createCard(<AppstoreAddOutlined />, t('admin.dashboard.totalBanners'), totalBanners, '#52c41a', '/admin/banners')}
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: 15 }}>
                <Col xs={24} sm={12} md={8}>
                    {createCard(<ReadOutlined />, t('admin.dashboard.totalArticles'), totalArticles, '#b35438', '/admin/articles')}
                </Col>
                <Col xs={24} sm={12} md={8}>
                    {createCard(<GiftOutlined />, t('admin.dashboard.totalMembershipPackets'), totalMembership, '#dfb151', '/admin/membership-packets')}
                </Col>
                <Col xs={24} sm={12} md={8}>
                    {createCard(<TagsOutlined />, t('admin.dashboard.totalCategories'), totalCategories, '#476397', '/admin/categories')}
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
                <Col xs={24} md={12}>
                    <Card
                        title="📈 Tăng trưởng người dùng"
                        bordered={false}
                        style={{ borderRadius: '16px' }}
                    >
                        <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                            Số lượng người dùng mới theo từng tháng
                        </Text>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#1890ff"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card
                        title="📊 Doanh thu theo tháng"
                        bordered={false}
                        style={{ borderRadius: '16px' }}
                    >
                        <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                            Thống kê số lượng đăng ký gói Premium theo từng tháng
                        </Text>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="exams" fill="#722ed1" barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Dashboard;
