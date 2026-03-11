"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { RealtimeChannel } from "@supabase/supabase-js"

export function useRealtimeData<T extends { id: string }>(
    table: string,
    initialData: T[] = [],
    filter?: string
) {
    const [data, setData] = useState<T[]>(initialData)
    const supabase = createClient()

    useEffect(() => {
        setData(initialData)
    }, [initialData])

    useEffect(() => {
        let channel: RealtimeChannel

        const setupSubscription = async () => {
            channel = supabase
                .channel(`public:${table}${filter ? `:${filter}` : ""}`)
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: table,
                        filter: filter,
                    },
                    (payload) => {
                        if (payload.eventType === "INSERT") {
                            setData((prev) => [payload.new as T, ...prev])
                        } else if (payload.eventType === "UPDATE") {
                            setData((prev) =>
                                prev.map((item) =>
                                    item.id === (payload.new as T).id ? (payload.new as T) : item
                                )
                            )
                        } else if (payload.eventType === "DELETE") {
                            setData((prev) =>
                                prev.filter((item) => item.id !== (payload.old as T).id)
                            )
                        }
                    }
                )
                .subscribe()
        }

        setupSubscription()

        return () => {
            if (channel) {
                supabase.removeChannel(channel)
            }
        }
    }, [table, filter, supabase])

    return { data, setData }
}
