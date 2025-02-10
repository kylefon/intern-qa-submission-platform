"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { getAppTickets } from "@/utils/actions";


export default function TableData({ appName, role, selectedVersion }) {
    const [ticketData, setTicketData] = useState([]);
    const [versionLink, setVersionLink] = useState("");
    useEffect(() => {
        const fetchTickets = async () => {
            const {data: tickets, error: ticketsError, versionLink: versionLink} = await getAppTickets(appName, selectedVersion);
            setVersionLink(versionLink);
            setTicketData(tickets);
        }
        fetchTickets();
    }, [selectedVersion]);

    const flattenedData = ticketData?.map((ticket) => ({
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
            <DataTable columns={columns} data={flattenedData} role={role}/>
        </div>
    );
}
