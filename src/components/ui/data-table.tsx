"use client";
import { useState } from "react";
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Download,
} from "lucide-react";
import { Button, EmptyState, Menu } from "./primitives";
import { downloadText } from "@/lib/utils";
export function DataTable<T>({
  data,
  columns,
  selectable = false,
  bulkAction,
  filename = "dentix-export",
  pageSize = 8,
}: {
  data: T[];
  columns: ColumnDef<T>[];
  selectable?: boolean;
  bulkAction?: (rows: T[]) => void;
  filename?: string;
  pageSize?: number;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [visibility, setVisibility] = useState<VisibilityState>({});
  const [selection, setSelection] = useState({});
  const cols: ColumnDef<T>[] = selectable
    ? [
        {
          id: "select",
          header: ({ table }) => (
            <input
              type="checkbox"
              aria-label="Select page"
              checked={table.getIsAllPageRowsSelected()}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
            />
          ),
          cell: ({ row }) => (
            <input
              type="checkbox"
              aria-label="Select row"
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          ),
          enableSorting: false,
          enableHiding: false,
        },
        ...columns,
      ]
    : columns;
  // TanStack Table intentionally returns mutable APIs; keep this component outside memoization.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: cols,
    state: { sorting, columnVisibility: visibility, rowSelection: selection },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setVisibility,
    onRowSelectionChange: setSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });
  return (
    <div className="data-table">
      <div className="table-utility">
        <span>
          {Object.keys(selection).length
            ? `${table.getSelectedRowModel().rows.length} selected`
            : `${data.length} records`}
        </span>
        <div>
          {table.getSelectedRowModel().rows.length > 0 && bulkAction && (
            <Button
              onClick={() => {
                bulkAction(
                  table.getSelectedRowModel().rows.map((r) => r.original),
                );
                setSelection({});
              }}
            >
              Archive selected
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => {
              const heads = table
                .getVisibleLeafColumns()
                .filter((c) => c.id !== "select" && c.id !== "actions");
              const escape = (v: unknown) =>
                '"' + String(v ?? "").replaceAll('"', '""') + '"';
              downloadText(
                `${filename}.csv`,
                [
                  heads.map((c) => escape(c.id)).join(","),
                  ...table
                    .getSortedRowModel()
                    .rows.map((r) =>
                      heads.map((c) => escape(r.getValue(c.id))).join(","),
                    ),
                ].join("\n"),
                "text/csv",
              );
            }}
          >
            <Download size={14} /> Export
          </Button>
          <Menu
            label="Column visibility"
            items={table
              .getAllLeafColumns()
              .filter((c) => c.getCanHide())
              .map((c) => ({
                label: `${c.getIsVisible() ? "✓ " : ""}${c.id}`,
                onClick: () => c.toggleVisibility(),
              }))}
          >
            <Columns3 size={16} />
          </Menu>
        </div>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            {table.getHeaderGroups().map((h) => (
              <tr key={h.id}>
                {h.headers.map((c) => (
                  <th key={c.id}>
                    {c.isPlaceholder ? null : c.column.getCanSort() ? (
                      <button
                        className="sort-button"
                        onClick={c.column.getToggleSortingHandler()}
                      >
                        {flexRender(c.column.columnDef.header, c.getContext())}
                        <ArrowUpDown size={12} />
                      </button>
                    ) : (
                      flexRender(c.column.columnDef.header, c.getContext())
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((r) => (
              <tr key={r.id} className={r.getIsSelected() ? "selected" : ""}>
                {r.getVisibleCells().map((c) => (
                  <td key={c.id}>
                    {flexRender(c.column.columnDef.cell, c.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && <EmptyState />}
      </div>
      <div className="pagination">
        <span>
          {data.length
            ? `${table.getState().pagination.pageIndex * pageSize + 1}–${Math.min((table.getState().pagination.pageIndex + 1) * pageSize, data.length)} of ${data.length} records`
            : "0 records"}
        </span>
        <div>
          <Button
            aria-label="Previous page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft size={15} />
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.max(1, table.getPageCount())}
          </span>
          <Button
            aria-label="Next page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}
