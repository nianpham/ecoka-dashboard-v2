/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { DATA } from "@/utils/data.bk";

export default function ESG() {
  return (
    <section className="p-4">
      <div className="relative overflow-hidden">
        <div className="flex">
          <div className="flex items-center flex-1">
            <h5>
              <span className="text-gray-800 text-[20px] font-bold">
                Environmental   -   Social   -   Governance
              </span>
            </h5>
          </div>
        </div>
        <div className="flex flex-col justify-between mt-4">
          <div>
            <div className="grid grid-cols-12 gap-8">
              {DATA.ESG.map((esg: any) => (
                <div
                  key={esg.id}
                  className="col-span-12 lg:col-span-4 md:col-span-4"
                >
                  <div className="rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                      <h3 className="font-medium text-black dark:text-white">
                        {esg.title}
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="w-full mb-4">
                        <Image
                          src={esg.thumbnail}
                          alt="img"
                          width={1000}
                          height={0}
                          className="rounded-lg h-[200px] w-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <textarea
                          defaultValue={esg.description}
                          className="w-full px-3 py-2 border rounded-lg"
                          rows={14}
                          onChange={(e) => (esg.description = e.target.value)}
                        ></textarea>
                      </div>
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
