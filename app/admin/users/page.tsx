"use client"

import { useEffect, useState, useTransition } from "react"
import { getAllUsers, updateUserRole, updateUserXP, deleteUser, banUser } from "@/app/actions/admin"
import { format } from "date-fns"
import {
    Users, Shield, ShieldAlert, Trash2, Loader2, Search,
    ChevronDown, RefreshCw, UserX, UserCheck, Edit2, Check, X,
    Crown, MoreVertical, Filter
} from "lucide-react"

type Role = "user" | "admin" | "super_admin"

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState<"all" | Role>("all")
    const [editingXP, setEditingXP] = useState<{ id: string; val: string } | null>(null)
    const [actionId, setActionId] = useState<string | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null)

    const notify = (type: "ok" | "err", msg: string) => {
        setToast({ type, msg })
        setTimeout(() => setToast(null), 3000)
    }

    const load = () => startTransition(async () => {
        const res = await getAllUsers()
        if (res.success && res.users) setUsers(res.users)
        else notify("err", res.error || "Failed to load users")
        setLoading(false)
    })

    useEffect(() => { load() }, [])

    const handleRoleChange = async (userId: string, role: Role) => {
        setActionId(userId)
        const res = await updateUserRole(userId, role)
        if (res.success) {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
            notify("ok", `Role updated to ${role}`)
        } else notify("err", res.error || "Failed")
        setActionId(null)
    }

    const handleXPSave = async (userId: string) => {
        if (!editingXP) return
        setActionId(userId)
        const res = await updateUserXP(userId, parseInt(editingXP.val) || 0)
        if (res.success) {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, xp: parseInt(editingXP.val) } : u))
            notify("ok", "XP updated")
        } else notify("err", res.error || "Failed")
        setEditingXP(null)
        setActionId(null)
    }

    const handleBan = async (userId: string, banned: boolean) => {
        setActionId(userId)
        const res = await banUser(userId, !banned)
        if (res.success) {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_banned: !banned } : u))
            notify("ok", !banned ? "User banned" : "User unbanned")
        } else notify("err", res.error || "Failed")
        setActionId(null)
    }

    const handleDelete = async (userId: string) => {
        setActionId(userId)
        const res = await deleteUser(userId)
        if (res.success) {
            setUsers(prev => prev.filter(u => u.id !== userId))
            notify("ok", "User deleted")
        } else notify("err", res.error || "Failed")
        setDeleteConfirm(null)
        setActionId(null)
    }

    const filtered = users.filter(u => {
        const q = search.toLowerCase()
        const matchSearch = !q || (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q)
        const matchRole = roleFilter === "all" || u.role === roleFilter
        return matchSearch && matchRole
    })

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-[#f26722]" /></div>

    return (
        <div className="space-y-6 pt-2">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 border text-sm font-mono ${toast.type === "ok" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
                    {toast.type === "ok" ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-1.5 w-6 bg-[#f26722]" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#f26722]/70">User Management</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white">Users <span className="text-[#333] text-lg">({filtered.length})</span></h1>
                    <p className="text-[#555] text-xs mt-1 font-mono">Manage roles, XP, ban status, and remove accounts.</p>
                </div>
                <button onClick={load} disabled={isPending}
                    className="flex items-center gap-2 px-3 py-2 border border-[#1a1a1a] text-xs text-[#555] hover:text-[#f26722] hover:border-[#f26722]/30 transition-all font-mono uppercase tracking-wider">
                    <RefreshCw className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`} /> Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#333]" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] text-sm text-[#EDEDED] focus:outline-none focus:border-[#f26722]/40 transition-all font-mono placeholder:text-[#333]" />
                </div>
                <div className="flex border border-[#1a1a1a] overflow-hidden">
                    {(["all", "user", "admin", "super_admin"] as const).map(r => (
                        <button key={r} onClick={() => setRoleFilter(r)}
                            className={`px-3 py-2.5 text-[10px] font-mono uppercase tracking-wider transition-all ${roleFilter === r ? "bg-[#f26722] text-[#050505]" : "text-[#444] hover:text-[#EDEDED]"}`}>
                            {r === "all" ? "All" : r === "super_admin" ? "Super" : r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-[#1a1a1a] bg-[#080808]">
                            <tr>
                                <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-[#333]">User</th>
                                <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-[#333]">Role</th>
                                <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-[#333]">XP</th>
                                <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-[#333]">Joined</th>
                                <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-[#333]">Last Login</th>
                                <th className="px-4 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-[#333]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#0f0f0f]">
                            {filtered.map(u => (
                                <tr key={u.id} className={`hover:bg-[#f26722]/5 transition-colors ${u.is_banned ? "opacity-50" : ""}`}>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center bg-[#f26722]/5 border border-[#f26722]/15 text-[#f26722] text-xs font-black flex-shrink-0">
                                                {(u.name || u.email || "?")[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-[#EDEDED] text-sm flex items-center gap-2">
                                                    {u.name || "—"}
                                                    {u.is_banned && <span className="text-[9px] text-red-400 font-mono border border-red-400/30 px-1">BANNED</span>}
                                                </div>
                                                <div className="text-xs text-[#444] font-mono">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={u.role || "user"}
                                            disabled={actionId === u.id}
                                            onChange={e => handleRoleChange(u.id, e.target.value as Role)}
                                            className="bg-[#0a0a0a] border border-[#1a1a1a] text-[11px] font-mono text-[#EDEDED] px-2 py-1.5 focus:outline-none focus:border-[#f26722]/40 transition-all uppercase tracking-wider cursor-pointer"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                            <option value="super_admin">Super Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        {editingXP?.id === u.id ? (() => {
                                            const xpEdit = editingXP!
                                            return (
                                                <div className="flex items-center gap-1">
                                                    <input type="number" value={xpEdit.val}
                                                        onChange={e => setEditingXP({ id: u.id, val: e.target.value })}
                                                        className="w-20 bg-[#050505] border border-[#f26722]/40 text-[#f26722] text-xs font-mono px-2 py-1 focus:outline-none"
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleXPSave(u.id)} className="p-1 text-green-400 hover:text-green-300"><Check className="h-3.5 w-3.5" /></button>
                                                    <button onClick={() => setEditingXP(null)} className="p-1 text-red-400 hover:text-red-300"><X className="h-3.5 w-3.5" /></button>
                                                </div>
                                            )
                                        })() : (
                                            <button onClick={() => setEditingXP({ id: u.id, val: String(u.xp || 0) })}
                                                className="text-[#f26722] font-mono text-xs hover:underline flex items-center gap-1 group">
                                                {(u.xp || 0).toLocaleString()} XP
                                                <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-[#444] font-mono">
                                        {format(new Date(u.created_at), "MMM d, yyyy")}
                                    </td>
                                    <td className="px-4 py-3 text-xs font-mono">
                                        {u.last_sign_in_at
                                            ? <span className="text-[#4ade80]/70">{format(new Date(u.last_sign_in_at), "MMM d, yyyy")}</span>
                                            : <span className="text-[#333]">Never</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            {/* Ban toggle */}
                                            <button onClick={() => handleBan(u.id, u.is_banned)}
                                                disabled={actionId === u.id}
                                                title={u.is_banned ? "Unban User" : "Ban User"}
                                                className={`p-2 border transition-all ${u.is_banned
                                                    ? "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                                                    : "border-[#1a1a1a] text-[#444] hover:text-amber-400 hover:border-amber-400/30"}`}>
                                                {u.is_banned ? <UserCheck className="h-3.5 w-3.5" /> : <UserX className="h-3.5 w-3.5" />}
                                            </button>
                                            {/* Delete */}
                                            {deleteConfirm === u.id ? (
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[10px] text-amber-400 font-mono">Sure?</span>
                                                    <button onClick={() => handleDelete(u.id)} disabled={actionId === u.id}
                                                        className="px-2 py-1 border border-red-500/30 text-red-400 text-[10px] font-mono hover:bg-red-500/10 transition-all">
                                                        {actionId === u.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Yes"}
                                                    </button>
                                                    <button onClick={() => setDeleteConfirm(null)}
                                                        className="px-2 py-1 border border-[#1a1a1a] text-[#444] text-[10px] font-mono hover:text-[#EDEDED] transition-all">No</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setDeleteConfirm(u.id)}
                                                    className="p-2 border border-[#1a1a1a] text-[#444] hover:text-red-400 hover:border-red-400/30 transition-all">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-[#333] font-mono text-xs">No users found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
