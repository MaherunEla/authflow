import { createColumnHelper } from "@tanstack/react-table";
import { DropDownMenu } from "./drop-down-menu";
import { Role } from "@prisma/client";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
  twofactor: string;
};

const columnHelper = createColumnHelper<User>();

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
  columnHelper.accessor("twofactor", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Twofactor",
  }),
  columnHelper.display({
    id: "acions",
    header: "Actions",
    cell: ({ row }) => <DropDownMenu user={row.original} />,
  }),
];
