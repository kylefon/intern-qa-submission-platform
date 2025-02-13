"use client";

import { createClient } from "@/utils/supabase/client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getHistoryData } from "@/utils/actions";
import { useEffect, useState } from "react";

export default function HistoryData({}) {
    const [ data, setData ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const { flattenedData, historyDataError } = await getHistoryData();
                if ( historyDataError ) {
                    console.log("Error getting history data ", historyDataError );
                }
                setData(flattenedData);
            } catch (err) {
                console.log("Error fetching history data ", err);
            } finally {
                setLoading(false)
            }
        }
        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    
    return (
        <DataTable columns={columns} data={data} />
    );
};
