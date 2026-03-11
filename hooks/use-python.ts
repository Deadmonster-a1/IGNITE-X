"use client"

import { useState, useEffect, useCallback, useRef } from "react"

// Types for the global Pyodide object
declare global {
    interface Window {
        loadPyodide: (options?: {
            indexURL?: string
            stdout?: (text: string) => void
            stderr?: (text: string) => void
        }) => Promise<any>
    }
}

export function usePython() {
    const [isLoading, setIsLoading] = useState(true)
    const [isReady, setIsReady] = useState(false)
    const pyodideRef = useRef<any>(null)

    // We'll store the accumulated standard output here so we can read it after execution
    const stdoutRef = useRef<string[]>([])

    useEffect(() => {
        // Inject the Pyodide script only once
        if (document.querySelector('script[src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js"]')) {
            if (typeof window.loadPyodide === 'function' && !pyodideRef.current) {
                initPyodide()
            }
            return
        }

        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js"
        script.async = true

        script.onload = () => {
            initPyodide()
        }

        document.body.appendChild(script)

        async function initPyodide() {
            try {
                pyodideRef.current = await window.loadPyodide({
                    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
                    stdout: (text: string) => {
                        stdoutRef.current.push(text)
                    },
                    stderr: (text: string) => {
                        // For now, route stderr to stdout as well so user sees it in console
                        stdoutRef.current.push(text)
                    }
                })
                setIsReady(true)
            } catch (err) {
                console.error("Failed to load Pyodide:", err)
            } finally {
                setIsLoading(false)
            }
        }

        return () => {
            // Cleanup if necessary, though Pyodide usually stays alive globally
        }
    }, [])

    const runPython = useCallback(async (code: string) => {
        if (!pyodideRef.current || !isReady) {
            return { success: false, output: "Error: Python interpreter is not ready yet.", result: null }
        }

        // Clear previous output
        stdoutRef.current = []

        try {
            // Execute the code
            const result = await pyodideRef.current.runPythonAsync(code)

            return {
                success: true,
                output: stdoutRef.current.join("\\n"),
                result: result?.toString()
            }
        } catch (error: any) {
            // Extract the Python traceback error message cleanly
            const errorMessage = error.message || error.toString()
            return {
                success: false,
                output: stdoutRef.current.join("\\n"),
                error: errorMessage
            }
        }
    }, [isReady])

    return { isLoading, isReady, runPython }
}
