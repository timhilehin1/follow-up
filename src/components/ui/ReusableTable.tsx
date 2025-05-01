import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { IoIosArrowBack } from "react-icons/io";
import { GrFormNext } from "react-icons/gr";

type ReusableTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  searchTerm?: string;
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  onPaginationChange: (pageIndex: number, pageSize: number) => void;
};

function ReusableTable<TData>({
  data,
  columns,
  searchTerm = "",
  pageIndex,
  pageSize,
  totalRows,
  onPaginationChange,
}: ReusableTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: searchTerm,
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: () => {
      const newState = { pageIndex, pageSize };
      onPaginationChange(newState.pageIndex, newState.pageSize);
    },
    manualPagination: true,
    pageCount: Math.ceil(totalRows / pageSize),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // enables filtering
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  return (
    <div className="overflow-x-auto ">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mb-4">
        <thead className="bg-gray-50 dark:bg-gray-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={table.getAllColumns().length}
                className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                No results found.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id}
                className={
                  idx % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-50 dark:bg-gray-800"
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {table.getRowModel().rows.length !== 0 && (
        <div className="flex gap-4 items-center py-4">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 bg-[#0053A6] text-white  rounded disabled:opacity-50 cursor-pointer"
          >
            <IoIosArrowBack />
          </button>

          <span>
            Page {pageIndex + 1} of{" "}
            {Math.max(1, Math.ceil(totalRows / pageSize))}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 bg-[#0053A6] text-white rounded disabled:opacity-50 cursor-pointer"
          >
            <GrFormNext />
          </button>
        </div>
      )}
    </div>
  );
}

export default ReusableTable;
