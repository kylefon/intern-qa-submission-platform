import AddTicketGroupButton from "@/components/add-group-button";
import { AppTickets } from "@/components/app-tickets";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";

export default function DashboardHeader({ appData }: any) {
    return ( 
        <div className="w-full flex">
            <Tabs defaultValue="group" className="w-full space-y-4">
                <div className="flex gap-2 items-center flex-col justify-between md:flex-row">
                    <TabsList className="w-full grid grid-cols-2 md:w-[50%]">
                        <TabsTrigger value="group" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">Ticket Group</TabsTrigger>
                        <TabsTrigger value="history" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="group" className="w-full md:w-auto bg-green-500 rounded">
                        <Button className="w-full md:w-auto bg-green-500">Add Ticket Group</Button>
                    </TabsContent>
                </div>
                <TabsContent value="group">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-cols-fr">
                        {appData.map((data) => (
                            <AppTickets key={data.id} appName={data.app_name} type={data.type} description={"Ollopa number 1 company"} />
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