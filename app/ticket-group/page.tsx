import TicketCard from "@/components/ticket-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function TicketGroupPage() {
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

        
        if (error || !userRole) {
            console.log("Error fetching role: ", error);
            return redirect("/sign-in");
        } 
        
    const { data: ticketData, error: ticketError } = await supabase
        .from("tickets")
        .select()

    if (ticketError) {
        console.log("Error fetching ticket data", error);
    }

    const role = userRole.role;

    return (
        <div>
            {/* Temporary: to check if ticket card is working */}
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