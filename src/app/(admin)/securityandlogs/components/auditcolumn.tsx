import { createColumnHelper } from "@tanstack/react-table";
import { audit } from "./audittable";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterFn } from "@tanstack/react-table";
const columnHelper = createColumnHelper<audit>();

const shortenId = (id: string) => {
  return `${id.slice(0, 6)}...${id.slice(-4)}`;
};
function shortenNotes(text: string | null | undefined, maxLength = 50) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "...." : text;
}
const exactMatchFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const cellValue = row.getValue(columnId);
  if (filterValue === "all") return true;
  return cellValue === filterValue;
};
export const columns = [
  // columnHelper.accessor("adminId", {
  //   cell: (info) => <p>{info.getValue()}</p>,
  //   header: () => "AdminId",
  // }),
  columnHelper.accessor("adminemail", {
    cell: (info) => (
      <p className="font-semibold text-blue-600">{info.getValue()}</p>
    ),
    header: () => "Admin",
  }),

  columnHelper.accessor("actiontargettype", {
    cell: (info) => (
      <p className="font-semibold text-gray-900">{info.getValue()}</p>
    ),
    header: () => "ActionTargetType",
  }),
  columnHelper.accessor("time", {
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {format(new Date(row.original.time), "PP . HH:mm")}
            </TooltipTrigger>
            <TooltipContent>
              {format(new Date(row.original.time), "PPPP .P")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    header: () => "Time",
  }),
  columnHelper.accessor("targetId", {
    cell: ({ row }) => {
      return (
        <span className="font-semibold">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{shortenId(row.original.targetId)}</span>
              </TooltipTrigger>
              <TooltipContent>{row.original.targetId}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      );
    },
    header: () => "User",
  }),
  columnHelper.accessor("actionType", {
    cell: ({ row }) => {
      const action = row.original.actionType;

      let icon = "";
      let label = "";
      let colorClass = "";

      switch (action) {
        case "LOCK_ACCOUNT":
          icon = "🔒";
          label = "Lock Account";
          colorClass = "text-yellow-700 font-semibold";
          break;
        case "UNLOCK_ACCOUNT":
          icon = "🔓";
          label = "Unlock Account";
          colorClass = "text-green-700 font-semibold";
          break;
        case "FORCE_LOGOUT":
          icon = "🚪";
          label = "Force Logout";
          colorClass = "text-orange-700 font-semibold";
          break;
        case "SEND_ALERT":
          icon = "📢";
          label = "Sent Alert";
          colorClass = "text-blue-700 font-semibold";
          break;
        case "WARN_USER":
          icon = "⚠️";
          label = "Warn User";
          colorClass = "text-red-600 font-semibold";
          break;
        case "SUSPEND_USER":
          icon = "⛔";
          label = "Suspend User";
          colorClass = "text-red-700 font-semibold";
          break;
        case "UPDATE_USER_STATUS":
          icon = "🛠️";
          label = "Update Status";
          colorClass = "text-gray-700 font-semibold";
          break;
        default:
          label = "action";
          colorClass = "text-gray-600";
      }
      return (
        <div className={`flex items-center gap-2 ${colorClass}`}>
          <span>{icon}</span>
          <span>{label}</span>
        </div>
      );
    },
    header: () => "ActionType",
    filterFn: exactMatchFilter,
  }),
  columnHelper.accessor("notes", {
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="truncate max-w-[200px] text-gray-700">
                {shortenNotes(row.original.notes)}
              </p>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm break-words text-sm">
              {row.original.notes}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },

    header: () => "Notes",
  }),
];
