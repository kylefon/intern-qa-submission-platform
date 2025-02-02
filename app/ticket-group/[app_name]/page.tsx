import TicketCard from "@/components/ticket-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { deslugify } from "@/utils/slugify";
import { createClient } from "@/utils/supabase/server";
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

export default async function TicketGroupPage({ params }: { params: Promise<{ app_name: string }> }) {
    const { app_name } = await params; 

    const appName = deslugify(app_name);

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
    return redirect("/sign-in");
    }

    const { data: userRole, error } = await supabase
        .from("users")
        .select("role")
        .eq("email", user?.email)
        .single();

    const { data: ticketData, error: ticketError } = await supabase
        .from("tickets")
        .select()

    const { data: appData, error: appError } = await supabase
        .from("apps")
        .select()
        .ilike("app_name", appName);
        
    const { data: appVersions, error: appVersionsError } = await supabase
        .from("app_versions")
        .select("*")
        .eq("app_id", appData?.[0]?.id);

    if ( appError || ticketError ) {
        console.log("Error fetching data: ", appError);
    }

    if (error || !userRole) {
        console.log("Error fetching role: ", error);
        return redirect("/sign-in");
    }

    const role = userRole.role;
    
    console.log("appData: ", appData);
    console.log("appVersions: ", appVersions);

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
                            {appVersions?.map((data) => (
                                <SelectItem key={data.id} value={data.id.toString()}>{data.app_version}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                    <InternTicketForm />
            </div>
            <Separator />

            {ticketData?.map((ticket) => (
                <Dialog key={ticket.id}>
                    <DialogTrigger asChild>
                        {/* Testing button only should be the button from table*/}
                        <Button>TEST TICKET CARD</Button>
                    </DialogTrigger>
                    <DialogContent>
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
