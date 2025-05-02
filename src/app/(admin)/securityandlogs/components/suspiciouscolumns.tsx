import { createColumnHelper } from "@tanstack/react-table";
import { suspiciousUser } from "./suspicioustable";
import { DropDownMenu } from "./dropdown";
import { formatDistanceToNow } from "date-fns";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const columnHelper = createColumnHelper<suspiciousUser>();
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
  columnHelper.accessor("type", {
    cell: ({ row, getValue }) => {
      const type = row.original.type as string;
      let typeClass = "";
      let icon = "";

      if (type === "NEW_DEVICE") {
        typeClass = "text-green-600 font-semibold  ";
        icon = "📱";
      } else if (type === "MULTIPLE_SESSION") {
        typeClass = "text-indigo-600";
        icon = "👥";
      } else if (type === "IP_OR_LOCATION_CHANGE") {
        typeClass = "text-orange-600 italic";
        icon = "📍";
      }
      return (
        <div className="flex items-center gap-2  bg-green-50 px-2 py-1 rounded-md">
          <span>{icon}</span>
          <span className={typeClass}>{getValue() as string}</span>
        </div>
      );
    },
    header: () => "Activity Type",
  }),
  columnHelper.accessor("createdAt", {
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
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
    header: () => "Time",
  }),
  columnHelper.accessor("ip", {
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

  columnHelper.accessor("actionTaken", {
    cell: ({ row, getValue }) => {
      const action = row.original.actionTaken;
      let actionClass = "";

      if (action === "Force Logout") {
        actionClass =
          "bg-yellow-100 text-yellow-800 font-semibold px-2 py-1 rounded-md";
      } else if (action === "Lock Account") {
        actionClass =
          "bg-red-100 text-red-800 font-semibold px-2 py-1 rounded-md";
      } else if (action === "Send Alert") {
        actionClass =
          "bg-blue-100 text-blue-800 font-semibold px-2 py-1 rounded-md";
      }

      return <span className={actionClass}>{getValue() as string}</span>;
    },
    header: () => "Action Taken",
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DropDownMenu user={row.original} />,
  }),
];
