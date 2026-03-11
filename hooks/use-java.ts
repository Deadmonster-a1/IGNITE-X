"use client"

import { useState, useCallback } from "react"

export function useJava() {
    const [isLoading, setIsLoading] = useState(false)
    const [isReady, setIsReady] = useState(true) // Piston API is always "ready"

    const runJava = useCallback(async (code: string) => {
        setIsLoading(true)

        try {
            const response = await fetch("https://emkc.org/api/v2/piston/execute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    language: "java",
                    version: "15.0.2",
                    files: [
                        {
                            name: "Main.java",
                            content: code
                        }
                    ]
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to execute Java code")
            }

            // Extract output from the Piston response
            const runResult = data.run
            
            if (runResult.signal) {
                 return {
                    success: false,
                    output: runResult.stdout || "",
                    error: `Process terminated with signal: ${runResult.signal}\n${runResult.stderr}`
                }
            }

            if (runResult.code !== 0) {
                 return {
                    success: false,
                    output: runResult.stdout || "",
                    error: runResult.stderr || "Execution failed with non-zero exit code"
                }
            }


            return {
                success: true,
                output: runResult.stdout || "",
                result: null // Piston doesn't return a specific expression result like python REPL
            }

        } catch (error: any) {
             return {
                success: false,
                output: "",
                error: error.message || error.toString()
            }
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { isLoading, isReady, runJava }
}
