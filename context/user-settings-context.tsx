"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

export type UserSettings = {
    accentColor: string
    compactMode: boolean
    emailNotifs: boolean
    courseUpdates: boolean
    weeklyDigest: boolean
    achievementAlerts: boolean
    avatar: string
}

const DEFAULT_SETTINGS: UserSettings = {
    accentColor: "#39FF14",
    compactMode: false,
    emailNotifs: true,
    courseUpdates: true,
    weeklyDigest: false,
    achievementAlerts: true,
    avatar: "",
}

type UserSettingsContextType = {
    settings: UserSettings
    updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void
    resetSettings: () => void
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined)

const STORAGE_KEY = "asci-user-settings"

export function UserSettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
    const [loaded, setLoaded] = useState(false)

    // Load settings from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored)
                setSettings({ ...DEFAULT_SETTINGS, ...parsed })
            }
        } catch { }
        setLoaded(true)
    }, [])

    // Apply accent color to CSS custom properties whenever it changes
    useEffect(() => {
        if (!loaded) return
        document.documentElement.style.setProperty("--accent", settings.accentColor)
        document.documentElement.style.setProperty("--primary", settings.accentColor)
        document.documentElement.style.setProperty("--ring", settings.accentColor)
        document.documentElement.style.setProperty("--success", settings.accentColor)
    }, [settings.accentColor, loaded])

    // Apply compact mode
    useEffect(() => {
        if (!loaded) return
        if (settings.compactMode) {
            document.documentElement.classList.add("compact")
        } else {
            document.documentElement.classList.remove("compact")
        }
    }, [settings.compactMode, loaded])

    // Persist to localStorage on change
    useEffect(() => {
        if (!loaded) return
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
        } catch { }
    }, [settings, loaded])

    const updateSetting = useCallback(<K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }, [])

    const resetSettings = useCallback(() => {
        setSettings(DEFAULT_SETTINGS)
        try { localStorage.removeItem(STORAGE_KEY) } catch { }
    }, [])

    return (
        <UserSettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
            {children}
        </UserSettingsContext.Provider>
    )
}

export function useUserSettings() {
    const context = useContext(UserSettingsContext)
    if (context === undefined) {
        throw new Error("useUserSettings must be used within a UserSettingsProvider")
    }
    return context
}
