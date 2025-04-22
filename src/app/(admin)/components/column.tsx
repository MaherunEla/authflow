import { createColumnHelper } from "@tanstack/react-table";
import { DropDownMenu } from "./drop-down-menu";
import { TableUser } from "../dashboard/page";
import { Badge } from "@/components/ui/badge";

const columnHelper = createColumnHelper<TableUser>();

export const columns = [
  columnHelper.accessor("id", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Id",
  }),
  columnHelper.accessor("name", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Name",
  }),
  columnHelper.accessor("email", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "email",
  }),
  columnHelper.accessor("role", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Role",
  }),
  columnHelper.accessor("status", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Status",
  }),
  columnHelper.accessor("twoFaEnabled", {
    cell: (info) => (
      <Badge variant={info.getValue() ? "default" : "outline"}>
        {info.getValue() ? "Enabled" : "Disabled"}
      </Badge>
    ),
    header: () => "TwoFaEnabled",
  }),
  columnHelper.display({
    id: "acions",
    header: "Actions",
    cell: ({ row }) => <DropDownMenu user={row.original} />,
  }),
];
