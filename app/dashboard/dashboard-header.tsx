import TicketGroupForm from "@/components/ticket-group-form";
import { AppTickets } from "@/components/app-tickets";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import  HistoryData from "@/components/historyTable/history-table";

export default function DashboardHeader({ appData }: any) {
    return ( 
        <div className="w-full flex">
            <Tabs defaultValue="group" className="w-full space-y-4">
                <div className="flex gap-2 items-center flex-col justify-between md:flex-row">
                    <TabsList className="w-full grid grid-cols-2 md:w-[50%]">
                        <TabsTrigger value="group">Ticket Group</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="group" className="w-full md:w-auto bg-green-500 rounded">
                        <TicketGroupForm />
                    </TabsContent>
                </div>
                <TabsContent value="group">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-cols-fr">
                        {appData.map((data) => (
                            <AppTickets key={data.id} appName={data.app_name} type={data.type} description={data.description} />
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="history">
                <HistoryData />
                   
                </TabsContent>
            </Tabs>
        </div>
    )
}