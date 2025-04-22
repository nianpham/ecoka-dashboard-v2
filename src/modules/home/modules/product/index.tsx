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

export default function Product() {
  const COUNT = 5;
  const CATEGORIES = ["kitchen", "fashion", "pet-house", "home-decor"];

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [categorizedData, setCategorizedData] = useState<Record<string, any[]>>(
    {}
  );

  const selectPage = (pageSelected: number) => {
    setCurrentPage(pageSelected);
    const start = (pageSelected - 1) * COUNT;
    const end = pageSelected * COUNT;

    const allProductsInOrder = CATEGORIES.flatMap(
      (category) => categorizedData[category] || []
    );
    setCurrentData(allProductsInOrder.slice(start, end));
  };

  const prevPage = () => {
    if (currentPage > 1) {
      selectPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPage) {
      selectPage(currentPage + 1);
    }
  };

  const init = async () => {
    setIsLoading(true);
    const res = await ProductService.getAll();
    if (res && res.data.length > 0) {
      const products = res.data;
      setData(products);

      // Organize products by category
      const groupedData: Record<string, any[]> = {};
      CATEGORIES.forEach((category) => {
        groupedData[category] = products.filter(
          (item: { category: string }) =>
            item.category.toLowerCase() === category.toLowerCase()
        );
      });
      setCategorizedData(groupedData);

      // Calculate total pages based on all products
      const allProductsInOrder = CATEGORIES.flatMap(
        (category) => groupedData[category] || []
      );
      setTotalPage(Math.ceil(allProductsInOrder.length / COUNT));
      setCurrentPage(1);
      setCurrentData(allProductsInOrder.slice(0, COUNT));
      setIsLoading(false);
    } else {
      setData([]);
      setCategorizedData({});
      setCurrentData([]);
      setTotalPage(0);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <section className="p-4">
      <div className="relative overflow-hidden">
        <div className="flex mb-4">
          <div className="flex items-center flex-1">
            <h5>
              <span className="text-gray-800 text-[20px] font-bold">
                DANH SÁCH SẢN PHẨM{" "}
                <span className="text-indigo-600">({data?.length})</span>
              </span>
            </h5>
          </div>
          <div className="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">
            <ModalCreateProduct />
          </div>
        </div>
        <div className="min-h-[640px] flex flex-col justify-between">
          {isLoading ? (
            <div className="w-full flex justify-center items-center pt-72">
              <Loader className="animate-spin text-indigo-600" size={36} />
            </div>
          ) : data.length === 0 ? (
            <div className="col-span-2 text-center w-full flex flex-col justify-center items-center py-4 mt-60">
              <Image
                src={IMAGES.NOT_FOUND}
                alt="img"
                className="w-12 h-12"
                width={100}
                height={0}
              />
              <p className="text-gray-500 text-lg mt-4">Chưa có sản phẩm!</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-md text-gray-700 uppercase bg-gray-50 border dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="w-48 px-4 py-3">
                        Tên sản phẩm
                      </th>
                      <th scope="col" className="w-48 px-4 py-3">
                        Mô tả
                      </th>
                      <th scope="col" className="w-32 px-4 py-3">
                        Danh mục
                      </th>
                      <th scope="col" className="w-28 px-4 py-3">
                        Giá
                      </th>
                      <th scope="col" className="w-28 px-4 py-3">
                        Hiển thị
                      </th>
                      <th scope="col" className="w-24 px-4 py-3">
                        Chi tiết
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData?.map((item, index) => (
                      <tr
                        key={index}
                        className={`${
                          item?.deleted_at ? "hidden" : ""
                        } border-b border-l border-r dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700`}
                      >
                        <td className="w-48 px-4 py-2 grid grid-cols-12 gap-3 items-center">
                          <Image
                            src={item?.main_image}
                            alt="img"
                            className="w-20 h-20 rounded-md object-cover col-span-6 border border-gray-300"
                            width={100}
                            height={0}
                          />
                          <span className="w-[200px] col-span-6 text-[14px] line-clamp-2 bg-primary-100 text-gray-900 font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 pr-5">
                            {item?.vietnam_name}
                          </span>
                        </td>
                        <td className="w-48 px-4 py-2">
                          <span className="text-[14px] line-clamp-2 bg-primary-100 text-gray-900 font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: HELPER.sanitizeContent(
                                  item?.vietnam_description
                                ),
                              }}
                            />
                          </span>
                        </td>
                        <td className="w-32 text-[14px] px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {HELPER.renderCategory(item?.category)}
                        </td>
                        <td className="w-28 text-[14px] px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {HELPER.formatVND(String(item?.price))}
                        </td>
                        <td className="w-28 text-[14px] px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div
                            className={`w-5 h-5 ${
                              item?.show_status === "show"
                                ? "bg-green-500"
                                : "bg-red-500"
                            } rounded-full ml-4`}
                          ></div>
                        </td>
                        <td className="w-24 text-[14px] px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <ModalUpdateProduct data={item} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <nav
                className="flex flex-col items-start justify-center mt-4 p-4 space-y-3 md:flex-row md:items-center md:space-y-0"
                aria-label="Table navigation"
              >
                <ul className="inline-flex items-stretch -space-x-px">
                  <li>
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="cursor-pointer flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </li>
                  {Array.from({ length: totalPage }, (_, i) => i + 1)?.map(
                    (item, index) => (
                      <li key={index} onClick={() => selectPage(item)}>
                        <a
                          href="#"
                          className={`${
                            item === currentPage
                              ? "bg-indigo-50 hover:bg-indigo-100 text-gray-700"
                              : "bg-white"
                          } flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700`}
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                  <li>
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPage}
                      className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
