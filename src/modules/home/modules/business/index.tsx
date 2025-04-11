/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { EnterpriseService } from "@/services/enterprise";
import { ModalUpdateEnterprise } from "./modal.update";

interface EnterpriseProps {
  _id: string;
  name_vn: string;
  name_en: string;
  name_jp: string;
  phone: string;
  email: string;
  description_vn: string;
  description_en: string;
  description_jp: string;
  address_vn: string;
  address_en: string;
  address_jp: string;
}

export default function Business() {
  const [data, setData] = useState({} as EnterpriseProps);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currenData, setCurrenData] = useState<any>({} as EnterpriseProps);

  const render = (data: any) => {
    setData(data);
    setCurrenData(data);
  };

  const init = async () => {
    const res = await EnterpriseService.getAll();
    if (res && res.data.length > 0) {
      render(res.data[0]);
      setIsLoading(false);
    } else {
      setData({} as EnterpriseProps);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

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
                        defaultValue={data?.name_vn}
                        disabled
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
                        defaultValue={data?.phone}
                        disabled
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
                        defaultValue={data?.email}
                        disabled
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
                        defaultValue={data?.address_vn}
                        disabled
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
                      defaultValue={data?.description_vn}
                      disabled
                    ></textarea>
                  </div>
                  <div className="flex justify-end gap-4.5 mt-2">
                    <ModalUpdateEnterprise data={data} />
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
