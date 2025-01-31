import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import DashboardHeader from "./dashboard-header";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const { data: appData, error: appError} = await supabase.from("apps").select();

  console.log("app data: ", appData)

  if (appError) {
    console.log("Error fetching app data", error);
  }

  const role = userRole.role;

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        {role==="admin" ? (
          <div>
            <DashboardHeader appData={appData}/>
          </div>
        ) : "Intern"}
      </div>
    </div>
  );
}
