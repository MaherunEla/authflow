import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { newuser } from "./newusertable";
import { Badge } from "@/components/ui/badge";
const columnHelper = createColumnHelper<newuser>();

const shortenId = (id: string) => {
  return `${id.slice(0, 6)}...${id.slice(-4)}`;
};

export const columns = [
  columnHelper.accessor("id", {
    cell: ({ row }) => {
      return (
        <span className="font-semibold">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{shortenId(row.original.id)}</span>
              </TooltipTrigger>
              <TooltipContent>{row.original.id}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      );
    },
    header: () => "Id",
  }),
  columnHelper.accessor("name", {
    cell: (info) => (
      <p className="font-semibold text-gray-800">{info.getValue()}</p>
    ),
    header: () => "Name",
  }),
  columnHelper.accessor("email", {
    cell: (info) => (
      <p className="font-semibold text-blue-600">{info.getValue()}</p>
    ),
    header: () => "email",
  }),
  columnHelper.accessor("role", {
    cell: (info) => (
      <p className="font-semibold text-gray-800">{info.getValue()}</p>
    ),
    header: () => "Role",
  }),
  columnHelper.accessor("status", {
    cell: ({ row }) => {
      const status = row.original.status;

      let colorClass = "";
      let label = status;
      switch (status) {
        case "ACTIVE":
          colorClass = "bg-green-100 text-green-800 ";
          label = "Active";
          break;
        case "WARBED":
          colorClass = "bg-yellow-100 text-yellow-800 ";
          label = "Warned";
          break;
        case "SUSPENDED":
          colorClass = "bg-orange-100 text-orange-800 ";
          label = "Suspended";
          break;
        case "LOCKED":
          colorClass = "bg-red-100 text-red-800 ";
          label = "Suspended";
          break;
      }

      return (
        <Badge className={`px-2 py-1 rounded-md font-medium ${colorClass}`}>
          {label}
        </Badge>
      );
    },
    header: () => "Status",
  }),

  columnHelper.accessor("createdAt", {
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {format(new Date(row.original.createdAt), "PP . HH:mm")}
            </TooltipTrigger>
            <TooltipContent>
              {format(new Date(row.original.createdAt), "PPPP .P")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    header: () => "CreatedAt",
  }),
];
