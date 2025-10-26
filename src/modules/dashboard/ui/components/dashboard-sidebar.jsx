"use client";

import { Separator } from "@/components/ui/separator";
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenuItem, SidebarMenu, SidebarMenuButton
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Eye, Users, FileText, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";

const firstSection = [
    {
        // Eye symbolizes image / vision reports
        icon: Eye,
        label: "AI Reports",
        href: "/ai-report"
    },
    {
        // Users for past reports / patients
        icon: Users,
        label: "Past Reports",
        href: "/past-reports"
    },
    {
        // FileText for generic reports/listing (kept as relevant symbol)
        icon: FileText,
        label: "Records",
        href: "/records"
    }
]

const secondSection = [
    {
        icon: StarIcon,
        label: "Contribute",
        href: "/contribute"
    }
]

export const DashboardSidebar = () => {
    const pathname = usePathname();
    return (
        <Sidebar>
            <SidebarHeader className="text-sidebar-accent-foreground ">
                <Link href={"/"} className="flex items-center gap-2 px-2 pt-2">
                    {/* subtle eye icon to emphasize vision/AI brand */}
                    <Eye className="size-5 text-primary/90" />
                    <p className="text-2xl font-semibold text-white">Netra AI</p>
                </Link>
            </SidebarHeader>
            <div className="px-4 py-2">
                <Separator className="opacity-10 text-[#5D6B68]" />
            </div>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {firstSection.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild className={cn(
                                        // keep fixed height and add gap for icon + label
                                        // hover now uses a subtle solid tint; active uses a solid primary tint
                                        "h-10 hover:bg-primary/10 border border-transparent px-2",
                                        pathname === item.href && "bg-primary/20 border-primary/40"
                                    )}
                                        isActive={pathname === item.href}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className={cn("size-5 mr-3", pathname === item.href ? "text-black" : "text-sidebar-foreground/80")} />
                                            <span className={cn("text-sm font-medium tracking-tight", pathname === item.href ? "text-black" : "text-sidebar-foreground/95")}>
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <div className="px-4 py-1">
                    <Separator className="opacity-10 text-[#5D6B68]" />
                </div>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondSection.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild className={cn(
                                        "h-10 hover:bg-primary/10 border border-transparent px-2",
                                        pathname === item.href && "bg-primary/20 border-primary/40 text-black"
                                    )}
                                        isActive={pathname === item.href}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className={cn("size-5 mr-3", pathname === item.href ? "text-black" : "text-sidebar-foreground/80")} />
                                            <span className={cn("text-sm font-medium tracking-tight", pathname === item.href ? "text-black" : "text-sidebar-foreground/95")}>
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="text-white">
                <DashboardUserButton />
            </SidebarFooter>
        </Sidebar>
    )
}
