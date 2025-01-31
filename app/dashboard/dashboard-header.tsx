"use client"

import { AppTickets } from "@/components/app-tickets";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import { useState } from "react";

export default function DashboardHeader({ appData }: any) {

    const [ activeTab, setActiveTab ] = useState("group");

    return ( 
        <div className="w-full flex">
            <Tabs defaultValue="group" onValueChange={setActiveTab} className="w-full space-y-4">
                <div className="flex gap-2 items-center flex-col justify-between sm:flex-row sm:">
                    <TabsList className="w-full grid grid-cols-2 md:w-[50%]">
                        <TabsTrigger value="group" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">Ticket Submission Group</TabsTrigger>
                        <TabsTrigger value="history" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">History</TabsTrigger>
                    </TabsList>
                    {activeTab === "group" && (
                        <Button className="w-full sm:w-auto">Add Ticket Group</Button>
                    )}
                </div>
                <TabsContent value="group">
                    <div className="flex flex-wrap gap-2">
                        {appData.map((data) => (
                            <div className="sm:w-1/2 md:w-1/3 lg:w-1/4">
                                <AppTickets key={data.id} appName={data.app_name} type={data.type} description={"Ollopa number 1 company"} />
                            </div>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="history">
                    <div>
                        History Table
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}