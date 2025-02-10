import { deslugify } from "@/utils/slugify";
import { fetchAppData } from "@/utils/actions";
import { CurrentApp } from "@/components/current-app";

export default async function TicketGroupPage({ params }: { params: Promise<{ app_name: string }> }) {
    const { app_name } = await params; 
    const appName = deslugify(app_name);
    const initialData = await fetchAppData(appName);

    return (
        <div className="space-y-5">
            <CurrentApp appName={appName} initialData={initialData} />
        </div>
    )
}
