# MongoDB Setup Guide for Windows

## Quick Installation Steps

### Method 1: MongoDB Community Server (Recommended for Local Development)

1. **Download MongoDB:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows
   - Version: Latest (7.0 or higher)
   - Package: MSI

2. **Install MongoDB:**
   - Run the downloaded MSI file
   - Choose "Complete" installation
   - Install MongoDB as a Service (check the box)
   - Install MongoDB Compass (optional GUI tool)

3. **Verify Installation:**
   ```cmd
   mongod --version
   ```

4. **Start MongoDB Service:**
   ```cmd
   net start MongoDB
   ```

5. **Test Connection:**
   ```cmd
   cd "c:\Users\Varsha L H\Desktop\CAR RENT SYSTEM\backend"
   node test-connection.js
   ```

### Method 2: MongoDB Atlas (Cloud - No Installation Required)

1. **Create Account:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create Cluster:**
   - Choose FREE tier (M0)
   - Select region closest to you
   - Click "Create Cluster"

3. **Setup Access:**
   - Create database user (username + password)
   - Add IP address: 0.0.0.0/0 (allow from anywhere)

4. **Get Connection String:**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password

5. **Update Backend:**
   Edit `backend/server.js`:
   ```javascript
   mongoose.connect("mongodb+srv://username:password@cluster.mongodb.net/car_rent")
   ```

### Method 3: Docker (If Docker Desktop is Installed)

```cmd
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Troubleshooting

### MongoDB Service Won't Start:
```cmd
# Create data directory
mkdir C:\data\db

# Start manually
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

### Port 27017 Already in Use:
```cmd
# Check what's using the port
netstat -ano | findstr :27017

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

## After MongoDB is Running

1. **Start Backend:**
   ```cmd
   cd "c:\Users\Varsha L H\Desktop\CAR RENT SYSTEM\backend"
   node server.js
   ```
   Expected output:
   ```
   ✅ MongoDB Connected
   🚗 Server running on port 5000
   ```

2. **Start Frontend (New Terminal):**
   ```cmd
   cd "c:\Users\Varsha L H\Desktop\CAR RENT SYSTEM\frontend"
   npm start
   ```

3. **Access Application:**
   - Browser will open automatically at: http://localhost:3000
   - Or manually open: http://localhost:3000

## Verification Checklist

- [ ] MongoDB installed/running
- [ ] Backend starts without errors
- [ ] Frontend opens in browser
- [ ] Can submit booking form
- [ ] Bookings appear in table
- [ ] Data persists after refresh

## Need Help?

If you encounter issues:
1. Check MongoDB is running: `sc query MongoDB`
2. Check port 27017: `netstat -an | findstr :27017`
3. Check backend logs for errors
4. Verify connection string is correct
