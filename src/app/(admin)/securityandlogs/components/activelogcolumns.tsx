import { createColumnHelper } from "@tanstack/react-table";

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
  columnHelper.accessor("lastlogin", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Last Login",
  }),
  columnHelper.accessor("ipaddress", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Ip Address",
  }),
  columnHelper.accessor("location", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Location",
  }),
  columnHelper.accessor("device", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Device",
  }),
];
