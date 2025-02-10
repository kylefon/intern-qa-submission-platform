"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { InternTicketForm } from "@/components/intern-ticket-form";
import TicketGroupForm from "@/components/ticket-group-form";
import TableData from "@/components/tableData/history-data";
import { Separator } from "./ui/separator";
import { getVersionLink } from "@/utils/actions";

export function CurrentApp({ appName, initialData }) {
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [currentVersionLink, setCurrentVersionLink] = useState(null);

    useEffect(() => {
        const fetchCurrentVersionLink = async () => {
            const { data: versionLink, error } = await getVersionLink(selectedVersion);
            setCurrentVersionLink(versionLink);
        }
        fetchCurrentVersionLink();

    }, [currentVersionLink])

    const { user, role, appData, appVersions, ticketData } = initialData;
    
    return (
        <div>
            <div className="flex flex-col w-full space-y-2 items-start">
                <h1 className="text-4xl font-extrabold">{appData?.[0]?.app_name}</h1>
                <div className="flex flex-col gap-2 justify-between w-full sm:flex-row sm:items-end">
                    <div className="w-full sm:w-[40%]">
                        <h1>Place link here: {currentVersionLink}</h1>
                        <Select onValueChange={setSelectedVersion}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a version..." />
                            </SelectTrigger>
                            <SelectContent>
                                {appVersions?.length > 1 ? (
                                    appVersions?.map((data) => (
                                        <SelectItem
                                            key={data.id}
                                            value={data.id.toString()}
                                        >
                                            {data.app_version}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="N/A">No Versions Found...</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2">
                        {role === "admin" && <TicketGroupForm initialData={appData} />}
                        <InternTicketForm appVersion={selectedVersion} appName={appName} />
                    </div>
                </div>
            </div>
            <Separator />
            <TableData appName={appName} role={role} selectedVersion={selectedVersion}/>
        </div>
    );
}
