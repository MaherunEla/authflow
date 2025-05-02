import { createColumnHelper } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type userlogin = {
  id: string;
  name: string;
  email: string;
  lastlogin: string;
  ipaddress: string;
  location: string;
  device: string;
};

const columnHelper = createColumnHelper<userlogin>();
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
  columnHelper.accessor("lastlogin", {
    cell: ({ row }) => {
      const date = new Date(row.original.lastlogin);
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
    header: () => "Last Login",
  }),
  columnHelper.accessor("ipaddress", {
    cell: (info) => (
      <p className="font-semibold text-gray-800">{info.getValue()}</p>
    ),
    header: () => "Ip Address",
  }),
  columnHelper.accessor("location", {
    cell: (info) => (
      <p className="font-semibold text-gray-800">{info.getValue()}</p>
    ),
    header: () => "Location",
  }),
  columnHelper.accessor("device", {
    cell: (info) => (
      <p className="font-semibold text-gray-800">{info.getValue()}</p>
    ),
    header: () => "Device",
  }),
];
