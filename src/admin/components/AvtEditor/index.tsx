import React, { useRef, useState, useEffect } from "react";
// @ts-ignore
import AvatarEditor from "react-avatar-editor";
import { Modal, Slider, Button, message, Spin } from "antd";
import { UploadOutlined, RedoOutlined, LoadingOutlined } from "@ant-design/icons";
import imageCompression from "browser-image-compression";
import "./AvtEditor.scss";

interface AvtEditorProps {
    onSave: (file: File | null) => void;
    initialImage?: string;
    shape?: "circle" | "rectangle";
}

const AvtEditor: React.FC<AvtEditorProps> = ({ onSave, initialImage, shape = "circle" }) => {
    const [src, setSrc] = useState<string | null>(initialImage || null);
    const [preview, setPreview] = useState<string | null>(initialImage || null); // Preview ảnh
    const [modalOpen, setModalOpen] = useState(false);
    const [slideValue, setSlideValue] = useState<number>(10);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
    const cropRef = useRef<AvatarEditor | null>(null);

    // Xử lý initialImage khi prop thay đổi
    useEffect(() => {
        // console.log(initialImage, "AvtEditor")
        if (initialImage) {
            if (initialImage.startsWith('null')) {
                setSrc(null);
                setPreview(null);
                return;
            }
            const fetchAndSetImage = async () => {
                setIsLoading(true); // Bật loading
                try {
                    const response = await fetch(initialImage);
                    const blob = await response.blob();
                    const objectURL = URL.createObjectURL(blob);
                    setSrc(objectURL);
                    setPreview(objectURL);
                } catch (error) {
                    console.error("Failed to load initial image:", error);
                } finally {
                    setIsLoading(false); // Tắt loading
                }
            };
            fetchAndSetImage();
        }
    }, [initialImage]);

    const handleSave = async () => {
        if (cropRef.current) {
            const canvas = cropRef.current.getImage().toDataURL();
            const response = await fetch(canvas);
            const blob = await response.blob();

            // Tạo File từ Blob
            let file = new File([blob], "avatar.png", { type: "image/png" });

            // Nén File
            try {
                setIsLoading(true); // Bật loading
                const compressedFile = await compressImage(file);
                setPreview(URL.createObjectURL(compressedFile)); // Cập nhật preview
                onSave(compressedFile); // Trả về File qua callback
            } catch (error) {
                message.error("Image compression failed.");
                console.error(error);
            } finally {
                setIsLoading(false); // Tắt loading
                setModalOpen(false); // Đóng modal
            }
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsLoading(true); // Bật loading
            try {
                // Nén ảnh ngay khi tải lên
                const compressedFile = await compressImage(e.target.files[0]);
                const fileUrl = URL.createObjectURL(compressedFile);

                setSrc(fileUrl);
                setPreview(fileUrl);
                setModalOpen(true); // Mở modal chỉnh sửa
            } catch (error) {
                message.error("Failed to compress the image.");
                console.error(error);
            } finally {
                setIsLoading(false); // Tắt loading
            }
        }
    };

    // Hàm nén ảnh
    const compressImage = async (file: File): Promise<File> => {
        const options = {
            maxSizeMB: 1, // Giới hạn kích thước ảnh sau nén (MB)
            maxWidthOrHeight: 1024, // Giới hạn chiều rộng hoặc chiều cao tối đa (px)
            useWebWorker: true,
        };
        return await imageCompression(file, options);
    };

    return (
        <div className="avt-editor">
            {/* Input tải ảnh */}
            <input
                type="file"
                accept="image/*"
                id="upload-avatar"
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
            <label htmlFor="upload-avatar" className="avt-editor__upload-btn">
                <Button
                    icon={src ? <RedoOutlined /> :<UploadOutlined />}
                    style={{ position: "absolute", top: src ? "-35px" : 0, right: 0 }}
                    loading={isLoading} // Loading trạng thái trên nút upload
                    onClick={() => document.getElementById("upload-avatar")?.click()} // Kích hoạt input ẩn
                >
                    {src ? 'Change' : 'Upload'}
                </Button>
            </label>

            {/* Hiển thị loading hoặc preview ảnh */}
            {isLoading ? (
                <div className="avt-editor__loading">
                    <Spin indicator={<LoadingOutlined spin />} /> {/* Loading icon */}
                </div>
            ) : (
                preview && (
                    <div
                        className={`avt-editor__preview ${shape === "rectangle" ? "rectangle" : "circle"}`} // Thay đổi class theo shape
                        onClick={() => setModalOpen(true)} // Click vào ảnh mở modal
                    >
                        <img src={preview} alt="Avatar Preview" />
                    </div>
                )
            )}

            {/* Modal chỉnh sửa */}
            {/* Modal chỉnh sửa */}
            {src && (
                <Modal
                    visible={modalOpen}
                    onCancel={() => setModalOpen(false)}
                    footer={null}
                    className="avt-editor__modal"
                >
                    <div className="avt-editor__content">
                        <AvatarEditor
                            ref={cropRef}
                            image={src}
                            scale={slideValue / 10}
                            border={50}
                            borderRadius={shape === "circle" ? 150 : 0}
                            className={`avt-editor__canvas ${shape === "rectangle" ? "rectangle" : "circle"}`}
                            width={shape === "rectangle" ? 350 : 300}
                            height={shape === "rectangle" ? 200 : 300}
                        />

                        <Slider
                            min={10}
                            max={50}
                            value={slideValue}
                            onChange={(value) => setSlideValue(value as number)}
                            className="avt-editor__slider"
                        />
                        <div className="avt-editor__buttons">
                            {/*<Button danger onClick={() => {*/}
                            {/*    setSrc(null);*/}
                            {/*    setPreview(null);*/}
                            {/*    onSave(null); // Gửi null về component cha*/}
                            {/*    setModalOpen(false); // Đóng modal*/}
                            {/*}}>*/}
                            {/*    Delete*/}
                            {/*</Button>*/}
                            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                            <Button type="primary" onClick={handleSave}>
                                Save
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AvtEditor;
