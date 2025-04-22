import { createColumnHelper } from "@tanstack/react-table";
import { userfaillogin } from "./failedlogintable";
import { DropDownMenu } from "./dropdownmenu";

const columnHelper = createColumnHelper<userfaillogin>();

export const columns = [
  // columnHelper.accessor("id", {
  //   cell: (info) => <p>{info.getValue()}</p>,
  //   header: () => "Id",
  // }),

  columnHelper.accessor("email", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "email",
  }),
  columnHelper.accessor("name", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Name",
  }),
  columnHelper.accessor("attempts", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Attempts",
  }),
  columnHelper.accessor("status", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Status",
  }),
  columnHelper.accessor("lastattempt", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Last Attempt",
  }),
  columnHelper.accessor("ipaddress", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "IP Address",
  }),
  columnHelper.accessor("location", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Location",
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DropDownMenu User={row.original} />,
  }),
];
