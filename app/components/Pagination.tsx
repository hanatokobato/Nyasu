import React from 'react';
import ReactPaginate from 'react-paginate';

interface IProps {
  pageCount: number
  onPageChange?: (selectedItem: { selected: number }) => void;
}

const Pagination = ({ pageCount, onPageChange }: IProps) => {
  return (
    <ReactPaginate
      nextLabel="next >"
      onPageChange={onPageChange}
      pageRangeDisplayed={3}
      marginPagesDisplayed={2}
      pageCount={pageCount}
      previousLabel="< previous"
      containerClassName="flex"
      pageLinkClassName="relative block rounded bg-transparent px-3 py-1.5 text-sm text-gray-600 transition-all duration-300 hover:bg-gray-100  dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
      previousClassName="relative block rounded bg-transparent px-3 py-1.5 text-sm text-gray-600 transition-all duration-300 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
      nextClassName="relative block rounded bg-transparent px-3 py-1.5 text-sm text-gray-600 transition-all duration-300 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
      activeLinkClassName="relative block rounded bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 transition-all duration-300"
      disabledClassName="pointer-events-none relative block rounded bg-transparent px-3 py-1.5 text-sm text-gray-500 transition-all duration-300 dark:text-gray-400"
      breakLabel="..."
      renderOnZeroPageCount={null}
    />
  );
};

export default Pagination;
