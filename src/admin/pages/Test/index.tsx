import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const MyForm: React.FC = () => {
    const [description, setDescription] = useState<string>(""); // Nội dung TinyMCE
    const [images, setImages] = useState<File[]>([]); // Lưu trữ các file ảnh

    const handleEditorChange = (content: string) => {
        setDescription(content);
    };

    const handleFileSelect = (callback: (url: string) => void, meta: any) => {
        if (meta.filetype === "image") {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.onchange = (e: any) => {
                const file = e.target.files[0];
                if (file) {
                    // Lưu file ảnh vào state, không upload ngay
                    setImages((prev) => [...prev, file]);
                    // Tạm thời hiển thị URL local
                    const tempUrl = URL.createObjectURL(file);
                    callback(tempUrl); // Hiển thị ảnh tạm thời trong TinyMCE
                }
            };
            input.click();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const uploadedImages: { [key: string]: string } = {}; // Map file name -> URL

            // Upload từng file ảnh
            for (const file of images) {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("/upload", {
                    method: "POST",
                    body: formData,
                });
                const data = await response.json();
                uploadedImages[file.name] = data.url; // Lưu URL ảnh trả về
            }

            // Cập nhật nội dung TinyMCE với URL thực
            let updatedDescription = description;
            Object.keys(uploadedImages).forEach((fileName) => {
                const tempUrl = URL.createObjectURL(
                    images.find((img) => img.name === fileName) as File
                );
                updatedDescription = updatedDescription.replace(
                    new RegExp(tempUrl, "g"),
                    uploadedImages[fileName]
                );
            });

            // Lưu form data
            const formData = {
                description: updatedDescription,
            };
            console.log("Form data submitted:", formData);

            // Reset state sau khi submit
            setImages([]);
        } catch (error) {
            console.error("Error uploading images:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Editor
                apiKey="munobof2ofogzrs3j4kwqd0o778lj6vfwr9406mhob73clzz"
                value={description}
                init={{
                    height: 500,
                    menubar: true,
                    plugins: ["image"],
                    toolbar: "undo redo | image",
                    file_picker_callback: handleFileSelect, // Chọn file nhưng không upload
                }}
                onEditorChange={handleEditorChange}
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default MyForm;
