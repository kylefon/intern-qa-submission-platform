import { createClient } from "@/utils/supabase/server";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function TableData({ app_id, role }) {
    console.log(role);
    const supabase = await createClient();

    const { data: ticketData } = await supabase
        .from("tickets")
        .select(
            "ticket_title, created_at, status, type_of_fix, description, apps(app_name), app_versions(app_version), submitted_by(id), screenshot")
        .eq("app_id", app_id);
    
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
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={flattenedData} role={role}/>
        </div>
    );
}
