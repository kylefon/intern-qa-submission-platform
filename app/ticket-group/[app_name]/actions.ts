"use server";
import { createClient } from "@/utils/supabase/server";
import { randomUUID, UUID } from "crypto";

export async function addTicketToServer(submittedForm: FormData, appName: string, appVersion: string) {
    const { user, userError } = await validateUserSignIn();
    const supabase = await createClient();

    // Translate auth ID to users table ID.
    const { data: translatedId, error } = await supabase
        .from('users')
        .select('id')
        .eq("auth_id", user?.id);

    // Translate app name to app ID.
    const { data: translatedAppName, translatedAppNameError } = await supabase
        .from('apps')
        .select('id')
        .ilike("app_name", appName);

    // Translate app version to app version ID
    const { data: translatedAppVersion, translatedAppVersionError } = await supabase
        .from('app_versions')
        .select('id')
        .eq("app_id", translatedAppName?.[0]?.id)
        .eq("app_version", appVersion);

    // Upload screenshot to image bucket.
    const uuid = randomUUID(); // Use this uuid for the ticket for easier image tracking.
    const imageFile = submittedForm.get("screenshot");
    const fileExtension = imageFile?.type.toString().split('/').pop();
    const fileName = uuid + '.' + fileExtension;
    const { data: uploadTicketScreenshot, error: uploadTicketScreenshotError } = await supabase
        .storage.from('ticket_images').upload(fileName.toString(), imageFile);

    // Get screenshot link.
    const { data: imageLink } = await supabase
        .storage
        .from('ticket_images')
        .getPublicUrl(`${fileName}`);

    // Upload to tickets table.
    const { data: insertedData, error: insertedDataError } = await supabase
        .from('tickets')
        .insert([
            {
                // created_at: new Date().toISOString(),
                id: uuid.toString(),
                ticket_title: submittedForm.get("ticket_name")?.toString(),
                type_of_fix: submittedForm.get("type_of_fix")?.toString(),
                description: submittedForm.get("description")?.toString(),
                screenshot: imageLink?.publicUrl.toString(),
                status: "NEW",
                // Other metadata.
                app_id: translatedAppName?.[0]?.id.toString(),
                app_version_id: translatedAppVersion?.[0]?.id.toString(),
                submitted_by: translatedId?.[0]?.id.toString(),
                updated_at: new Date().toISOString()
            }
        ])
        .select();
}

export async function validateUserSignIn() {
    const supabase = await createClient();
    const {data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return {user: undefined, userError: "Not logged in."}
    }
    return {user: user, userError: null}
}

export async function getUserRole(email: string | undefined) {
    const supabase = await createClient();
    const { data: userRole, error } = await supabase
        .from("users")
        .select("role")
        .eq("email", email)
        .single();
    if (error) {
        return {userRole: null, userRoleError: error}
    }
    return {userRole: userRole, userRoleError: error}
} 

export async function getAppTickets(appName: string) {
    const sb = await createClient();
    const {data: appId, error: appIdError} = await sb
        .from("apps")
        .select("id")
        .ilike("app_name", appName)
        .single();

    const { data: tickets, error: ticketError } = await sb
        .from("tickets").select(`
        id,
        created_at,
        ticket_title,
        description,
        type_of_fix,
        screenshot,
        status,
        submitted_by: submitted_by (id),
        app: app_id (app_name),
        app_version: app_version_id (app_version)
        `)
        .eq("app_id", appId?.id);
    return {data: tickets, error: ticketError}
} 

export async function getAppData(appName: string) {
    const supabase = await createClient();
    const { data: appData, error: appError } = await supabase
        .from("apps")
        .select()
        .ilike("app_name", appName);
    return {data: appData, error: appError}
}

export async function getAppVersions(appId: string) {
    const supabase = await createClient();    
    const { data: appVersions, error: appVersionsError } = await supabase
        .from("app_versions")
        .select("*")
        .eq("app_id", appId);
    return {data: appVersions, error: appVersionsError}
}