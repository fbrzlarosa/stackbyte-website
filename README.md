## 🔋 Status Tracker

To keep the "Online/Offline" status updated on the website, you can use the included Node.js script.

### Setup

1. Make sure you have dependencies installed in the root: `npm install`
2. Configure the `.env.local` file with:
   ```env
   STATUS_API_SECRET=your_secret_password
   ```

### Running (Windows/Mac/Linux)

Open a terminal in the project root and run:

```bash
node scripts/tracker.js
```

The script will automatically detect if you're using the computer and send the status to the website.
By default it points to `http://localhost:3000`. For production, set the environment variable:
`TRACKER_API_URL=https://your-site.com/api/status`

### Automatic Execution (Optional)

You can use PM2 or Windows Task Scheduler to start the script on system boot.
