"use server";
import { createClient } from "@/utils/supabase/server";

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