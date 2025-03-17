/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { ModalCreateProduct } from "./modal.create";
import { ModalUpdateProduct } from "./modal.update";
import { useEffect, useState } from "react";
import { ProductService } from "@/services/product";
import { Loader } from "lucide-react";
import { HELPER } from "@/utils/helper";
import { IMAGES } from "@/utils/image";

export default function Business() {
  const COUNT = 5;

  const [data, setData] = useState([] as any);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currenPage, setCurrenPage] = useState<any>(1 as any);
  const [currenData, setCurrenData] = useState<any>([] as any);

  const selectPage = (pageSelected: any) => {
    setCurrenPage(pageSelected);
    const start = (pageSelected - 1) * COUNT;
    const end = pageSelected * COUNT;
    setCurrenData(data.slice(start, end));
  };

  const prevPage = () => {
    if (currenPage > 1) {
      selectPage(currenPage - 1);
    }
  };

  const nextPage = () => {
    if (currenPage < totalPage) {
      selectPage(currenPage + 1);
    }
  };

  const render = (data: any) => {
    setData(data);
    setTotalPage(Math.ceil(data.length / COUNT));
    setCurrenPage(1);
    setCurrenData(data.slice(0, COUNT));
  };

  const init = async () => {
    const res = await ProductService.getAll();
    if (res && res.data.length > 0) {
      render(res.data);
      setIsLoading(false);
    } else {
      setData([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // init();
  }, []);

  useEffect(() => { }, [totalPage, isLoading, currenData, currenPage]);

  return (
    <section className="p-4">
      <div className="relative overflow-hidden">
        <div className="flex">
          <div className="flex items-center flex-1">
            <h5>
              <span className="text-gray-800 text-[20px] font-bold">
                THÔNG TIN DOANH NGHIỆP
              </span>
            </h5>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-8 mt-4">
          <div className="col-span-5">
            <div className="rounded-md bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="p-0">
                <div>
                  <div className="w-full mb-5.5 flex flex-col gap-8 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="companyName"
                      >
                        Tên doanh nghiệp
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="companyName"
                        id="companyName"
                        placeholder="ECOKA HANDICRAFTS"
                        defaultValue={"CÔNG TY CỔ PHẦN ECOKA"}
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phoneNumber"
                      >
                        Số điện thoại
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        placeholder="Số điện thoại"
                        defaultValue={"(+84) 973 998 068"}
                      />
                    </div>
                  </div>
                  <div className="mb-5.5 flex flex-col gap-8 sm:flex-row mt-6">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="emailAddress"
                      >
                        Email
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="email"
                        name="emailAddress"
                        id="emailAddress"
                        placeholder="abc@gmail.com"
                        defaultValue={"info@ecoka.vn"}
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phoneNumber"
                      >
                        Địa chỉ
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="address"
                        id="address"
                        placeholder="Địa chỉ"
                        defaultValue={"Ấp 2, Xã Vĩnh Thuận Đông, Huyện Long Mỹ, Tỉnh Hậu Giang"}
                      />
                    </div>
                  </div>
                  <div className="mb-5.5 mt-6">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="desc"
                    >
                      Giới thiệu
                    </label>
                    <textarea
                      className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      name="desc"
                      id="desc"
                      rows={4}
                      defaultValue={"CÔNG TY CỔ PHẦN ECOKA. Là công ty sản xuất và thương mại các sản phẩm thủ công mỹ nghệ truyền thống từ các nguyên liệu 100% từ thiên nhiên như: lục bình."}
                    ></textarea>
                  </div>
                  <div className="flex justify-end gap-4.5 mt-2">
                    <button
                      type="button"
                      className="flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Cập nhật thông tin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
