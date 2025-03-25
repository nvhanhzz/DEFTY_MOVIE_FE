import {useParams} from "react-router-dom";
import {Typography} from "antd";

const { Title } = Typography;

const MoviesOfCategory = () => {
    const { categoryId } = useParams();

    return (
        <div style={{ padding: 20 }}>
            <Title level={2}>Danh sách phim của danh mục {categoryId}</Title>
        </div>
    );
};

export default MoviesOfCategory;
