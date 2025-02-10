"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { useState } from "react"

export function VersionSelector({versions}) { 
    const [selectedVersion, setSelectedVersion] = useState(" ");
    return (
        <Select onValueChange={setSelectedVersion}>
            <SelectTrigger>
                <SelectValue placeholder="Select a version..." />
            </SelectTrigger>
            <SelectContent>
                {versions?.length >= 1 ? (versions?.map((data) => (
                    <SelectItem key={data.id} value={data.id.toString()}>{data.app_version}</SelectItem>
                ))) : <SelectItem value="N/A">No Versions Found...</SelectItem>}
            </SelectContent>
        </Select>
    )
}