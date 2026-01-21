import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { RANKS } from "@/config/ranks";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";

interface SetLevelDialogProps {
    userId: string;
    currentLevel: number;
    userName: string;
    onLevelChanged: (newLevel: number, newXp: number) => void;
}

export function SetLevelDialog({ userId, currentLevel, userName, onLevelChanged }: SetLevelDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState(currentLevel.toString());
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    const handleSave = async () => {
        setIsLoading(true);
        const level = parseInt(selectedLevel);
        const rankConfig = RANKS.find(r => r.level === level);

        if (!rankConfig) return;

        try {
            const { error } = await supabase.rpc('admin_set_user_level', {
                target_user_id: userId,
                new_level: level,
                new_xp: rankConfig.minXp
            });

            if (error) throw error;

            toast.success(`Đã cập nhật ${userName} lên Level ${level}`);
            onLevelChanged(level, rankConfig.minXp);
            setIsOpen(false);
        } catch (error: any) {
            console.error(error);
            toast.error("Lỗi cập nhật level: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    Set Level (Admin)
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Level cho thành viên</DialogTitle>
                    <DialogDescription>
                        Thao tác này sẽ đặt Level và XP của <b>{userName}</b> về mức khởi đầu của Level được chọn.
                        <br />Hành động này chỉ dành cho Admin.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                    >
                        {RANKS.map((rank) => (
                            <option key={rank.level} value={rank.level.toString()}>
                                Level {rank.level} - {rank.nameVi || rank.name} ({rank.minXp} XP)
                            </option>
                        ))}
                    </select>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Đang lưu..." : "Xác nhận"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
