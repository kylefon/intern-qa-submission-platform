"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { addTicketUpdate, getIdFromAuthId, getUserDataById, updateTicketCard } from "@/utils/actions";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { Label } from "./ui/label";

const FormSchema = z.object({
    status: z.string(),
    remarks: z.string().max(255).nullable().or(z.literal(""))
});

export default function TicketCard({ ticketData, role }) {
    const [userData, setUserData] = useState(null);
    const [userDataError, setUserDataError] = useState(null);
    const [isSubmitting, setIsSubmitting]=  useState(false);
    const [ userId, setUserId ] = useState(null); 
    
    console.log("Ticket Data", ticketData);
    console.log("user data ", userData);
    console.log("ticket data user", ticketData.submitted_by.id);
    console.log("user data", userId);
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data, error } = await getUserDataById(ticketData.submitted_by.id);
                if (data) {
                    setUserData(data);
                } else {
                    setUserDataError(error);
                }

                const { data: userIdData, error: userIDError } = await getIdFromAuthId();
                if ( userIdData ) {
                  setUserId(userIdData);
                } else {
                  setUserData(userIDError);
                }
            } catch (error) {
                setUserDataError(error);
            }
        };

        fetchUserData();
    }, [ticketData.submitted_by.id]);


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            status: ticketData.status ?? "",
            remarks: ticketData.remarks ?? "",
        },
    });

    const { control, handleSubmit } = form;

    async function onSubmit(data: z.infer<typeof FormSchema>) {
      setIsSubmitting(true);
      try {
          const { error: ticketError } = await updateTicketCard(data.status, data.remarks, ticketData.id);
          console.log(ticketData.id); 
          if (ticketError) {
            console.error("Error updating ticket: ", ticketError)
          }
          
          const { error: ticketUpdateError } = await addTicketUpdate(ticketData.id, data.status, data.remarks, userData.id);

          if (ticketUpdateError) {
            console.log("Error logging ticket update: ", ticketUpdateError);
          }
      } catch (error) {
          console.log("Error", error);
      } finally {
          setIsSubmitting(false);
      }
    }
  
    if (userDataError) {
        return <div>Error fetching user data: {userDataError}</div>;
    }

    if (!userData) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 flex flex-col">
              <Label>Date:</Label>
              {ticketData.created_at.toString().split("T")[0]}
            </div>
            <div className="space-y-1 flex flex-col">
              <Label>Submitted By:</Label>
              {userData.email}
            </div>
          </div>
      
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              {role === "admin" ? (
                <div className="space-y-2">
                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <div className="space-y-1">
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={ticketData.status}
                            >
                              <SelectTrigger>
                                <SelectValue 
                                  placeholder={ticketData.status} 
                                />
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
                          </FormControl>
                        </FormItem>
                      </div>
                    )}
                  />
                  <FormField
                    control={control}
                    name="remarks" 
                    render={({ field }) => (
                      <div className="space-y-1">
                        <FormItem>
                          <FormLabel>Remarks</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Enter remarks here..." />
                          </FormControl>
                        </FormItem>
                      </div>
                    )}
                  />
                </div>
              ) : (
                <div>
                  <div className="space-y-1 flex flex-col">
                    <Label>Status:</Label>
                    {ticketData.status}
                  </div>
                  <div className="space-y-1 flex flex-col">
                    <Label>Remarks:</Label>
                    <div>{ticketData.remarks}</div>
                  </div>
                </div>
              )}
      
              <div className="space-y-1 flex flex-col">
                <Label>Type of Fix: </Label>
                {ticketData.type_of_fix}
              </div>
              {ticketData.screenshot && (
                <div className="space-y-1 flex flex-col">
                    <Label>Screenshot:</Label>
                    <div className="flex justify-center">
                    <img src={ticketData.screenshot} alt="Screenshot" />
                  </div>
                </div>
              )}
              { ticketData.submitted_by.id === userId && (
                <Button type="button">
                  Edit
                </Button>
              )}
              { role === "admin" && (
                <Button type="submit" disabled={isSubmitting} className="flex-shrink-0 mt-2">
                  {isSubmitting ? <Loader size={16} /> : "Submit"}
                </Button>
              )}
            </form>
          </Form>   
        </div>
      );
      
}
