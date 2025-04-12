import { UploadService } from "@/services/upload";
import { Label } from "@radix-ui/react-label";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface BlogSectionProps {
  thumbnail: string | null;
  stitleVN: string;
  stitleEN: string;
  stitleJP: string;
  scontentVN: string;
  scontentEN: string;
  scontentJP: string;
  onChange: (updates: {
    thumbnail?: string | null;
    stitleVN?: string;
    stitleEN?: string;
    stitleJP?: string;
    scontentVN?: string;
    scontentEN?: string;
    scontentJP?: string;
    author?: string;
  }) => void; // Callback to update parent state
}

const BlogSetion = ({
  thumbnail,
  stitleVN,
  stitleEN,
  stitleJP,
  scontentVN,
  scontentEN,
  scontentJP,
  onChange,
}: BlogSectionProps) => {
  const mainImageInputRef = useRef<HTMLInputElement>(null);

  const handleMainImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh");
      return;
    }

    // Upload to Cloudinary
    const cloudinaryUrl = await handleImageUpload(file);
    if (cloudinaryUrl) {
      onChange({ thumbnail: cloudinaryUrl }); // Pass Cloudinary URL to parent
    } else {
      alert("Tải ảnh lên thất bại. Vui lòng thử lại.");
    }
  };

  const [titleVN, setTitleVN] = useState<string>(stitleVN);
  const [titleEN, setTitleEN] = useState<string>(stitleEN);
  const [titleJP, setTitleJP] = useState<string>(stitleJP);
  const [author, setAuthor] = useState<string>("");
  const [contentVN, setContentVN] = useState<string>(scontentVN);
  const [contentEN, setContentEN] = useState<string>(scontentEN);
  const [contentJP, setContentJP] = useState<string>(scontentJP);
  const [mainPreview, setMainPreview] = useState<string | null>(thumbnail);

  useEffect(() => {
    setTitleVN(stitleVN);
    setTitleEN(stitleEN);
    setTitleJP(stitleJP);
    setContentVN(scontentVN);
    setContentEN(scontentEN);
    setContentJP(scontentJP);
    setMainPreview(thumbnail);
    setAuthor(""); // Reset author if not passed
  }, [
    stitleVN,
    stitleEN,
    stitleJP,
    scontentVN,
    scontentEN,
    scontentJP,
    thumbnail,
  ]);

  const handleUpdateMainImage = () => {
    mainImageInputRef.current?.click();
  };

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case "titleVN":
        setTitleVN(value);
        onChange({ stitleVN: value });
        break;
      case "titleEN":
        setTitleEN(value);
        onChange({ stitleEN: value });
        break;
      case "titleJP":
        setTitleJP(value);
        onChange({ stitleJP: value });
        break;
      case "contentVN":
        setContentVN(value);
        onChange({ scontentVN: value });
        break;
      case "contentEN":
        setContentEN(value);
        onChange({ scontentEN: value });
        break;
      case "contentJP":
        setContentJP(value);
        onChange({ scontentJP: value });
        break;
      case "author":
        setAuthor(value);
        onChange({ author: value });
        break;
    }
  };

  const handleImageUpload = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const uploadResponse = await UploadService.uploadToCloudinary([file]);
      if (
        uploadResponse &&
        Array.isArray(uploadResponse) &&
        uploadResponse[0]
      ) {
        return uploadResponse[0]?.secure_url;
      } else {
        console.error("Upload failed or response is not as expected");
        return null;
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  }, []);

  const base64ToFile = (base64String: string): File => {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], "image.png", { type: mime });
  };

  return (
    <div className="w-full grid grid-cols-3 gap-8">
      <div className="col-span-1">
        <div className="overflow-y-auto max-h-[70vh] scroll-bar-style">
          <div className="mb-6">
            <Label htmlFor="thumbnail" className="text-right !text-[16px]">
              Hình chính
            </Label>
            <div className="mt-2">
              {!thumbnail && (
                <div
                  onClick={handleUpdateMainImage}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white px-5 py-16 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-primary-700 cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <span>+ Tải hình lên</span>
                    <span className="text-xs text-gray-500">
                      hoặc kéo thả file vào đây
                    </span>
                  </div>
                </div>
              )}
              <input
                type="file"
                ref={mainImageInputRef}
                onChange={handleMainImageChange}
                accept="image/*"
                className="hidden"
              />
              {thumbnail && (
                <div className="mt-2">
                  <div className="relative group w-full h-80">
                    <div className="absolute top-0 left-0 right-0 bottom-0 group-hover:bg-black rounded-md opacity-25 z-0 transform duration-200"></div>
                    <div className="cursor-pointer absolute top-[43%] left-[43%] hidden group-hover:flex z-10 transform duration-200">
                      <div className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-full">
                        <Upload
                          onClick={handleUpdateMainImage}
                          color="white"
                          size={26}
                        />
                      </div>
                    </div>
                    <Image
                      src={thumbnail}
                      alt="main-preview"
                      className="w-full h-full object-cover rounded-md mt-2 border border-gray-200"
                      width={1000}
                      height={1000}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2">
        <div className="flex flex-col justify-start items-start gap-2 overflow-y-auto max-h-[70vh] pr-0 scroll-bar-style">
          <Label htmlFor="titleVN" className="text-[14.5px]">
            Tên bài viết tiếng Việt
          </Label>
          <div className="w-full grid items-center gap-4">
            <textarea
              id="titleVN"
              value={titleVN}
              onChange={(e) => handleFieldChange("titleVN", e.target.value)}
              placeholder="Tên bài viết tiếng Việt"
              className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
            ></textarea>
          </div>
          <Label htmlFor="titleEN" className="text-[14.5px]">
            Tên bài viết tiếng Anh
          </Label>
          <div className="w-full grid items-center gap-4">
            <textarea
              id="titleEN"
              value={titleEN}
              onChange={(e) => handleFieldChange("titleEN", e.target.value)}
              placeholder="Tên bài viết tiếng Anh"
              className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
            ></textarea>
          </div>
          <Label htmlFor="titleJP" className="text-[14.5px]">
            Tên bài viết tiếng Nhật
          </Label>
          <div className="w-full grid items-center gap-4">
            <textarea
              id="titleJP"
              value={titleJP}
              onChange={(e) => handleFieldChange("titleJP", e.target.value)}
              placeholder="Tên bài viết tiếng Nhật"
              className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
            ></textarea>
          </div>
          <Label htmlFor="contentVN" className="text-[14.5px]">
            Nội dung bài viết tiếng Việt
          </Label>
          <div className="w-full grid items-center gap-4">
            <textarea
              id="contentVN"
              value={contentVN}
              onChange={(e) => handleFieldChange("contentVN", e.target.value)}
              placeholder="Nội dung bài viết tiếng Việt"
              className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
              rows={4}
            ></textarea>
          </div>
          <Label htmlFor="contentEN" className="text-[14.5px]">
            Nội dung bài viết tiếng Anh
          </Label>
          <div className="w-full grid items-center gap-4">
            <textarea
              id="contentEN"
              value={contentEN}
              onChange={(e) => handleFieldChange("contentEN", e.target.value)}
              placeholder="Nội dung bài viết tiếng Anh"
              className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
              rows={4}
            ></textarea>
          </div>
          <Label htmlFor="contentJP" className="text-[14.5px]">
            Nội dung bài viết tiếng Nhật
          </Label>
          <div className="w-full grid items-center gap-4">
            <textarea
              id="contentJP"
              value={contentJP}
              onChange={(e) => handleFieldChange("contentJP", e.target.value)}
              placeholder="Nội dung bài viết tiếng Nhật"
              className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
              rows={4}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSetion;
