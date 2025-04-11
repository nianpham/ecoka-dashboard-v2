/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ESGService } from "@/services/esg";
import { ModalUpdateESG } from "./modal.update";

interface ESGProps {
  _id: string;
  name_vn: string;
  name_en: string;
  name_jp: string;
  thumbnail: string;
  description_vn: string;
  description_en: string;
  description_jp: string;
}

export default function ESG() {
  const [data, setData] = useState([] as ESGProps[]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currenData, setCurrenData] = useState<any>([] as ESGProps[]);

  const render = (data: any) => {
    setData(data);
    setCurrenData(data);
  };

  const init = async () => {
    const res = await ESGService.getAll();
    if (res && res.data.length > 0) {
      render(res.data);
      setIsLoading(false);
    } else {
      setData([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  // useEffect(() => {}, [totalPage, isLoading, currenData, currenPage]);

  return (
    <section className="p-4">
      <div className="relative overflow-hidden">
        <div className="flex">
          <div className="flex items-center flex-1">
            <h5>
              <span className="text-gray-800 text-[20px] font-bold">
                Environmental - Social - Governance
              </span>
            </h5>
          </div>
        </div>
        <div className="flex flex-col justify-between mt-4">
          <div>
            <div className="grid grid-cols-12 gap-8">
              {data?.map((esg: any) => (
                <div
                  key={esg?.id}
                  className="col-span-12 lg:col-span-4 md:col-span-4"
                >
                  <div className="rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                      <h3 className="font-medium text-black dark:text-white">
                        {esg?.name_vn}
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="w-full mb-4">
                        <Image
                          src={esg?.thumbnail}
                          alt="img"
                          width={1000}
                          height={0}
                          className="rounded-lg h-[200px] w-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <textarea
                          defaultValue={esg?.description_vn}
                          className="w-full px-3 py-2 border rounded-lg"
                          rows={12}
                        ></textarea>
                      </div>
                    </div>
                    <div className="w-full flex items-center justify-end gap-2 px-4 pb-4">
                      <ModalUpdateESG data={esg} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
