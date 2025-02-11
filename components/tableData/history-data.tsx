"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { getAppTickets } from "@/utils/actions";
import { Loader2, Loader2Icon } from "lucide-react";


export default function TableData({ appName, role, selectedVersion, isLoading }) {
    const [ticketData, setTicketData] = useState([]);
    useEffect(() => {
        const fetchTickets = async () => {
            const {data: tickets, error: ticketsError, versionLink: versionLink} = await getAppTickets(appName, selectedVersion);
            setTicketData(tickets);
        }
        fetchTickets();
    }, [selectedVersion]);

    const flattenedData = ticketData?.map((ticket) => ({
        id: ticket.id,
        ticket_title: ticket.ticket_title,
        app_name: ticket.apps?.app_name || "N/A",
        app_version: ticket.app_versions?.app_version || "N/A",
        status: ticket.status || "N/A",
        type_of_fix: ticket.type_of_fix || "N/A",
        description: ticket.description || "No description",
        created_at: ticket.created_at,
        updated_by: ticket.users?.email || "N/A",
        submitted_by: ticket.submitted_by,
        screenshot: ticket.screenshot
    })) || [];
    

    return (
        <div className="container px-0 py-0">
            {isLoading ? (
                <div className="flex w-full items-center justify-center">
                    <Loader2 className="animate-spin"/>
                    <h2>Loading tickets...</h2>
                </div>
            ) : (
                <DataTable columns={columns} data={flattenedData} role={role}/>
            )}
        </div>
    );
}
