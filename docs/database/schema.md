# Database Schema Documentation

## Overview
The application uses Supabase (PostgreSQL) as the primary database.

## Key Tables

### `profiles` (User Profiles)
- `id` (uuid, PK): Links to `auth.users`
- `full_name` (text): Display name
- `avatar_url` (text): Profile picture URL
- `role` (text): 'admin' | 'user'
- `xp` (int): Gamification points
- `level` (int): User level (1-5)

### `posts` (Community Posts)
- `id` (uuid, PK): Post ID
- `user_id` (uuid, FK): Author
- `content` (text): Markdown content
- `image_url` (text): Optional attachment
- `created_at` (timestamp): Post time
- `topic` (text): Category ('youtube', 'mmo', 'share') **[New]**
- `status` (text): Moderation status ('approved', 'pending', 'rejected')

### `comments` (Post Comments)
- `id` (uuid, PK): Comment ID
- `post_id` (uuid, FK): Parent post
- `user_id` (uuid, FK): Commenter
- `content` (text): Comment text

### `post_approvals` (Moderation)
- `id` (uuid, PK): Approval ID
- `post_id` (uuid, FK): Post being moderated
- `user_id` (uuid, FK): Voter/Approver

## Migrations

### `20260127_add_topic_to_posts.sql`
Adds the `topic` column to the `posts` table with a CHECK constraint to ensure valid values ('youtube', 'mmo', 'share').
