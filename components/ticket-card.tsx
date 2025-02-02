import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export default async function TicketCard({ ticketData, role }) {

    const supabase = await createClient();

    const { data: userData, error } = await supabase
        .from("users")
        .select()
        .eq("id", ticketData.submitted_by)
        .single();

    if (error) {
        console.log("Error fetching user: ", error)
    }

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <h4 className="flex items-center gap-2 text-sm font-medium text-gray-500">Date:</h4>
                    {ticketData.created_at.split("T")[0]}
                </div>
                <div className="space-y-1">
                    <h4 className="flex items-center gap-2 text-sm font-medium text-gray-500">Submitted By:</h4>
                    {userData.email}
                </div>
            </div>
            <div>
                {role != "admin" ? (
                    <div className="space-y-1"><h4 className="flex items-center gap-2 text-sm font-medium text-gray-500">Status: </h4>{ticketData.status}</div>
                ) : (
                    <div className="space-y-1">
                        <h4 className="flex items-center gap-2 text-sm font-medium text-gray-500">Status:</h4> 
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder={ticketData.status}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="on-going">On-Going</SelectItem>
                                    <SelectItem value="fixed">Fixed</SelectItem>
                                    <SelectItem value="ready">Ready for Release</SelectItem>
                                    <SelectItem value="not-a-bug">Not a Bug</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
            <div>
                <h4 className="flex items-center gap-2 text-sm font-medium text-gray-500">Remarks:</h4>
                {role != "admin" ? (
                    <div></div>
                ) : (
                    <Textarea placeholder="Enter remarks here..." />
                )}
            </div>    
            <div className="space-y-1"><h4 className="flex items-center gap-2 text-sm font-medium text-gray-500">Type of Fix:</h4> {ticketData.type_of_fix}</div>
            <div className="space-y-1">
                <h4 className="flex items-center gap-2 text-sm font-medium text-gray-500">Screenshot:</h4>
                <div className="flex justify-center"> 
                    <img src={ticketData.screenshot} />
                </div>
            </div>
            {role === "admin" && (
                <Button type="submit">Save</Button>
            )}
        </div>
    )
}