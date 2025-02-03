import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { slugify } from "@/utils/slugify";

export function AppTickets({appName, type, description}) {
    return (
        <Card className="flex-row w-full justify-items-center">
            <CardHeader className="w-full">
                <div className="flex w-full justify-evenly items-center">
                    <CardTitle className="text-left w-11/12">{appName}</CardTitle>
                    <div className="h-4 w-1/12 bg-black text-s text-white px-7 py-3 rounded-xl flex justify-center items-center">{type}</div>
                </div>
            </CardHeader>
            <div className="px-6 w-full">{description}</div>
            <div className="w-full py-6 px-6">
                <Link target="_blank" href={`/ticket-group/${encodeURIComponent(slugify(appName))}`}>
                    <Button className="w-full">View Tickets</Button>
                </Link>
            </div>
        </Card>
    )
}