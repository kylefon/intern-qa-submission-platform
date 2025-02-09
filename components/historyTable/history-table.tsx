import { createClient } from "@/utils/supabase/server";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function HistoryData({}) {
    const supabase = await createClient();

    const { data: historyData, error: historyDataError } = await supabase
    // const { data: ret, error } = await supabase
    .from("ticket_updates")
    .select('*, tickets(ticket_title, apps(app_name), app_versions(app_version)), users(email)');
    //     "id, created_at, status, updated_by, users(email), tickets(ticket_title),app: app_id (app_name), app_version: app_version_id (app_version)"   
    // );
  
 
    const flattenedData = historyData?.map((ticket) => ({
        ticket_title: ticket.tickets?.ticket_title || "N/A",
        app_name: ticket.tickets?.apps?.app_name || "N/A",
        app_version: ticket.tickets?.app_versions?.app_version || "N/A",
        status: ticket.status || "N/A",
        created_at: ticket.created_at || "No Date",
        updated_by: ticket.users?.email || "N/A",
    })) || [];


    console.log("flattenedData", flattenedData); // Verify that created_at is a Date object
    console.log("historyData:", historyData);


    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={flattenedData} />
        </div>
    );
}
