# 🔐 Git Authentication Fix for VS Code

## 🐛 The Error You're Seeing

```
Authentication failed. Some common reasons include:
- You are not logged in to your account
- You may need to log out and log back in to refresh your token
- You do not have permission to access this repository
- The repository is archived on GitHub
- If you use SSH authentication, check that your key is added to the ssh-agent
- If you use SSH authentication, ensure the host key verification passes
- If you do not use SSH authentication, you might need to use a Personal Access Token
```

## ✅ Solution (3 Methods)

### Method 1: GitHub Authentication in VS Code (Recommended)

#### Step 1: Sign Out and Sign In Again
1. In VS Code, press `Ctrl+Shift+P`
2. Type: `GitHub: Sign Out`
3. Press Enter
4. Then press `Ctrl+Shift+P` again
5. Type: `GitHub: Sign In`
6. Press Enter
7. VS Code will open your browser
8. Sign in to GitHub and authorize VS Code

#### Step 2: Try Pushing Again
- Click the "Sync Changes" button (↻) in the bottom status bar
- Or use Source Control panel and click "Push"

---

### Method 2: Use Personal Access Token (PAT)

#### Step 1: Create a Personal Access Token
1. Go to GitHub: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "VS Code Access"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)

#### Step 2: Configure Git to Use the Token

Open VS Code terminal and run:

```bash
# Set your GitHub username
git config --global user.name "MyTimeToShine777"

# Set your GitHub email
git config --global user.email "your-email@example.com"

# Configure credential helper
git config --global credential.helper manager-core
```

#### Step 3: Push with Token

When VS Code asks for credentials:
- **Username**: `MyTimeToShine777`
- **Password**: `<paste your token here>`

---

### Method 3: Use GitHub CLI (Easiest)

#### Step 1: Install GitHub CLI

**Windows (PowerShell as Administrator):**
```powershell
winget install --id GitHub.cli
```

**Or download from:** https://cli.github.com/

#### Step 2: Authenticate

Open terminal in VS Code and run:
```bash
gh auth login
```

Follow the prompts:
1. Choose: `GitHub.com`
2. Choose: `HTTPS`
3. Choose: `Login with a web browser`
4. Copy the code shown
5. Press Enter (browser opens)
6. Paste the code and authorize

#### Step 3: Test

```bash
gh auth status
```

Should show: ✓ Logged in to github.com

Now VS Code push will work automatically!

---

## 🔧 Quick Fix Commands

Run these in VS Code terminal:

```bash
# 1. Check current remote URL
git remote -v

# 2. Make sure it's using HTTPS (not SSH)
git remote set-url origin https://github.com/MyTimeToShine777/medivoy-backend.git

# 3. Configure Git
git config --global user.name "MyTimeToShine777"
git config --global user.email "your-email@example.com"

# 4. Try to push
git push origin main
```

When prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Your Personal Access Token (NOT your GitHub password)

---

## 🆘 Troubleshooting

### Error: "Support for password authentication was removed"

GitHub no longer accepts passwords. You MUST use:
- Personal Access Token (PAT), OR
- GitHub CLI authentication, OR
- SSH keys

**Solution**: Use Method 2 or Method 3 above.

---

### Error: "Permission denied"

**Cause**: You don't have push access or wrong credentials.

**Solution**:
1. Make sure you're the owner of the repository
2. Check you're using the correct GitHub account
3. Verify your token has `repo` scope

---

### Error: "Could not read from remote repository"

**Cause**: SSH key issues or wrong remote URL.

**Solution**:
```bash
# Switch to HTTPS
git remote set-url origin https://github.com/MyTimeToShine777/medivoy-backend.git

# Try again
git push origin main
```

---

### VS Code Keeps Asking for Credentials

**Solution 1**: Install Git Credential Manager
```bash
# Windows
winget install --id Microsoft.GitCredentialManagerCore
```

**Solution 2**: Use GitHub CLI
```bash
gh auth login
```

**Solution 3**: Store credentials
```bash
git config --global credential.helper store
```

---

## 📝 Step-by-Step: Complete Setup

### 1. Install GitHub CLI (Recommended)
```bash
winget install --id GitHub.cli
```

### 2. Authenticate
```bash
gh auth login
```

### 3. Configure Git
```bash
git config --global user.name "MyTimeToShine777"
git config --global user.email "your-email@example.com"
```

### 4. Verify Remote URL
```bash
git remote -v
```

Should show:
```
origin  https://github.com/MyTimeToShine777/medivoy-backend.git (fetch)
origin  https://github.com/MyTimeToShine777/medivoy-backend.git (push)
```

### 5. Test Push
```bash
git push origin main
```

Should work without asking for credentials!

---

## ✅ Verification

After setup, test these:

```bash
# 1. Check authentication
gh auth status

# 2. Check Git config
git config --global --list

# 3. Check remote URL
git remote -v

# 4. Test push (if you have changes)
git push origin main
```

---

## 🎯 Recommended Solution

**For the easiest experience, use GitHub CLI:**

1. Install: `winget install --id GitHub.cli`
2. Login: `gh auth login`
3. Done! VS Code will work automatically

---

## 📚 Additional Resources

- **GitHub CLI**: https://cli.github.com/
- **Personal Access Tokens**: https://github.com/settings/tokens
- **Git Credential Manager**: https://github.com/git-ecosystem/git-credential-manager

---

## 🔑 Quick Reference

| Method | Pros | Cons |
|--------|------|------|
| **GitHub CLI** | Easiest, automatic | Need to install |
| **Personal Access Token** | Works everywhere | Need to manage tokens |
| **VS Code Sign In** | Built-in | Sometimes needs refresh |

**Recommendation**: Use GitHub CLI for the best experience!

---

**Status**: ✅ Follow any of the 3 methods above

**Easiest**: Method 3 (GitHub CLI)

**Most Common**: Method 2 (Personal Access Token)