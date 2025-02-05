import TicketCard from "@/components/ticket-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { deslugify } from "@/utils/slugify";
import { redirect } from "next/navigation";
import { InternTicketForm } from "@/components/intern-ticket-form";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { getAppData, getAppVersions, getUserRole, validateUserSignIn, getAppTickets } from "@/utils/actions";
import TicketGroupForm from "@/components/ticket-group-form";

export default async function TicketGroupPage({ params }: { params: Promise<{ app_name: string }> }) {
    const { app_name } = await params; 

    const appName = deslugify(app_name);

    const {user, userError} = await validateUserSignIn();
    if (userError) {
        return `${userError}`
    } 
    if (!user) {
        return redirect("/sign-in");
    }

    const getUserRoleResult = await getUserRole(user?.email);
    const {userRole, userRoleError} = getUserRoleResult;
    const {data: ticketData, error: ticketError} = await getAppTickets(appName);
    const { data: appData, error: appError } = await getAppData(appName);
    const { data: appVersions, error: appVersionsError } = await getAppVersions(appData?.[0]?.id);

    if ( appError || ticketError ) {
        console.log("Error fetching data: ", appError);
    }

    if (userRoleError || !userRole) {
        console.log("Error fetching role: ", userRoleError);
        return redirect("/sign-in");
    }

    const role = userRole.role;
    
    return (
        <div className="space-y-5">
            {/* Temporary: to check if ticket card is working */}
            <div className="flex w-full justify-between items-center">
                <div>
                    <h1 className="text-4xl font-extrabold">{appData?.[0]?.app_name}</h1>
                    <h1>Place link here:</h1>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a version..." />
                        </SelectTrigger>
                        <SelectContent>
                            {appVersions?.length > 1 ? (appVersions?.map((data) => (
                                <SelectItem key={data.id} value={data.id.toString()}>{data.app_version}</SelectItem>
                            ))) : <SelectItem value="N/A">No Versions Found...</SelectItem>}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2">
                    <TicketGroupForm initialData={appData}/>
                    <InternTicketForm appVersion="0.0.8" appName={appName} />
                </div>
            </div>
            <Separator />

            {ticketData?.map((ticket) => (
                <Dialog key={ticket.id}>
                    <DialogTrigger asChild>
                        {/* Testing button only should be the button from table*/}
                        <Button>TEST TICKET CARD</Button>
                    </DialogTrigger>
                    <DialogContent className="overflow-y-auto max-h-[80vh]">
                        <DialogHeader>
                            <DialogTitle>{ticket.ticket_title}</DialogTitle>
                            <DialogDescription>
                                {ticket.description}
                            </DialogDescription>
                        </DialogHeader>
                        <TicketCard ticketData={ticket} role={role}/>
                    </DialogContent>
                </Dialog>
            ))}
        </div>
    )
}
