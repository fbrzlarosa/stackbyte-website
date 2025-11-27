# 🪟 Windows Status Tracker Setup

This guide will help you configure the Status Tracker to automatically start on every Windows system reboot.

## 📋 Prerequisites

1. **Node.js installed** - Make sure Node.js is installed and available in PATH
2. **Dependencies installed** - Run `npm install` in the project root
3. **`.env.local` file** - Make sure you have the `.env.local` file with the required variables:
   ```
   TRACKER_API_URL=https://your-domain.com/api/status
   STATUS_API_SECRET=your_secret
   ```

## 🚀 Method 1: PowerShell Script (Recommended)

### Step 1: Open PowerShell as Administrator

1. Press `Win + X`
2. Select "Windows PowerShell (Administrator)" or "Terminal (Administrator)"
3. Confirm privilege elevation

### Step 2: Run the setup script

Navigate to the project folder and run:

```powershell
cd C:\Users\YourUser\Workspace\stackbyte-website
.\scripts\setup-windows-autostart.ps1
```

The script will:

- ✅ Create a scheduled task named `StackbyteStatusTracker`
- ✅ Configure automatic startup when the PC boots
- ✅ Set the task to run even if the PC is on battery
- ✅ Require network connection

### Step 3: Verify

Open **Task Scheduler** (`taskschd.msc`) and search for `StackbyteStatusTracker` in the library. You should see the configured task.

## 🧪 Manual Testing

### Manual tracker startup

You can test the tracker manually in three ways:

**Option 1: npm script**

```bash
npm run tracker
```

**Option 2: Batch script**

```bash
.\scripts\start-tracker.bat
```

**Option 3: Direct command**

```bash
node scripts/tracker.js
```

### Test the scheduled task

To test the task without restarting the PC:

```powershell
Start-ScheduledTask -TaskName "StackbyteStatusTracker"
```

## 🔧 Task Management

### View task status

```powershell
Get-ScheduledTask -TaskName "StackbyteStatusTracker"
```

### Temporarily disable

```powershell
Disable-ScheduledTask -TaskName "StackbyteStatusTracker"
```

### Re-enable

```powershell
Enable-ScheduledTask -TaskName "StackbyteStatusTracker"
```

### Remove the task

```powershell
Unregister-ScheduledTask -TaskName "StackbyteStatusTracker" -Confirm:$false
```

## 📝 Important Notes

- The tracker starts **automatically** on every system reboot
- The tracker checks status every **30 seconds** (configurable in `tracker.js`)
- If the PC is idle for more than **5 minutes**, the status becomes "offline"
- The tracker requires an active internet connection to work

## 🐛 Troubleshooting

### Tracker doesn't start

1. Verify Node.js is in PATH:

   ```powershell
   node --version
   ```

2. Verify dependencies are installed:

   ```bash
   npm install
   ```

3. Check task logs in Task Scheduler:
   - Open Task Scheduler
   - Find `StackbyteStatusTracker`
   - Click "Run" to see any errors

### Tracker doesn't connect to API

1. Verify the `.env.local` file exists and contains correct variables
2. Verify the API URL is reachable:
   ```powershell
   Invoke-WebRequest -Uri "https://your-domain.com/api/status" -Method GET
   ```

### Task doesn't start on boot

1. Verify the task is enabled in Task Scheduler
2. Check that the user has necessary permissions
3. Verify the script path is correct

## 📚 References

- [Task Scheduler Documentation](https://docs.microsoft.com/en-us/windows/win32/taskschd/task-scheduler-start-page)
- [PowerShell Scheduled Tasks](https://docs.microsoft.com/en-us/powershell/module/scheduledtasks/)
