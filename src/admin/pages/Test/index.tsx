import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

// Cloudinary không cần core nữa, chỉ dùng API upload trực tiếp
const cloudinaryUploadUrl = 'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload';

interface ReusableEditorProps {
    apiKey: string;
}

const MyEditorWithImageUpload: React.FC<ReusableEditorProps> = ({ apiKey }) => {
    const [editorContent, setEditorContent] = useState<string>(''); // Nội dung của editor
    const [imageFiles, setImageFiles] = useState<File[]>([]); // Lưu trữ các file ảnh để upload sau

    // Hàm xử lý khi người dùng thay đổi nội dung Editor
    const handleEditorChange = (content: string) => {
        setEditorContent(content);
    };

    // Hàm xử lý upload ảnh (được gọi khi form submit)
    const handleSubmit = async () => {
        if (imageFiles.length === 0) {
            console.log("No images to upload");
            return;
        }

        const uploadedImages = await Promise.all(
            imageFiles.map((file) => {
                return new Promise<string>((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', cloudinaryUploadUrl);
                    xhr.onload = () => {
                        if (xhr.status === 200) {
                            resolve(JSON.parse(xhr.responseText).secure_url); // Lấy URL sau khi upload
                        } else {
                            reject(new Error('Failed to upload image'));
                        }
                    };
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', 'your_upload_preset'); // Upload preset từ Cloudinary
                    xhr.send(formData);
                });
            })
        );

        // Thay thế các URL tạm (blob) bằng URL thực từ Cloudinary trong nội dung editor
        let updatedContent = editorContent;
        uploadedImages.forEach((url, index) => {
            const blobUrl = URL.createObjectURL(imageFiles[index]);
            updatedContent = updatedContent.replace(new RegExp(blobUrl, 'g'), url);
        });

        // Sau khi thay thế xong, bạn có thể gửi `updatedContent` lên server
        console.log('Updated Content to submit:', updatedContent);
    };

    // Hàm xử lý khi người dùng upload ảnh từ máy lên nhưng chưa upload lên Cloudinary
    const handleImageUpload = (
        blobInfo: any, // Đây là kiểu của TinyMCE, có thể thay thế bằng kiểu thích hợp
        success: (url: string) => void,
        failure: (message: string) => void
    ) => {
        const file = blobInfo.blob(); // Lấy file ảnh từ blobInfo
        const blobUrl = URL.createObjectURL(file); // Tạo URL tạm để preview ảnh

        // Lưu trữ file ảnh để sau này upload lên Cloudinary
        setImageFiles((prevFiles) => [...prevFiles, file]);

        // Hiển thị ảnh trong TinyMCE
        success(blobUrl);
    };

    return (
        <div style={{ marginTop: 100 }}>
            <Editor
                apiKey={apiKey} // TinyMCE API key
                value={editorContent}
                onEditorChange={handleEditorChange}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: 'image code',
                    toolbar: 'undo redo | link image | code',
                    images_upload_handler: handleImageUpload, // Gọi hàm xử lý upload ảnh
                }}
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default MyEditorWithImageUpload;
