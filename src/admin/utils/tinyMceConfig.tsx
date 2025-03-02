const PREFIX_TINY_MCE_API_KEY = import.meta.env.VITE_PREFIX_TINY_MCE_API_KEY as string;

export const tinyMceConfig = {
    selector: 'textarea',
    plugins: [
        // Các plugin cơ bản
        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
        // Các plugin cao cấp miễn phí trong thời gian thử nghiệm
        'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste',
        'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
        // Các tính năng thử nghiệm với tài liệu
        'importword', 'exportword', 'exportpdf'
    ],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name',
    mergetags_list: [
        { value: 'First.Name', title: 'First Name' },
        { value: 'Email', title: 'Email' },
    ],
    ai_request: (_request: any, respondWith: any) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
    apiKey: PREFIX_TINY_MCE_API_KEY, // Thêm API key của bạn vào đây
};
