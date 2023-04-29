import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';

export const Pagination = ({ totalPages, onClickHandler, pageState, activePage }) => {
  const [TotalPagesArr, setTotalPagesArr] = useState([]);

  useEffect(() => {
    let tempArr = [];
    for (let i = 1; i <= totalPages; i++) {
      tempArr.push(i);
    }
    setTotalPagesArr(tempArr);
  }, [totalPages]);

  if (totalPages === 1) return null;

  return (
    <div className="flex justify-end items-center m-2 gap-2">
      {TotalPagesArr?.map((pageNo) => (
        <button
          key={pageNo}
          onClick={() => onClickHandler(pageNo)}
          type="button"
          className={`${
            pageNo === activePage ? "bg-gray-300" : ""
          } px-3 py-1.5 rounded text-neutral-700 hover:bg-neutral-300 transition-all ease-in`}
        >
          {pageNo}
        </button>
      ))}
    </div>
  );
};
