import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getFilteredRowModel,
  RowSelectionState,
} from "@tanstack/react-table";
import { IoIosArrowBack } from "react-icons/io";
import { GrFormNext } from "react-icons/gr";
import { useEffect, useState } from "react";

type ReusableTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  searchTerm?: string;
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  onPaginationChange: (pageIndex: number, pageSize: number) => void;
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  rowSelectionState?: RowSelectionState;
  onRowSelectionStateChange?: (state: RowSelectionState) => void;
};

function ReusableTable<TData>({
  data,
  columns,
  searchTerm = "",
  pageIndex,
  pageSize,
  totalRows,
  onPaginationChange,
  enableRowSelection = false,
  onRowSelectionChange,
  rowSelectionState = {},
  onRowSelectionStateChange,
}: ReusableTableProps<TData>) {
  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({});
  // Use external state if provided, otherwise use internal state
  const currentRowSelection = onRowSelectionStateChange
    ? rowSelectionState
    : internalRowSelection;

  const handleRowSelectionChange = (updater: any) => {
    const newState =
      typeof updater === "function" ? updater(currentRowSelection) : updater;

    if (onRowSelectionStateChange) {
      onRowSelectionStateChange(newState);
    } else {
      setInternalRowSelection(newState);
    }
  };

  // Enhanced columns with checkbox column if row selection is enabled
  const enhancedColumns = enableRowSelection
    ? [
        {
          id: "select",
          header: ({ table }: any) => (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={table.getIsAllRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
                className="w-4 h-4 text-[#0053A6] bg-gray-100 border-gray-300  focus:ring-[#0053A6] dark:focus:ring-[#0053A6] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 rounded-md"
              />
            </div>
          ),
          cell: ({ row }: any) => (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
                className="w-4 h-4 text-[#0053A6] bg-gray-100 border-gray-300  focus:ring-[#0053A6] dark:focus:ring-[#0053A6] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 rounded-md"
              />
            </div>
          ),
          enableSorting: false,
          enableHiding: false,
          size: 40, // Fixed width for checkbox column
        } as ColumnDef<TData, any>,
        ...columns,
      ]
    : columns;
  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: {
      globalFilter: searchTerm,
      pagination: { pageIndex, pageSize },
      ...(enableRowSelection && { rowSelection: currentRowSelection }),
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      onPaginationChange(newState.pageIndex, newState.pageSize);
    },
    ...(enableRowSelection && {
      onRowSelectionChange: handleRowSelectionChange,
      enableRowSelection: true,
    }),
    manualPagination: true,
    pageCount: Math.ceil(totalRows / pageSize),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // enables filtering
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  // Notify parent component of selected rows when selection changes
  useEffect(() => {
    if (enableRowSelection && onRowSelectionChange) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      onRowSelectionChange(selectedRows);
    }
  }, [currentRowSelection, enableRowSelection, onRowSelectionChange, table]);

  // const selectedCount = Object.keys(currentRowSelection).length;

  return (
    <div>
      {/* Selection Info */}
      {/* {enableRowSelection && selectedCount > 0 && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {selectedCount} row{selectedCount !== 1 ? "s" : ""} selected
          </p>
        </div>
      )} */}
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
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 capitalize"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
