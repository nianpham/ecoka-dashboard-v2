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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { UploadService } from "@/services/upload";
import { ESGService } from "@/services/esg";
import { EnterpriseService } from "@/services/enterprise";

export function ModalUpdateEnterprise({ data }: { data: any }) {
  const { toast } = useToast();

  const mainImageInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [nameVN, setNameVN] = useState<string>("");
  const [nameEN, setNameEN] = useState<string>("");
  const [nameJP, setNameJP] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [addressVN, setAddressVN] = useState<string>("");
  const [addressEN, setAddressEN] = useState<string>("");
  const [addressJP, setAddressJP] = useState<string>("");
  const [descriptionVN, setDescriptionVN] = useState<string>("");
  const [descriptionEN, setDescriptionEN] = useState<string>("");
  const [descriptionJP, setDescriptionJP] = useState<string>("");

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
  };

  const handleUpdateMainImage = () => {
    mainImageInputRef.current?.click();
  };

  const validateForm = () => {
    if (!nameVN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập tên tiếng Việt.",
      });
      return false;
    }
    if (!nameEN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập tên tiếng Anh.",
      });
      return false;
    }
    if (!nameJP.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập tên tiếng Nhật.",
      });
      return false;
    }

    if (!descriptionVN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập mô tả tiếng Việt.",
      });
      return false;
    }

    if (!descriptionEN.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập mô tả tiếng Anh.",
      });
      return false;
    }

    if (!descriptionJP.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng nhập mô tả tiếng Nhật.",
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
        return "";
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      return "";
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

    const updatedDescriptionVN = await replaceBase64WithCloudUrls(
      descriptionVN,
      handleImageUpload
    );
    const updatedDescriptionEN = await replaceBase64WithCloudUrls(
      descriptionEN,
      handleImageUpload
    );
    const updatedDescriptionJP = await replaceBase64WithCloudUrls(
      descriptionJP,
      handleImageUpload
    );

    const body = {
      name_vn: nameVN,
      name_en: nameEN,
      name_jp: nameJP,
      phone: phone,
      email: email,
      address_vn: addressVN,
      address_en: addressEN,
      address_jp: addressJP,
      description_vn: updatedDescriptionVN,
      description_en: updatedDescriptionEN,
      description_jp: updatedDescriptionJP,
    };
    await EnterpriseService.updateEnterprise(data?._id, body);
    setIsLoading(false);
    window.location.href = "/?tab=business";
  };

  const updateDOM = () => {
    if (data) {
      setNameVN(data?.name_vn);
      setNameEN(data?.name_en);
      setNameJP(data?.name_jp);
      setPhone(data?.phone);
      setEmail(data?.email);
      setAddressVN(data?.address_vn);
      setAddressEN(data?.address_en);
      setAddressJP(data?.address_jp);
      setDescriptionVN(data?.description_vn);
      setDescriptionEN(data?.description_en);
      setDescriptionJP(data?.description_jp);
    }
  };

  useEffect(() => {
    updateDOM();
  }, [data]);

  return (
    <Dialog>
      <DialogTrigger onClick={updateDOM}>
        <button
          type="button"
          className="flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Cập nhật thông tin
        </button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[1200px] max-h-[100vh]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <span className="!text-[20px]">
              Chỉnh sửa thông tin{" "}
              <span className="lowercase">{data?.name_vn}</span>
            </span>
          </DialogTitle>
          <DialogDescription>
            <span className="!text-[16px]">
              Chỉnh sửa thông tin mục{" "}
              <span className="lowercase">{data?.name_vn}</span> và nhấn{" "}
              <strong className="text-indigo-600">Cập nhật</strong> để lưu thông
              tin.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="w-full grid grid-cols-3 gap-8">
          <div className="col-span-3">
            <div className="flex flex-col justify-start items-start gap-2 overflow-y-auto max-h-[70vh] pr-0 scroll-bar-style">
              <div className="grid grid-cols-2 col-span-2 gap-8 w-full">
                <div>
                  <Label htmlFor="description" className="text-[14.5px]">
                    Tên công ty tiếng Việt
                  </Label>
                  <div className="w-full grid items-center gap-4 mt-1 mb-2">
                    <textarea
                      id="nameVN"
                      value={nameVN}
                      onChange={(e) => setNameVN(e.target.value)}
                      placeholder="Tên sản phẩm tiếng Việt"
                      className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
                    ></textarea>
                  </div>
                  <Label htmlFor="description" className="text-[14.5px]">
                    Tên công ty tiếng Anh
                  </Label>
                  <div className="w-full grid items-center gap-4 mt-1 mb-2">
                    <textarea
                      id="nameEN"
                      value={nameEN}
                      onChange={(e) => setNameEN(e.target.value)}
                      placeholder="Tên sản phẩm tiếng Anh"
                      className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
                    ></textarea>
                  </div>
                  <Label htmlFor="description" className="text-[14.5px]">
                    Tên công ty tiếng Nhật
                  </Label>
                  <div className="w-full grid items-center gap-4 mt-1 mb-0">
                    <textarea
                      id="nameJP"
                      value={nameJP}
                      onChange={(e) => setNameJP(e.target.value)}
                      placeholder="Tên sản phẩm tiếng Nhật"
                      className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
                    ></textarea>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description" className="text-[14.5px]">
                    Địa chỉ tiếng Việt
                  </Label>
                  <div className="w-full grid items-center gap-4 mt-1 mb-2">
                    <textarea
                      id="addressVN"
                      value={addressVN}
                      onChange={(e) => setAddressVN(e.target.value)}
                      placeholder="Tên sản phẩm tiếng Nhật"
                      className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
                    ></textarea>
                  </div>
                  <Label htmlFor="description" className="text-[14.5px]">
                    Địa chỉ tiếng Anh
                  </Label>
                  <div className="w-full grid items-center gap-4 mt-1 mb-2">
                    <textarea
                      id="addressEN"
                      value={addressEN}
                      onChange={(e) => setAddressEN(e.target.value)}
                      placeholder="Tên sản phẩm tiếng Nhật"
                      className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
                    ></textarea>
                  </div>
                  <Label htmlFor="description" className="text-[14.5px]">
                    Địa chỉ tiếng Nhật
                  </Label>
                  <div className="w-full grid items-center gap-4 mt-1 mb-0">
                    <textarea
                      id="addressJP"
                      value={addressJP}
                      onChange={(e) => setAddressJP(e.target.value)}
                      placeholder="Tên sản phẩm tiếng Nhật"
                      className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 col-span-2 gap-8 w-full">
                <div>
                  <Label htmlFor="phone" className="text-[14.5px]">
                    Số điện thoại
                  </Label>
                  <div className="w-full grid items-center gap-4">
                    <textarea
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Số điện thoại"
                      className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
                    ></textarea>
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-[14.5px]">
                    Email
                  </Label>
                  <div className="w-full grid items-center gap-4">
                    <textarea
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
                    ></textarea>
                  </div>
                </div>
              </div>
              <Label htmlFor="description" className="text-[14.5px]">
                Mô tả tiếng Việt
              </Label>
              <div className="w-full grid items-center gap-4">
                <textarea
                  id="descriptionVN"
                  value={descriptionVN}
                  onChange={(e) => setDescriptionVN(e.target.value)}
                  placeholder="Mô tả tiếng Việt"
                  className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
                  rows={4}
                ></textarea>
              </div>
              <Label htmlFor="description" className="text-[14.5px]">
                Mô tả tiếng Anh
              </Label>
              <div className="w-full grid items-center gap-4">
                <textarea
                  id="descriptionEN"
                  value={descriptionEN}
                  onChange={(e) => setDescriptionEN(e.target.value)}
                  placeholder="Mô tả tiếng Anh"
                  className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
                  rows={4}
                ></textarea>
              </div>
              <Label htmlFor="description" className="text-[14.5px]">
                Mô tả tiếng Nhật
              </Label>
              <div className="w-full grid items-center gap-4">
                <textarea
                  id="descriptionJP"
                  value={descriptionJP}
                  onChange={(e) => setDescriptionJP(e.target.value)}
                  placeholder="Mô tả tiếng Nhật"
                  className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
                  rows={4}
                ></textarea>
              </div>
            </div>
          </div>
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
              Cập nhật
              {isLoading && <Loader className="animate-spin" size={17} />}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
