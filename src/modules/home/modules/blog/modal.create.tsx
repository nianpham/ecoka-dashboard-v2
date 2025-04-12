/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ProductService } from "@/services/product";
import { Loader, Plus, SquarePen, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { UploadService } from "@/services/upload";
import BlogSetion from "./blog-section";
import { BlogService } from "@/services/blog";
import { Label } from "@radix-ui/react-label";

interface BlogProps {
  _id: string;
  author: string;
  s1_title_vn: string;
  s1_title_en: string;
  s1_title_jp: string;
  s1_content_vn: string;
  s1_content_en: string;
  s1_content_jp: string;
  s1_thumbnail: string;
  s2_title_vn: string;
  s2_title_en: string;
  s2_title_jp: string;
  s2_content_vn: string;
  s2_content_en: string;
  s2_content_jp: string;
  s2_thumbnail: string;
  s3_title_vn: string;
  s3_title_en: string;
  s3_title_jp: string;
  s3_content_vn: string;
  s3_content_en: string;
  s3_content_jp: string;
  s3_thumbnail: string;
  s4_content_en: string;
  s4_content_jp: string;
  s4_content_vn: string;
  s4_thumbnail: string;
  s4_title_en: string;
  s4_title_jp: string;
  s4_title_vn: string;
  created_at: string;
}

export function ModalCreateBlog() {
  const { toast } = useToast();

  const mainImageInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingForDelete, setIsLoadingForDelete] = useState<boolean>(false);

  const [selectedSection, setSelectedSection] = useState<number>(1);

  const [s1_titleVN, setS1TitleVN] = useState<string>("");
  const [s1_titleEN, setS1TitleEN] = useState<string>("");
  const [s1_titleJP, setS1TitleJP] = useState<string>("");

  const [s2_titleVN, setS2TitleVN] = useState<string>("");
  const [s2_titleEN, setS2TitleEN] = useState<string>("");
  const [s2_titleJP, setS2TitleJP] = useState<string>("");

  const [s3_titleVN, setS3TitleVN] = useState<string>("");
  const [s3_titleEN, setS3TitleEN] = useState<string>("");
  const [s3_titleJP, setS3TitleJP] = useState<string>("");

  const [s4_titleVN, setS4TitleVN] = useState<string>("");
  const [s4_titleEN, setS4TitleEN] = useState<string>("");
  const [s4_titleJP, setS4TitleJP] = useState<string>("");

  const [s1_contentVN, setS1ContentVN] = useState<string>("");
  const [s1_contentEN, setS1ContentEN] = useState<string>("");
  const [s1_contentJP, setS1ContentJP] = useState<string>("");

  const [s2_contentVN, setS2ContentVN] = useState<string>("");
  const [s2_contentEN, setS2ContentEN] = useState<string>("");
  const [s2_contentJP, setS2ContentJP] = useState<string>("");

  const [s3_contentVN, setS3ContentVN] = useState<string>("");
  const [s3_contentEN, setS3ContentEN] = useState<string>("");
  const [s3_contentJP, setS3ContentJP] = useState<string>("");

  const [s4_contentVN, setS4ContentVN] = useState<string>("");
  const [s4_contentEN, setS4ContentEN] = useState<string>("");
  const [s4_contentJP, setS4ContentJP] = useState<string>("");

  const [author, setAuthor] = useState<string>("");
  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const [mainPreview2, setMainPreview2] = useState<string | null>(null);
  const [mainPreview3, setMainPreview3] = useState<string | null>(null);
  const [mainPreview4, setMainPreview4] = useState<string | null>(null);

  const validateForm = () => {
    if (!author.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập tên tác giả.",
      });
      return false;
    }

    // Section 1
    if (!mainPreview) {
      toast({
        variant: "destructive",
        title: "Vui lòng chọn ảnh chính cho mục 1.",
      });
      return false;
    }
    if (!s1_titleVN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập tên tiếng Việt cho mục 1.",
      });
      return false;
    }
    if (!s1_titleEN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập tên tiếng Anh cho mục 1.",
      });
      return false;
    }
    if (!s1_titleJP.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập tên tiếng Nhật cho mục 1.",
      });
      return false;
    }
    if (!s1_contentVN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập mô tả tiếng Việt cho mục 1.",
      });
      return false;
    }
    if (!s1_contentEN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập mô tả tiếng Anh cho mục 1.",
      });
      return false;
    }
    if (!s1_contentJP.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập mô tả tiếng Nhật cho mục 1.",
      });
      return false;
    }

    // Section 2
    if (!mainPreview2) {
      toast({
        variant: "destructive",
        title: "Vui lòng chọn ảnh chính cho mục 2.",
      });
      return false;
    }
    if (!s2_titleVN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập tên tiếng Việt cho mục 2.",
      });
      return false;
    }
    if (!s2_titleEN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập tên tiếng Anh cho mục 2.",
      });
      return false;
    }
    if (!s2_titleJP.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập tên tiếng Nhật cho mục 2.",
      });
      return false;
    }
    if (!s2_contentVN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập mô tả tiếng Việt cho mục 2.",
      });
      return false;
    }
    if (!s2_contentEN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập mô tả tiếng Anh cho mục 2.",
      });
      return false;
    }
    if (!s2_contentJP.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập mô tả tiếng Nhật cho mục 2.",
      });
      return false;
    }

    // Section 3
    if (!mainPreview3) {
      toast({
        variant: "destructive",
        title: "Vui lòng chọn ảnh chính cho mục 3.",
      });
      return false;
    }
    if (!s3_titleVN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập tên tiếng Việt cho mục 3.",
      });
      return false;
    }
    if (!s3_titleEN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập tên tiếng Anh cho mục 3.",
      });
      return false;
    }
    if (!s3_titleJP.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập tên tiếng Nhật cho mục 3.",
      });
      return false;
    }
    if (!s3_contentVN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập mô tả tiếng Việt cho mục 3.",
      });
      return false;
    }
    if (!s3_contentEN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập mô tả tiếng Anh cho mục 3.",
      });
      return false;
    }
    if (!s3_contentJP.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập mô tả tiếng Nhật cho mục 3.",
      });
      return false;
    }

    // Section 4
    if (!mainPreview4) {
      toast({
        variant: "destructive",
        title: "Vui lòng chọn ảnh chính cho mục 4.",
      });
      return false;
    }
    if (!s4_titleVN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập tên tiếng Việt cho mục 4.",
      });
      return false;
    }
    if (!s4_titleEN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập tên tiếng Anh cho mục 4.",
      });
      return false;
    }
    if (!s4_titleJP.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập tên tiếng Nhật cho mục 4.",
      });
      return false;
    }
    if (!s4_contentVN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập mô tả tiếng Việt cho mục 4.",
      });
      return false;
    }
    if (!s4_contentEN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập mô tả tiếng Anh cho mục 4.",
      });
      return false;
    }
    if (!s4_contentJP.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập mô tả tiếng Nhật cho mục 4.",
      });
      return false;
    }

    return true;
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

  const extractBase64Images = (htmlContent: string) => {
    const imgTagRegex =
      /<img[^>]+src=["'](data:image\/[^;]+;base64[^"']+)["'][^>]*>/g;
    const matches = [...htmlContent.matchAll(imgTagRegex)];
    return matches.map((match) => match[1]);
  };

  const replaceBase64WithCloudUrls = async (
    htmlContent: string,
    uploadFunc: (file: File) => Promise<string>
  ) => {
    const imgTagRegex =
      /<img[^>]+src=["'](data:image\/[^;]+;base64[^"']+)["'][^>]*>/g;
    let updatedContent = htmlContent;

    const matches = [...htmlContent.matchAll(imgTagRegex)];
    for (const match of matches) {
      const base64String = match[1];
      const file = base64ToFile(base64String);
      const uploadedUrl = await uploadFunc(file);
      updatedContent = updatedContent.replace(base64String, uploadedUrl);
    }

    return updatedContent;
  };

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

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    const updatedContent = {
      s1_content_vn: await replaceBase64WithCloudUrls(
        s1_contentVN,
        handleImageUpload
      ),
      s1_content_en: await replaceBase64WithCloudUrls(
        s1_contentEN,
        handleImageUpload
      ),
      s1_content_jp: await replaceBase64WithCloudUrls(
        s1_contentJP,
        handleImageUpload
      ),
      s2_content_vn: await replaceBase64WithCloudUrls(
        s2_contentVN,
        handleImageUpload
      ),
      s2_content_en: await replaceBase64WithCloudUrls(
        s2_contentEN,
        handleImageUpload
      ),
      s2_content_jp: await replaceBase64WithCloudUrls(
        s2_contentJP,
        handleImageUpload
      ),
      s3_content_vn: await replaceBase64WithCloudUrls(
        s3_contentVN,
        handleImageUpload
      ),
      s3_content_en: await replaceBase64WithCloudUrls(
        s3_contentEN,
        handleImageUpload
      ),
      s3_content_jp: await replaceBase64WithCloudUrls(
        s3_contentJP,
        handleImageUpload
      ),
      s4_content_vn: await replaceBase64WithCloudUrls(
        s4_contentVN,
        handleImageUpload
      ),
      s4_content_en: await replaceBase64WithCloudUrls(
        s4_contentEN,
        handleImageUpload
      ),
      s4_content_jp: await replaceBase64WithCloudUrls(
        s4_contentJP,
        handleImageUpload
      ),
    };

    const body = {
      author,
      s1_title_vn: s1_titleVN,
      s1_title_en: s1_titleEN,
      s1_title_jp: s1_titleJP,
      s1_content_vn: updatedContent.s1_content_vn,
      s1_content_en: updatedContent.s1_content_en,
      s1_content_jp: updatedContent.s1_content_jp,
      s1_thumbnail: mainPreview,
      s2_title_vn: s2_titleVN,
      s2_title_en: s2_titleEN,
      s2_title_jp: s2_titleJP,
      s2_content_vn: updatedContent.s2_content_vn,
      s2_content_en: updatedContent.s2_content_en,
      s2_content_jp: updatedContent.s2_content_jp,
      s2_thumbnail: mainPreview2,
      s3_title_vn: s3_titleVN,
      s3_title_en: s3_titleEN,
      s3_title_jp: s3_titleJP,
      s3_content_vn: updatedContent.s3_content_vn,
      s3_content_en: updatedContent.s3_content_en,
      s3_content_jp: updatedContent.s3_content_jp,
      s3_thumbnail: mainPreview3,
      s4_title_vn: s4_titleVN,
      s4_title_en: s4_titleEN,
      s4_title_jp: s4_titleJP,
      s4_content_vn: updatedContent.s4_content_vn,
      s4_content_en: updatedContent.s4_content_en,
      s4_content_jp: updatedContent.s4_content_jp,
      s4_thumbnail: mainPreview4,
    };

    console.log("Submitting payload:", body);

    try {
      await BlogService.createBlog(body);
    } catch (error) {
      toast({ variant: "destructive", title: "Cập nhật thất bại!" });
    }
    setIsLoading(false);
    // window.location.href = "/?tab=blog";
  };

  const handleSectionUpdate = (
    section: number,
    updates: {
      thumbnail?: string | null;
      stitleVN?: string;
      stitleEN?: string;
      stitleJP?: string;
      scontentVN?: string;
      scontentEN?: string;
      scontentJP?: string;
    }
  ) => {
    if (section === 1) {
      setMainPreview(updates.thumbnail ?? mainPreview);
      setS1TitleVN(updates.stitleVN ?? s1_titleVN);
      setS1TitleEN(updates.stitleEN ?? s1_titleEN);
      setS1TitleJP(updates.stitleJP ?? s1_titleJP);
      setS1ContentVN(updates.scontentVN ?? s1_contentVN);
      setS1ContentEN(updates.scontentEN ?? s1_contentEN);
      setS1ContentJP(updates.scontentJP ?? s1_contentJP);
    } else if (section === 2) {
      setMainPreview2(updates.thumbnail ?? mainPreview2);
      setS2TitleVN(updates.stitleVN ?? s2_titleVN);
      setS2TitleEN(updates.stitleEN ?? s2_titleEN);
      setS2TitleJP(updates.stitleJP ?? s2_titleJP);
      setS2ContentVN(updates.scontentVN ?? s2_contentVN);
      setS2ContentEN(updates.scontentEN ?? s2_contentEN);
      setS2ContentJP(updates.scontentJP ?? s2_contentJP);
    } else if (section === 3) {
      setMainPreview3(updates.thumbnail ?? mainPreview3);
      setS3TitleVN(updates.stitleVN ?? s3_titleVN);
      setS3TitleEN(updates.stitleEN ?? s3_titleEN);
      setS3TitleJP(updates.stitleJP ?? s3_titleJP);
      setS3ContentVN(updates.scontentVN ?? s3_contentVN);
      setS3ContentEN(updates.scontentEN ?? s3_contentEN);
      setS3ContentJP(updates.scontentJP ?? s3_contentJP);
    } else if (section === 4) {
      setMainPreview4(updates.thumbnail ?? mainPreview4);
      setS4TitleVN(updates.stitleVN ?? s4_titleVN);
      setS4TitleEN(updates.stitleEN ?? s4_titleEN);
      setS4TitleJP(updates.stitleJP ?? s4_titleJP);
      setS4ContentVN(updates.scontentVN ?? s4_contentVN);
      setS4ContentEN(updates.scontentEN ?? s4_contentEN);
      setS4ContentJP(updates.scontentJP ?? s4_contentJP);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <button
          type="button"
          className="flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          <Plus size={16} className="mr-2" /> Thêm bài viết
        </button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[1200px] max-h-[100vh]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <span className="!text-[20px]">Chỉnh sửa sản phẩm</span>
          </DialogTitle>
          <DialogDescription>
            <span className="!text-[16px]">
              Chỉnh sửa thông tin sản phẩm và nhấn{" "}
              <strong className="text-indigo-600">Cập nhật</strong> để lưu thông
              tin.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex flex-row justify-between items-center mb-4">
            <div className="flex flex-row gap-3 mb-4">
              <div
                className={`cursor-pointer ${
                  selectedSection === 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-black"
                }  px-5 py-2 rounded-xl hover:bg-indigo-600 hover:text-white`}
                onClick={() => setSelectedSection(1)}
              >
                Section 1
              </div>
              <div
                className={`cursor-pointer ${
                  selectedSection === 2
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-black"
                }  px-5 py-2 rounded-xl hover:bg-indigo-600 hover:text-white`}
                onClick={() => setSelectedSection(2)}
              >
                Section 2
              </div>
              <div
                className={`cursor-pointer ${
                  selectedSection === 3
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-black"
                }  px-5 py-2 rounded-xl hover:bg-indigo-600 hover:text-white`}
                onClick={() => setSelectedSection(3)}
              >
                Section 3
              </div>
              <div
                className={`cursor-pointer ${
                  selectedSection === 4
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-black"
                }  px-5 py-2 rounded-xl hover:bg-indigo-600 hover:text-white`}
                onClick={() => setSelectedSection(4)}
              >
                Section 4
              </div>
            </div>
            <div className="flex flex-row gap-3">
              <Label
                htmlFor="author"
                className="text-[14.5px] mt-2 w-full text-center"
              >
                Tên tác giả
              </Label>
              <div className="w-52 items-center">
                <input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Tác giả"
                  className="col-span-3 p-2 border rounded border-[#CFCFCF] placeholder-custom focus:border-gray-500"
                />
              </div>
            </div>
          </div>
          {selectedSection === 1 && (
            <BlogSetion
              thumbnail={mainPreview}
              stitleVN={s1_titleVN}
              stitleEN={s1_titleEN}
              stitleJP={s1_titleJP}
              scontentVN={s1_contentVN}
              scontentEN={s1_contentEN}
              scontentJP={s1_contentJP}
              onChange={(updates) => handleSectionUpdate(1, updates)}
            />
          )}
          {selectedSection === 2 && (
            <BlogSetion
              thumbnail={mainPreview2}
              stitleVN={s2_titleVN}
              stitleEN={s2_titleEN}
              stitleJP={s2_titleJP}
              scontentVN={s2_contentVN}
              scontentEN={s2_contentEN}
              scontentJP={s2_contentJP}
              onChange={(updates) => handleSectionUpdate(2, updates)}
            />
          )}
          {selectedSection === 3 && (
            <BlogSetion
              thumbnail={mainPreview3}
              stitleVN={s3_titleVN}
              stitleEN={s3_titleEN}
              stitleJP={s3_titleJP}
              scontentVN={s3_contentVN}
              scontentEN={s3_contentEN}
              scontentJP={s3_contentJP}
              onChange={(updates) => handleSectionUpdate(3, updates)}
            />
          )}
          {selectedSection === 4 && (
            <BlogSetion
              thumbnail={mainPreview4}
              stitleVN={s4_titleVN}
              stitleEN={s4_titleEN}
              stitleJP={s4_titleJP}
              scontentVN={s4_contentVN}
              scontentEN={s4_contentEN}
              scontentJP={s4_contentJP}
              onChange={(updates) => handleSectionUpdate(4, updates)}
            />
          )}
        </div>
        <DialogFooter className="w-full !flex !flex-row !justify-between !items-center">
          <div></div>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="!px-10 !text-[16px]"
              >
                Huỷ
              </Button>
            </DialogClose>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex flex-row justify-center items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-md text-sm !px-10 !text-[16px] py-2.5 text-center"
            >
              Thêm bài viết
              {isLoading && <Loader className="animate-spin" size={17} />}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
