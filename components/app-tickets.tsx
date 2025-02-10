import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { slugify } from "@/utils/slugify";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

export function AppTickets({appName, type, description}) {
    console.log(appName, description);
    return (
        <Card className="flex-row w-full justify-items-center">
            <CardHeader className="w-full h-1/2 items-center justify-center">
                <div className="flex w-full justify-evenly items-center">
                    <HoverCard>
                        <HoverCardTrigger className="w-full">
                            <CardTitle className="text-left">{appName}</CardTitle>
                        </HoverCardTrigger>
                        <HoverCardContent>
                            {description ? 
                                (<div>{description}</div>) 
                                :
                                (<div>No description available.</div>) 
                            }
                        </HoverCardContent>
                    </HoverCard>
                    <div className="h-4 w-1/12 bg-black text-s text-white px-7 py-3 rounded-xl flex justify-center items-center">{type}</div>
                </div>
            </CardHeader>
            <div className="w-full px-6 py-6 flex-row justify-items-end">
                <Link href={`/ticket-group/${encodeURIComponent(slugify(appName))}`}>
                    <Button className="w-full">View Tickets</Button>
                </Link>
            </div>
        </Card>
    )
}