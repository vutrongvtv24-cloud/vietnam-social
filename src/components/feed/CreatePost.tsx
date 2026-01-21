"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image as ImageIcon, X, Smile, Globe, Video } from "lucide-react";
import { compressImage } from "@/lib/imageUtils";
import { useLanguage } from "@/context/LanguageContext";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';
import { useTheme } from "next-themes";

interface CreatePostProps {
    onPost: (content: string, image?: File, title?: string, minLevel?: number) => Promise<void>;
    user: {
        avatar?: string;
        name: string;
        handle?: string;
    } | null;
    placeholder?: string;
    disabled?: boolean;
    maxLevel?: number;
}

export function CreatePost({ onPost, user, placeholder, disabled = false, maxLevel = 0 }: CreatePostProps) {
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    // Form States
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [minLevel, setMinLevel] = useState(0);
    const [isPosting, setIsPosting] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Use i18n placeholder if not provided
    const finalPlaceholder = placeholder || t.feed.shareWhatYouLearned;

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setImagePreview(objectUrl);

        try {
            const compressed = await compressImage(file);
            setSelectedImage(compressed);
        } catch (error) {
            console.error("Compression failed, using original", error);
            setSelectedImage(file);
        }

        // Ensure dialog stays open or opens if triggered from outside
        if (!isOpen) setIsOpen(true);
    };

    const clearImage = () => {
        setSelectedImage(null);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const resetForm = () => {
        setContent("");
        setTitle("");
        setMinLevel(0);
        clearImage();
    };

    const handleSubmit = async () => {
        if ((!content.trim() && !selectedImage && !title.trim()) || isPosting) return;

        try {
            setIsPosting(true);
            await onPost(content, selectedImage || undefined, title, minLevel);
            resetForm();
            setIsOpen(false);
        } finally {
            setIsPosting(false);
        }
    };

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setContent(prev => prev + emojiData.emoji);
    };

    if (!user) return null;

    // Helper to trigger file input
    const triggerFileInput = () => fileInputRef.current?.click();

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                {/* 1. TRIGGER BAR (Facebook Style) */}
                <DialogTrigger asChild>
                    <Card className={`mb-4 cursor-pointer hover:bg-accent/5 transition-colors ${disabled ? "opacity-60 pointer-events-none" : ""}`}>
                        <CardContent className="p-4">
                            <div className="flex gap-3 items-center">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.avatar || ""} />
                                    <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 bg-muted/50 hover:bg-muted/80 h-10 rounded-full px-4 flex items-center text-muted-foreground text-sm transition-colors">
                                    {language === 'vi'
                                        ? `Bạn đang nghĩ gì thế, ${user.name?.split(' ').pop()}?`
                                        : `What's on your mind, ${user.name?.split(' ').pop()}?`}
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 mt-3 border-t">
                                <Button
                                    variant="ghost"
                                    className="flex-1 gap-2 text-muted-foreground hover:bg-transparent hover:text-foreground"
                                    onClick={(e) => { e.stopPropagation(); setIsOpen(true); setTimeout(() => triggerFileInput(), 200); }}
                                >
                                    <ImageIcon className="h-5 w-5 text-green-500" />
                                    <span className="text-xs sm:text-sm font-medium">{language === 'vi' ? 'Ảnh/Video' : 'Photo/Video'}</span>
                                </Button>
                                <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground hover:bg-transparent hover:text-foreground">
                                    <Video className="h-5 w-5 text-red-500" />
                                    <span className="text-xs sm:text-sm font-medium">Live Video</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="flex-1 gap-2 text-muted-foreground hover:bg-transparent hover:text-foreground"
                                    onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
                                >
                                    <Smile className="h-5 w-5 text-yellow-500" />
                                    <span className="text-xs sm:text-sm font-medium">{language === 'vi' ? 'Cảm xúc' : 'Feeling'}</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </DialogTrigger>

                {/* 2. MAIN POST DIALOG */}
                <DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden flex flex-col max-h-[90vh]">
                    <DialogHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
                        <DialogTitle className="text-center text-lg font-bold flex-1">
                            {language === 'vi' ? 'Tạo bài viết' : 'Create Post'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {/* User Info & Privacy */}
                        <div className="flex gap-2 items-center mb-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatar || ""} />
                                <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-semibold text-sm">{user.name}</div>
                                <Button variant="secondary" size="sm" className="h-6 text-[10px] px-2 mt-0.5 font-normal bg-muted">
                                    <Globe className="h-3 w-3 mr-1" />
                                    Public
                                </Button>
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="space-y-3">
                            <input
                                className="w-full bg-transparent border-none focus:outline-none text-lg font-semibold placeholder:text-muted-foreground"
                                placeholder={language === 'vi' ? "Tiêu đề (Tùy chọn)" : "Title (Optional)"}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                autoFocus
                            />

                            <MarkdownEditor
                                value={content}
                                onChange={setContent}
                                placeholder={finalPlaceholder}
                                minHeight="min-h-[150px]"
                            />
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="relative w-full mt-4 border rounded-lg overflow-hidden bg-muted/20">
                                <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-[400px] object-contain" />
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md"
                                    onClick={clearImage}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {/* Add-ons & Settings Container */}
                        <div className="mt-4 border rounded-lg p-3 shadow-sm flex items-center justify-between">
                            <span className="text-sm font-semibold pl-2">
                                {language === 'vi' ? 'Thêm vào bài viết' : 'Add to your post'}
                            </span>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-green-500 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20"
                                    onClick={triggerFileInput}
                                    title="Photo/Video"
                                >
                                    <ImageIcon className="h-5 w-5" />
                                </Button>

                                {/* Emoji Picker Popover */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-yellow-500 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/20" title="Feeling/Activity">
                                            <Smile className="h-5 w-5" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0 border-none" align="end">
                                        <EmojiPicker
                                            onEmojiClick={onEmojiClick}
                                            theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT}
                                            width={320}
                                            height={400}
                                        />
                                    </PopoverContent>
                                </Popover>

                                {/* Min Level Setting (Compact) */}
                                <div className="flex items-center gap-1 ml-2 pl-2 border-l">
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">LV Min:</span>
                                    <input
                                        type="number"
                                        min="0"
                                        max={maxLevel}
                                        value={minLevel}
                                        onChange={(e) => setMinLevel(Math.min(Math.max(0, parseInt(e.target.value) || 0), maxLevel))}
                                        className="w-10 bg-transparent text-center border rounded text-xs py-1 focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-4 border-t bg-background z-10">
                        <Button
                            className="w-full text-base font-semibold py-5"
                            onClick={handleSubmit}
                            disabled={(!content.trim() && !selectedImage && !title.trim()) || isPosting}
                        >
                            {isPosting
                                ? (language === 'vi' ? 'Đang đăng...' : 'Posting...')
                                : (language === 'vi' ? 'Đăng' : 'Post')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Hidden File Input */}
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageSelect}
            />
        </>
    );
}
