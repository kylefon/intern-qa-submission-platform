"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { useMemo } from "react";


export type HistoryData = {
  created_at: string;
  status: string;
  app_name: string;
  app_version: string;
  ticket_title: string;
  updated_by: string;
};

export const columns: ColumnDef<HistoryData>[] = [
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const rawDate = row.getValue("created_at");
      let formattedDate = "N/A";

      if (rawDate) {
        try {
          const dateObj = rawDate instanceof Date ? rawDate : parseISO(rawDate);
          if (!isNaN(dateObj.getTime())) {
            formattedDate = format(dateObj, "PPpp");
          }
        } catch (error) {
          console.error("Invalid date format:", rawDate);
        }
      }

      return formattedDate;
    },
    meta: { width: 200 }
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: { width: 100 }
  },

  {
    accessorKey: "app_name",
    header: "Application",
    meta: { width: 120 }
  },
  {
    accessorKey: "app_version",
    header: "App Version",
    meta: { width: 100 }
  },

  {
    accessorKey: "ticket_title",
    header: "Ticket Title",
    meta: { width: 100 }
  },

  {
    accessorKey: "updated_by",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Updated By
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    meta: { width: 120 }
  },
];
