import { createColumnHelper } from "@tanstack/react-table";
import { Check, X } from "lucide-react";

import { twofatable } from "./2fatable";

const columnHelper = createColumnHelper<twofatable>();
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import axios from "axios";

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
  columnHelper.accessor("twoFaEnabled", {
    cell: (info) => {
      const enabled = info.getValue();
      return (
        <span
          className={`px-2 py-1 rounded text-xs flex items-center gap-2 font-semibold `}
        >
          {enabled ? (
            <>
              <Check className="text-green-600 h-4 w-4" />
              <span>Yes</span>
            </>
          ) : (
            <>
              <X className="text-red-600 h-4 w-4" />
              <span>No</span>
            </>
          )}
        </span>
      );
    },
    header: () => "2FA Enabled",
  }),
  columnHelper.display({
    id: "acions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      const id = user.id;
      const handleAction = async () => {
        try {
          const res = await axios.post("/api/enable-2fa/reset", {
            data: {
              id,
              actionTargetType: "AUTHENTICATION",
              notes: "2FA reset by admin due to user access loss.",
            },
          });
          console.log(res);
        } catch (error) {
          console.error("Failed to resend setup email", error);
        }
      };

      if (user.twoFaEnabled) {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => handleAction()}>
                Resend
              </Button>
            </TooltipTrigger>

            <TooltipContent>
              <p>Allow user to reconfigure their authenticator app</p>
            </TooltipContent>
          </Tooltip>
        );
      } else {
        return <p></p>;
      }
    },
  }),
];
