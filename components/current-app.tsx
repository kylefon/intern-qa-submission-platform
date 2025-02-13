"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { InternTicketForm } from "@/components/intern-ticket-form";
import TicketGroupForm from "@/components/ticket-group-form";
import TableData from "@/components/tableData/history-data";
import { Separator } from "./ui/separator";
import { deleteTicketGroup, getVersionLink } from "@/utils/actions";
import { AddVersion } from "@/components/add-version";
import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel } from "./ui/alert-dialog";
import { redirect } from "next/navigation";

export function CurrentApp({ appName, initialData }) {
    const [selectedVersion, setSelectedVersion] = useState("");
    const [currentVersionLink, setCurrentVersionLink] = useState("");

    const [isTableLoading, setIsTableLoading] = useState(true);


    const deleteEvent = async ( id: number ) => {
        const { data, error } = await deleteTicketGroup(id);

        if ( data ) {
            console.log("DELETED THE APP");
            return redirect("/dashboard")
        }

        if ( error ) {
            console.log("error deleting the app ", error);
            return;
        }
    }
    
    useEffect(() => {
        const fetchCurrentVersionLink = async () => {
            setIsTableLoading(true);
            try {
                const versionLink = await getVersionLink(selectedVersion);
                setCurrentVersionLink(versionLink?.link);
            } catch (error) {
                console.log(error);    
            } finally {
                setIsTableLoading(false);
            }
        }
        fetchCurrentVersionLink();
    }, [selectedVersion])

    const { user, role, appData, appVersions } = initialData;
    console.log("INITIAL DATA", initialData);
    console.log("ID OF THE TICKET GROUP: ", initialData?.appData?.[0]?.id)
    console.log(`[current-app: role]: ${role}`) 
    return (
        <div>
            <div className="flex flex-col w-full space-y-2 items-start">
                <div className="w-full flex justify-between items-center">
                    <h1 className="text-4xl font-extrabold">{appData?.[0]?.app_name}</h1>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant={"destructive"}>
                                <Trash/>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Delete Group
                                </AlertDialogTitle>
                                <AlertDialogDescription>Are you sure you want to delete this group?</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>  
                                <AlertDialogAction onClick={() => deleteEvent(initialData?.appData?.[0]?.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="flex flex-col gap-2 justify-between w-full sm:flex-row sm:items-end">
                    <div className="w-full sm:w-[40%]">
                        <h1>{"Link: "}
                            <a href={currentVersionLink} target="_blank" className="text-blue-500 underline">
                            {currentVersionLink}
                            </a>
                        </h1>

                        <div className="w-[250px]">
                            <Select onValueChange={setSelectedVersion}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a version..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {appVersions?.length >= 1 ? (
                                        appVersions?.map((data) => (
                                            <SelectItem
                                                key={data.id}
                                                value={data.id.toString()}
                                            >
                                                {data.app_version}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="N/A">No Versions Found...</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                    </div>
                    <div className="flex gap-2">
                        {role === "admin" && (
                            <AddVersion appName={appName} />
                        )}
                        {role === "admin" && <TicketGroupForm initialData={appData} />}
                            <InternTicketForm appVersion={selectedVersion} appName={appName} />
                    </div>
                </div>
            </div>
            <Separator className="my-5"/>
            <TableData isLoading={isTableLoading} appName={appName} role={role} selectedVersion={selectedVersion}/>
            
        </div>
    );
}
