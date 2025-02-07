import { createClient } from "@/utils/supabase/server";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function TableData({ app_id }) {
    const supabase = await createClient();

    const { data: ticketData } = await supabase
        .from("tickets")
        .select("ticket_title, created_at, status, type_of_fix, description, apps(app_name), app_versions(app_version), users(email)")
        .eq("app_id", app_id);

    const flattenedData = ticketData?.map((ticket) => ({
        ticket_title: ticket.ticket_title,
        app_name: ticket.apps?.app_name || "N/A",
        app_version: ticket.app_versions?.app_version || "N/A",
        status: ticket.status || "N/A",
        type_of_fix: ticket.type_of_fix || "N/A",
        description: ticket.description || "No description",
        created_at: ticket.created_at ? new Date(ticket.created_at) : new Date(), // Pass as Date object
        updated_by: ticket.users?.email || "N/A",
    })) || [];

    console.log(flattenedData); // Verify that created_at is a Date object
    console.log(ticketData);



    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={flattenedData} />
        </div>
    );
}
