import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function AppTickets({appName, type, description}) {
    return (
        <Card className="flex-row w-[500px] justify-items-center">
            <CardHeader className="w-full">
                <div className="flex w-full justify-evenly items-center">
                    <CardTitle className="text-left w-11/12">{appName}</CardTitle>
                    <div className="h-4 w-1/12 bg-black text-s text-white px-7 py-3 rounded-xl flex justify-center items-center">{type}</div>
                </div>
            </CardHeader>
            <div className="px-6 w-full">{description}</div>
            <div className="w-full py-6 px-6">
                <Button className="w-full">View Tickets</Button>
            </div>
        </Card>
    )
}