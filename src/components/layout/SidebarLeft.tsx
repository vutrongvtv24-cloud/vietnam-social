"use client";

import { Button } from "@/components/ui/button";
import { Lock, Home, Hash, MessageCircle, BookOpen, CheckSquare, NotebookPen, Users } from "lucide-react";
import { RPG_CLASSES, SPACES } from "@/data/mock";
import Link from "next/link";
import { useGamification } from "@/context/GamificationContext";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";

export function SidebarLeft() {
    const { level } = useGamification();
    const { t } = useLanguage();
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="space-y-6 pb-4">
            <div className="space-y-1">
                <Button
                    variant={isActive("/") ? "secondary" : "ghost"}
                    className="w-full justify-start font-medium"
                    asChild
                >
                    <Link href="/">
                        <Users className="mr-2 h-4 w-4" />
                        {t.nav.community}
                    </Link>
                </Button>
                <Button
                    variant={isActive("/journal") ? "secondary" : "ghost"}
                    className="w-full justify-start font-medium"
                    asChild
                >
                    <Link href="/journal">
                        <NotebookPen className="mr-2 h-4 w-4" />
                        {t.nav.myJournal}
                    </Link>
                </Button>
                <Button
                    variant={isActive("/todos") ? "secondary" : "ghost"}
                    className="w-full justify-start font-medium"
                    asChild
                >
                    <Link href="/todos">
                        <CheckSquare className="mr-2 h-4 w-4" />
                        {t.nav.todoList}
                    </Link>
                </Button>
                <Button
                    variant={isActive("/messages") ? "secondary" : "ghost"}
                    className="w-full justify-start font-medium"
                    asChild
                >
                    <Link href="/messages">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {t.nav.messages}
                    </Link>
                </Button>
            </div>

            <div>
                <Button
                    variant={isActive("/courses") ? "secondary" : "ghost"}
                    className="w-full justify-start font-medium"
                    asChild
                >
                    <Link href="/courses">
                        <BookOpen className="mr-2 h-4 w-4" />
                        {t.nav.courses}
                    </Link>
                </Button>
            </div>

            <div className="pt-4">
                <h3 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
                    {t.nav.community}
                </h3>
                <div className="space-y-1">
                    <Button
                        variant={isActive("/community/youtube") ? "secondary" : "ghost"}
                        className="w-full justify-start font-medium"
                        asChild
                    >
                        <Link href="/community/youtube">
                            <span className="mr-2 text-lg">📺</span>
                            Youtube
                        </Link>
                    </Button>
                    <Button
                        variant={isActive("/community/tricks-courses") ? "secondary" : "ghost"}
                        className="w-full justify-start font-medium"
                        asChild
                    >
                        <Link href="/community/tricks-courses">
                            <span className="mr-2 text-lg">🎓</span>
                            Tricks & Courses
                        </Link>
                    </Button>
                </div>
            </div>

        </div>
    )
}
