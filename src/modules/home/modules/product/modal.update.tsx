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
import ProductDescriptionEditor from "./quill";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ProductService } from "@/services/product";
import { Loader, SquarePen, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { UploadService } from "@/services/upload";
import "@/styles/scroll-hiding.css";

export function ModalUpdateProduct({ data }: { data: any }) {
  const { toast } = useToast();

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const secondaryImageInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingForDelete, setIsLoadingForDelete] = useState<boolean>(false);

  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const [secondaryPreviews, setSecondaryPreviews] = useState<string[]>([]);

  const [nameVN, setNameVN] = useState<string>("");
  const [nameEN, setNameEN] = useState<string>("");
  const [nameJP, setNameJP] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [descriptionVN, setDescriptionVN] = useState<string>("");
  const [descriptionEN, setDescriptionEN] = useState<string>("");
  const [descriptionJP, setDescriptionJP] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isShow, setIsShow] = useState<boolean>(data?.show_status === "show");

  const handleMainImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size and type
    if (file.size > 5 * 1024 * 1024) {
      alert("File quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh");
      return;
    }

    try {
      const uploadResponse = await UploadService.uploadToCloudinary([file]);
      if (
        uploadResponse &&
        Array.isArray(uploadResponse) &&
        uploadResponse[0]
      ) {
        const cloudUrl = uploadResponse[0].secure_url;
        setMainPreview(cloudUrl);
      } else {
        toast({
          variant: "destructive",
          title: "Không thể tải ảnh lên",
        });
      }
    } catch (error) {
      console.error("Main image upload failed:", error);
      toast({
        variant: "destructive",
        title: "Lỗi khi tải ảnh chính lên",
      });
    }
  };

  const handleSecondaryImagesChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newPreviews: string[] = [];
    const validFiles: File[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} quá lớn. Vui lòng chọn file nhỏ hơn 5MB.`);
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert(`File ${file.name} không phải là hình ảnh.`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length === 0) return;

    try {
      const uploadResponse = await UploadService.uploadToCloudinary(validFiles);

      if (uploadResponse && Array.isArray(uploadResponse)) {
        const newUrls = uploadResponse
          .map((res) => res?.secure_url)
          .filter(Boolean);
        newPreviews.push(...newUrls);

        if (newPreviews.length > 0) {
          setSecondaryPreviews((prev) => [...prev, ...newPreviews]);
        } else {
          toast({
            variant: "destructive",
            title: "Không thể tải các ảnh phụ lên",
          });
        }
      }
    } catch (error) {
      console.error("Secondary images upload failed:", error);
      toast({
        variant: "destructive",
        title: "Lỗi khi tải ảnh phụ lên",
      });
    }
  };

  const handleUpdateMainImage = () => {
    mainImageInputRef.current?.click();
  };

  const handleUpdateSecondaryImages = () => {
    secondaryImageInputRef.current?.click();
  };

  const handleRemoveSecondaryImage = (index: number) => {
    setSecondaryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!mainPreview) {
      toast({
        variant: "destructive",
        title: "Vui lòng chọn ảnh chính.",
      });
      return false;
    }

    if (secondaryPreviews.length === 0) {
      toast({
        variant: "destructive",
        title: "Vui lòng thêm ít nhất một ảnh phụ.",
      });
      return false;
    }

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

    if (!category.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng chọn danh mục.",
      });
      return false;
    }

    return true;
  };

  const validateShowStatus = async () => {
    if (!isShow || data?.show_status === "show") {
      return true;
    }

    try {
      const products = await ProductService.getAll();
      const shownProducts = products.data.filter(
        (product: any) =>
          product.category === category &&
          product.show_status === "show" &&
          product._id !== data?._id
      );

      console.log("shownProducts", shownProducts);

      if (shownProducts.length >= 4) {
        toast({
          variant: "destructive",
          title: "Chỉ được phép có 4 sản phẩm hiển thị trong một danh mục.",
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error validating show status:", error);
      console.log("Error validating show status:", error);

      toast({
        variant: "destructive",
        title: "Lỗi khi kiểm tra trạng thái hiển thị.",
      });
      return false;
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
    if (!(await validateShowStatus())) return;
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
      vietnam_name: nameVN,
      english_name: nameEN,
      japan_name: nameJP,
      vietnam_description: updatedDescriptionVN,
      english_description: updatedDescriptionEN,
      japan_description: updatedDescriptionJP,
      price: price,
      category: category,
      main_image: mainPreview,
      side_images: secondaryPreviews,
      show_status: isShow ? "show" : "not show",
    };
    await ProductService.updateProduct(data?._id, body);
    setIsLoading(false);

    window.location.href = "/";
  };

  const handleDelete = async () => {
    setIsLoadingForDelete(true);
    await ProductService.deleteProduct(data?._id);
    setIsLoadingForDelete(false);
    window.location.href = "/";
  };

  const updateDOM = () => {
    if (data) {
      setNameVN(data?.vietnam_name);
      setNameEN(data?.english_name);
      setNameJP(data?.japan_name);
      setPrice(data?.price);
      setCategory(data?.category);
      setDescriptionVN(data?.vietnam_description);
      setDescriptionEN(data?.english_description);
      setDescriptionJP(data?.japan_description);
      setMainPreview(data?.main_image);
      setSecondaryPreviews(data?.side_images);
      setIsShow(data?.show_status === "show");
    }
  };

  useEffect(() => {
    console.log("data", data);

    updateDOM();
  }, [data]);

  return (
    <Dialog>
      <DialogTrigger onClick={updateDOM}>
        <div className="flex">
          <div className="mx-2 p-2 cursor-pointer hover:bg-indigo-600 rounded-full group">
            <SquarePen
              size={23}
              className="text-gray-900 group-hover:text-white"
            />
          </div>
        </div>
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
        <div className="w-full grid grid-cols-3 gap-8">
          <div className="col-span-1">
            <div className="overflow-y-auto max-h-[70vh] scroll-bar-style">
              <div className="mb-6">
                <Label htmlFor="thumbnail" className="text-right !text-[16px]">
                  Hình chính
                </Label>
                <div className="mt-2">
                  {!mainPreview && (
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
                  {mainPreview && (
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
                          src={mainPreview}
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
              <Label htmlFor="images" className="text-right !text-[16px]">
                Hình phụ
              </Label>
              <div className="col-span-3 mt-2">
                <div
                  onClick={handleUpdateSecondaryImages}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-primary-700 cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <span>+ Tải lên</span>
                  </div>
                </div>
                <input
                  type="file"
                  ref={secondaryImageInputRef}
                  onChange={handleSecondaryImagesChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 pr-2">
                {secondaryPreviews?.map((preview: any, index: any) => (
                  <div key={index} className="relative">
                    <Image
                      src={preview}
                      alt={`secondary-preview-${index}`}
                      className="rounded-sm border border-gray-200 w-full h-28 object-cover"
                      width={1000}
                      height={1000}
                    />
                    <button
                      onClick={() => handleRemoveSecondaryImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full text-xs"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="pl-4 flex flex-col justify-start items-start gap-2 overflow-y-auto max-h-[70vh] pr-0 scroll-bar-style">
              <Label htmlFor="isShow" className="text-[14.5px] mt-2">
                Hiện sản phẩm lên trang chính
              </Label>
              <div className="w-full grid items-center gap-4">
                <input
                  type="checkbox"
                  id="isShow"
                  className="switch"
                  checked={isShow}
                  onChange={(e) => setIsShow(e.target.checked)}
                />
              </div>
              <Label htmlFor="description" className="text-[14.5px]">
                Tên sản phẩm tiếng Việt
              </Label>
              <div className="w-full grid items-center gap-4">
                <textarea
                  id="nameVN"
                  value={nameVN}
                  onChange={(e) => setNameVN(e.target.value)}
                  placeholder="Tên sản phẩm tiếng Việt"
                  className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
                ></textarea>
              </div>
              <Label htmlFor="description" className="text-[14.5px]">
                Tên sản phẩm tiếng Anh
              </Label>
              <div className="w-full grid items-center gap-4">
                <textarea
                  id="nameEN"
                  value={nameEN}
                  onChange={(e) => setNameEN(e.target.value)}
                  placeholder="Tên sản phẩm tiếng Anh"
                  className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
                ></textarea>
              </div>
              <Label htmlFor="description" className="text-[14.5px]">
                Tên sản phẩm tiếng Nhật
              </Label>
              <div className="w-full grid items-center gap-4">
                <textarea
                  id="nameJP"
                  value={nameJP}
                  onChange={(e) => setNameJP(e.target.value)}
                  placeholder="Tên sản phẩm tiếng Nhật"
                  className="col-span-3 p-2 border border-[#CFCFCF] placeholder-custom rounded"
                ></textarea>
              </div>
              <Label htmlFor="description" className="text-[14.5px] mt-2">
                Chọn danh mục
              </Label>
              <div className="w-full grid items-center gap-4">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                  className="col-span-3 p-2 border border-[#CFCFCF] rounded placeholder-custom focus:border-gray-500"
                >
                  <option value="">Chọn danh mục</option>
                  <option value="kitchen">Nhà bếp</option>
                  <option value="pet-house">Nhà thú cưng</option>
                  <option value="fashion">Thời trang</option>
                  <option value="home-decor">Trang trí nhà cửa</option>
                </select>
              </div>
              <Label htmlFor="description" className="text-[14.5px] mt-2">
                Giá sản phẩm
              </Label>
              <div className="w-full grid items-center gap-4">
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Giá"
                  className="col-span-3 p-2 border rounded border-[#CFCFCF] placeholder-custom focus:border-gray-500"
                ></input>
              </div>

              <div className="w-full mt-2">
                <ProductDescriptionEditor
                  value={descriptionVN}
                  onChange={setDescriptionVN}
                  title="Mô tả sản phẩm tiếng Việt"
                />
              </div>
              <div className="w-full mt-2">
                <ProductDescriptionEditor
                  value={descriptionEN}
                  onChange={setDescriptionEN}
                  title="Mô tả sản phẩm tiếng Anh"
                />
              </div>
              <div className="w-full mt-2">
                <ProductDescriptionEditor
                  value={descriptionJP}
                  onChange={setDescriptionJP}
                  title="Mô tả sản phẩm tiếng Nhật"
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="w-full !flex !flex-row !justify-between !items-center">
          <Button
            onClick={handleDelete}
            type="submit"
            className="!px-8 !text-[16px] text-red-600 bg-white border-2 border-red-600 hover:bg-red-600 hover:text-white"
          >
            <Trash2 />
            Xoá
            {isLoadingForDelete && (
              <Loader className="animate-spin" size={48} />
            )}
          </Button>
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
