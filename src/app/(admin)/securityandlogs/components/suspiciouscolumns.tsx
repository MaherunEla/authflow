import { createColumnHelper } from "@tanstack/react-table";
import { suspiciousUser } from "./suspicioustable";

const columnHelper = createColumnHelper<suspiciousUser>();

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
  columnHelper.accessor("activitytype", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Activity Type",
  }),
  columnHelper.accessor("time", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Time",
  }),
  columnHelper.accessor("ipaddress", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "IP Address",
  }),
  columnHelper.accessor("location", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Location",
  }),

  columnHelper.accessor("action", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => "Action Taken",
  }),
];
