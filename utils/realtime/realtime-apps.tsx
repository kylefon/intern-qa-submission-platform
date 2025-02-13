"use client";

import DashboardHeader from "@/app/dashboard/dashboard-header";
import { useEffect, useState } from "react";
import { createClient } from "../supabase/client";

export default function RealtimeApps({ initialData, role }){
    const supabase = createClient();
    const [ apps, setApps ] = useState(initialData || []);

    useEffect(() => {
        const channel = supabase
            .channel("apps")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "apps" },
                (payload) => {
                    console.log("Database change: ", payload);

                    if (payload.eventType === "INSERT") {
                        setApps((prev) => [...prev, payload.new]);
                      } else if (payload.eventType === "UPDATE") {
                        setApps((prev) =>
                          prev.map((app) => (app.id === payload.new.id ? payload.new : app))
                        );
                      } else if (payload.eventType === "DELETE") {
                        setApps((prev) => prev.filter((app) => app.id !== payload.old.id));
                      }
                }
            )
            .subscribe();

            return () => {
                channel.unsubscribe();
            } 
    }, []);

    if (role === "admin") {
      return <DashboardHeader appData={apps} />
    } 

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-cols-fr">
        {apps.map((data) => (
          <AppTickets 
            key={data.id} 
            appName={data.app_name} 
            type={data.type} 
            description={data.description} 
          />
        ))}
      </div> 
    )
}