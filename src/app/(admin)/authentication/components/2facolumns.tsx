import { createColumnHelper } from "@tanstack/react-table";

import { twofatable } from "./2fatable";

const columnHelper = createColumnHelper<twofatable>();

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
  columnHelper.accessor("twofaenabled", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "2FA Enabled",
  }),
  columnHelper.accessor("lastupdated", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Last Updated",
  }),

  columnHelper.accessor("actions", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Actions",
  }),
];
