"use client";

import { useState } from "react";
import { columns } from "@/app/(admin)/components/column";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  getFacetedRowModel,
  getFacetedUniqueValues,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export type Role = "ADMIN" | "USER" | "GUEST";
type TableUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
  twofactor: string;
};

const UserTable = ({ data }: { data: TableUser[] }) => {
  const [filter, setFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // const columns = useMemo<ColumnDef<User>[]>(
  //   () => [
  //     {
  //       header: "Id",
  //       accessorKey: "id",
  //     },
  //     {
  //       header: "Name",
  //       accessorKey: "name",
  //     },
  //     {
  //       header: "Email",
  //       accessorKey: "email",
  //     },
  //     {
  //       header: "Role",
  //       accessorKey: "role",
  //     },
  //     {
  //       header: "Status",
  //       accessorKey: "status",
  //     },
  //     {
  //       header: "TwoFactor",
  //       accessorKey: "twofactor",
  //     },
  //     {
  //       header:"Action",
  //       accessorKey:""
  //     }
  //   ],
  //   []
  // );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: filter,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 2,
      },
    },
  });

  return (
    <div className="space-y-4 px-5 ">
      <div className="flex  items-start gap-4">
        <Input
          placeholder="Search user..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select
          onValueChange={(value) =>
            table
              .getColumn("role")
              ?.setFilterValue(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger>Filter By Role</SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="Guest">Guest</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) =>
            table
              .getColumn("status")
              ?.setFilterValue(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger>Filter By Status</SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspend">Suspend</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <button
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {" "}
              <PaginationPrevious href="#" />
            </button>
          </PaginationItem>
          <PaginationItem>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <PaginationLink href="#">1</PaginationLink>
            </button>
          </PaginationItem>
          <PaginationItem>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <PaginationLink href="#">2</PaginationLink>
            </button>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <button
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              <PaginationNext href="#" />
            </button>
          </PaginationItem>

          <PaginationItem>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Page Size" />
              </SelectTrigger>
              <SelectContent>
                {[2, 5, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={String(pageSize)}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {/* <Button
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {"<<"}
      </Button>
      <Button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {"<"}
      </Button>
      <Button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {">"}
      </Button>
      <Button
        onClick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
      >
        {">>"}
      </Button>*/}
    </div>
  );
};

export default UserTable;
