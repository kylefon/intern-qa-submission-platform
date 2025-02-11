"use server";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";

export async function getVersionLink(version: string) {
    const supabase = await createClient();
    const { data: versionLink, error } = await supabase
        .from('app_versions')
        .select("link")
        .eq("id", version)
        .single();
    return versionLink;
}

export async function addNewVersion(appName: string, newVersion: string, newVersionLink: string) {
    const sb = await createClient();
    // Need: app_id, app_version, link, 
    const {data: appId, appIdError} = await sb
        .from("apps")
        .select("id")
        .ilike("app_name", appName)
        .single();

    console.log(appId?.id, newVersion, newVersionLink);

    const {insertedVersion, insertedVersionError} = await sb
        .from("app_versions")
        .insert([{
            app_id: appId?.id,
            app_version: newVersion,
            link: newVersionLink
        }])
        .select();

    if (insertedVersionError) {
        return {data: null, error: insertedVersionError}
    }

    console.log(appId, appIdError, insertedVersion, insertedVersionError);
    return {data: insertedVersion, error: null}
}

export async function fetchAppData(appName: string) {
    const { user, userError } = await validateUserSignIn();
    const getUserRoleResult = await getUserRole(user?.email);
    const { userRole, userRoleError } = getUserRoleResult;
    const { data: appData, error: appError } = await getAppData(appName);
    const { data: appVersions, error: appVersionsError } = await getAppVersions(appData?.[0]?.id);
    return {
        user,
        role: userRole?.role,
        appData,
        appVersions
    };
}

export async function addTicketToServer(submittedForm: FormData, appName: string, appVersion: string) {
    const { user, userError } = await validateUserSignIn();
    const supabase = await createClient();

    console.log(appName, appVersion);

    // Translate auth ID to users table ID.
    const { data: translatedId, translatedIdError } = await supabase
        .from('users')
        .select('id')
        .eq("auth_id", user?.id);

    // Translate app name to app ID.
    const { data: translatedAppName, translatedAppNameError } = await supabase
        .from('apps')
        .select('id')
        .ilike("app_name", appName)
        .single();

    console.log(translatedAppName, translatedAppNameError);

    // Translate app version to app version ID
    const { data: translatedAppVersion, translatedAppVersionError } = await supabase
        .from('app_versions')
        .select('id')
        .eq("app_id", translatedAppName?.id)
        .eq("id", appVersion)
        .single();

    console.log(translatedAppVersion, translatedAppVersionError);

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
                app_id: translatedAppName?.id.toString(),
                app_version_id: translatedAppVersion?.id.toString(),
                submitted_by: translatedId?.[0]?.id.toString(),
                updated_at: new Date().toISOString()
            }
        ])
        .select();
    console.log(insertedData, insertedDataError);
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

export async function getAppTicketsUsingId(appId: string) {
    const supabase = await createClient();

    const { data: ticketData, error: ticketDataError } = await supabase
        .from("tickets")
        .select(
            "ticket_title, created_at, status, type_of_fix, description, apps(app_name), app_versions(app_version), submitted_by(id), screenshot")
        .eq("app_id", appId);
    return ticketData;
}

export async function getAppTickets(appName: string, appVersion: string) {
    const sb = await createClient();
    const {data: appId, error: appIdError} = await sb
        .from("apps")
        .select("id")
        .ilike("app_name", appName)
        .single();

    console.log(`[appName]: ${appName}`);
    console.log(`[appVersion]: ${appVersion}`);

    const {data: appVersionId, error: appVersionIdError} = await sb
        .from("app_versions")
        .select("id, app_version, link")
        .eq("id", appVersion)
        .single();

    console.log(`[appVersionId]: ${JSON.stringify(appVersionId)}`);

    const { data: tickets, error: ticketError } = await sb
        .from("tickets").select(`
        id,
        created_at,
        ticket_title,
        description,
        type_of_fix,
        screenshot,
        status,
        remarks,
        submitted_by: submitted_by (id),
        app: app_id (app_name),
        app_version: app_version_id (app_version)
        `)
        .eq("app_id", appId?.id)
        .eq("app_version_id", appVersion);

    return {data: tickets, error: ticketError, versionLink: appVersionId?.link}
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

export async function getUserDataById(userId: string) {
    const supabase = await createClient();
    const { data: userData, error: userDataError } = await supabase
        .from("users")
        .select()
        .eq("id", userId)
        .single();
    return { data: userData, error: userDataError };
}

export async function updateTicketCard(status: string, remarks: string, id: string) {
    const supabase = await createClient();
    
    console.log("[status]: ", status);
    console.log("[remarks]: ", remarks);
    console.log("[id]: ", id);


    const { data: appUpdate, error: appError } = await supabase
        .from("tickets")
        .update({
            status: status,
            remarks: remarks || null
        })
        .eq("id", id)
        .select()
    
    if (appError) {
        console.error("Error updating ticket:", appError);
    } else {
        console.log("Ticket updated successfully:");
    }

    return { data: appUpdate, error: appError };
}

export async function addTicketUpdate(id: string, status: string, remarks: string, user_id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("ticket_updates")
        .insert({
            ticket_id: id,
            updated_by: user_id,
            status: status,
            notes: remarks,
        })
    if (error) {
        console.log("Error adding ticket update", error)
    } else {
        console.log("Successfully added to ticket update", data);
    }

    return { data, error }
}

export async function getIdFromAuthId() {
    const supabase = await createClient();
    const {data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user?.id)
        
    return { data, error };
}

export async function addTicketGroup(data) {
    const supabase = await createClient();

    const { data: userData, error: userError } = await getIdFromAuthId();

    const { data: appGroupData , error: appGroupError } = await supabase
        .from("apps")   
        .insert({
            app_name: data.app_name,
            type: data.type,
            link: data.link,
            created_by: userData?.[0]?.id,
            description: data.description
        })

        if (appGroupData) {
            console.log("SUCCESSFULLY ADDED GROUP", appGroupData);
        }

        if (appGroupError) {
            console.log("Error submitting group ", appGroupError);
        }

        if (userError) {
            console.log("Error verifying user id", userError);
        }

    
    return { appGroupData, appGroupError };
}

export async function editTicketGroup(data, id) {
    const supabase = await createClient();

    console.log("Trying to change it to ", data);
    console.log("id edit = ", id)

    const { data: userData, error: userError } = await getIdFromAuthId();

    const { data: appGroupData , error: appGroupError } = await supabase
        .from("apps")   
        .update({
            app_name: data.app_name,
            type: data.type,
            link: data.link,
            created_by: userData?.[0]?.id,
            description: data.description
        })
        .eq("id", id)
        .select()

        if (appGroupData) {
            console.log("SUCCESSFULLY EDITED GROUP", appGroupData);
        }

        if (appGroupError) {
            console.log("Error editing group ", appGroupError);
        }

        if (userError) {
            console.log("Error verifying user id", userError);
        }

    
    return { appGroupData, appGroupError };
}
