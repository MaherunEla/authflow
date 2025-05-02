import { createColumnHelper } from "@tanstack/react-table";
import { userfaillogin } from "./failedlogintable";
import { DropDownMenu } from "./dropdownmenu";

import { formatDistanceToNow } from "date-fns";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const columnHelper = createColumnHelper<userfaillogin>();
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
    header: () => "Email",
  }),
  columnHelper.accessor("attempts", {
    cell: (info) => (
      <p className="font-semibold text-gray-800">{info.getValue()}</p>
    ),
    header: () => "Attempts",
  }),
  columnHelper.accessor("status", {
    cell: ({ row }) => {
      const status = row.original.status;
      let badgeColor = "";
      let icon = null;

      if (status === "Normal") {
        badgeColor = "bg-green-100 text-green-800";
        icon = "✅";
      } else if (status === "Locked") {
        badgeColor = "bg-red-100 text-red-800";
        icon = "🔒";
      } else if (status === "Suspicious") {
        badgeColor = "bg-yellow-100 text-yellow-800";
        icon = "⚠️";
      }

      return (
        <span
          className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm font-semibold ${badgeColor}`}
        >
          <span>{icon}</span>
          <span>{status}</span>
        </span>
      );
    },
    header: () => "Status",
  }),
  columnHelper.accessor("lastattempt", {
    cell: ({ row }) => {
      const date = new Date(row.original.lastattempt);
      const timeAgo = formatDistanceToNow(date, { addSuffix: true });

      const isRecent = new Date().getTime() - date.getTime() < 60 * 60 * 1000;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={
                  isRecent ? "text-green-600 font-semibold" : "text-gray-600"
                }
              >
                {timeAgo}
              </span>
            </TooltipTrigger>
            <TooltipContent>{format(date, "PPpp")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    header: () => "Last Attempt",
  }),
  columnHelper.accessor("ipaddress", {
    cell: (info) => (
      <p className="font-semibold text-gray-800">{info.getValue()}</p>
    ),
    header: () => "IP Address",
  }),
  columnHelper.accessor("location", {
    cell: (info) => (
      <p className="font-semibold text-gray-800">{info.getValue()}</p>
    ),
    header: () => "Location",
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DropDownMenu user={row.original} />,
  }),
];
