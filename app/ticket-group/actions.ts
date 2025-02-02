"use server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const addTicketAction = async (formData: FormData) => {

    const currentUser = user;
    const ticketTitle = formData.get("ticketTitle")?.toString();
    const fixType = formData.get("fixType")?.toString();
    const description = formData.get("description")?.toString();
    const screenshot = formData.get("screenshot");
    const app_id = formData.get("appId");
    const app_version_id = formData.get("appVersionId");
    // format to db columns
    const ticketData = {
        ticket_title: ticketTitle,
        description: description,
        type_of_fix: fixType,
        screenshot: "Test",
        status: "NEW",
        submitted_by: "8b9613b7-4b7c-4a0d-9acf-8b4c6fed4293",
        app_id: app_id,
        app_version_id: app_version_id,
    }
    console.log(ticketData);

    const { data, error } = await supabase
        .from('tickets')
        .insert([
            ticketData,
        ])
        .select();
    console.log(currentUser);
    console.log(error);

};
