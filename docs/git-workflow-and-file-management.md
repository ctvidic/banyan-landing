# Git Workflow and File Management Strategy

## Overview

This project uses a three-tier approach to manage which files are tracked, ignored, or handled specially in git. This setup allows for clean team collaboration while maintaining personal development flexibility.

## The Three Mechanisms

### 1. `.git/info/exclude` - Personal Local Ignores

**Purpose**: Files that should never be committed and are specific to your local development environment.

**Location**: `.git/info/exclude`

**Current Contents**:
```
# Personal development files (never committed, just for me)
.vscode/
docs/
secwets
*.personal
debug-*
```

**Characteristics**:
- ✅ Never affects team members
- ✅ Not tracked in git itself
- ✅ Perfect for personal development files
- ✅ Can't accidentally commit these patterns

**Use Cases**:
- Personal IDE settings (`.vscode/`)
- Development documentation (`docs/`)
- Personal secrets/notes (`secwets`)
- Debug files and personal utilities

### 2. `.gitignore` - Team Shared Ignores

**Purpose**: Files that the entire team should ignore, committed to the repository.

**Location**: `.gitignore`

**Current Contents**:
```bash
# Standard Next.js ignores
/node_modules
/.next/
/out/
/build
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
.env*
.vercel
*.tsbuildinfo
next-env.d.ts

# Local environment
.env.local
.env

# Development files (keep local only) - THESE SHOULD BE MOVED TO EXCLUDE
.vscode/
docs/
secwets
# supabase/  # Commented out because we want supabase in repo

# Skip-worktree managed file
components/ui/calendar.tsx
```

**Note**: Some entries in `.gitignore` should ideally be moved to `.git/info/exclude` since they're personal preferences.

### 3. `git update-index --skip-worktree` - Tracked but Locally Modified

**Purpose**: Files that should remain in the repository but you want to modify locally without those changes being tracked.

**Current Usage**:
```bash
git update-index --skip-worktree components/ui/calendar.tsx
```

**Characteristics**:
- ✅ File remains in repository for team
- ✅ Your local changes are ignored
- ✅ Perfect for files you need to customize locally
- ⚠️ Requires manual management

## Current Strategy Rationale

### Why This Approach?

1. **Personal Development Files** → `.git/info/exclude`
   - Keeps personal tools and documentation private
   - No risk of accidentally committing personal files
   - Doesn't clutter team's `.gitignore`

2. **Supabase Files** → Committed to feature branch
   - Team needs to see the backend implementation
   - Enables collaboration on the waitlist feature
   - Proper version control for production deployment

3. **Modified Library Files** → `skip-worktree`
   - Allows local customization of third-party components
   - Keeps original file in repo for team compatibility
   - Prevents merge conflicts from personal modifications

## Setup Instructions

### For New Team Members

1. **Set up personal excludes**:
   ```bash
   # Add personal ignore patterns
   echo ".vscode/" >> .git/info/exclude
   echo "docs/" >> .git/info/exclude
   echo "secwets" >> .git/info/exclude
   echo "*.personal" >> .git/info/exclude
   echo "debug-*" >> .git/info/exclude
   ```

2. **Skip worktree for customized files** (if needed):
   ```bash
   git update-index --skip-worktree components/ui/calendar.tsx
   ```

3. **Verify setup**:
   ```bash
   # Check what's being ignored
   git status
   
   # Check skip-worktree files
   git ls-files -v | grep ^S
   ```

## Common Operations

### Adding Personal Files
```bash
# These automatically ignored via .git/info/exclude
touch secwets/my-notes.md
touch debug-test.js
mkdir .vscode && touch .vscode/settings.json
```

### Managing Skip-Worktree Files
```bash
# Check which files are skip-worktree
git ls-files -v | grep ^S

# Remove skip-worktree (to commit changes)
git update-index --no-skip-worktree components/ui/calendar.tsx

# Re-add skip-worktree (after committing)
git update-index --skip-worktree components/ui/calendar.tsx

# Update skip-worktree file from remote
git update-index --no-skip-worktree components/ui/calendar.tsx
git pull
git update-index --skip-worktree components/ui/calendar.tsx
```

### Cleaning Up .gitignore

The current `.gitignore` has some personal patterns that should be moved:

**Should be moved to `.git/info/exclude`**:
- `.vscode/` (personal IDE settings)
- `docs/` (personal development docs)
- `secwets` (personal secrets)

**Should stay in `.gitignore`**:
- `node_modules/`, `.next/`, etc. (standard Next.js)
- `.env*` (sensitive environment files)
- `components/ui/calendar.tsx` (skip-worktree managed)

## Best Practices

### ✅ Do's
- Use `.git/info/exclude` for personal development files
- Commit team-relevant infrastructure (like `supabase/` folder)
- Document skip-worktree usage for team awareness
- Keep `.gitignore` focused on team-wide ignores

### ❌ Don'ts
- Don't put personal preferences in team `.gitignore`
- Don't forget to document skip-worktree files
- Don't commit personal secrets or development tools
- Don't remove skip-worktree without understanding impact

## Current Project State

### Branch Strategy
- `main` - Production-ready code
- `feature/supabase-waitlist` - Supabase implementation
- Personal development files ignored locally

### File Management
- **Committed**: Supabase functions, frontend updates, environment examples
- **Locally Ignored**: Personal docs, IDE settings, debug files
- **Skip-Worktree**: Customized UI components

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - In production environment
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - In production environment
- `RESEND_API_KEY` - In Supabase Edge Function secrets

## Troubleshooting

### "Files keep appearing in git status"
Check if they should be in `.git/info/exclude` instead of `.gitignore`.

### "Can't commit skip-worktree file changes"
```bash
git update-index --no-skip-worktree <file>
# make changes and commit
git update-index --skip-worktree <file>
```

### "Team member can't see my development setup"
That's by design! Personal development files should remain personal.

## Related Documentation
- `supabase-resend-setup.md` - Supabase and Resend configuration
- `implementation-steps.md` - Step-by-step implementation guide 