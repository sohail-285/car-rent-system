# Car Images Setup Guide

## How to Add Real Car JPG Images

### Step 1: Download Car Images
You need to download actual car images and save them as JPG files in the `frontend/public/images/` folder.

### Required Image Files:
1. `toyota-camry.jpg` - Toyota Camry sedan image
2. `honda-civic.jpg` - Honda Civic sedan image  
3. `bmw-x5.jpg` - BMW X5 SUV image
4. `maruti-swift.jpg` - Maruti Swift hatchback image
5. `hyundai-creta.jpg` - Hyundai Creta SUV image
6. `mahindra-thar.jpg` - Mahindra Thar off-road SUV image

### Step 2: Image Requirements
- **Format:** JPG
- **Size:** 400x250 pixels (recommended)
- **Quality:** High resolution, clear images
- **Background:** Preferably white or transparent

### Step 3: Where to Find Images
1. **Google Images** - Search for each car model
2. **Car Manufacturer Websites**:
   - Toyota.com
   - Honda.com
   - BMW.com
   - Marutisuzuki.com
   - Hyundai.com
   - Mahindra.com
3. **Car Review Sites**:
   - CarDekho.com
   - AutoCar.co.in
   - CarWale.com

### Step 4: Save Images
1. Right-click on the car image
2. Select "Save image as..."
3. Save to: `frontend/public/images/`
4. Name exactly as listed above

### Step 5: Image Optimization (Optional)
- Resize to 400x250 pixels
- Compress to reduce file size
- Remove background if needed

### Example Search Terms:
- "Toyota Camry 2024 white background"
- "Honda Civic sedan side view"
- "BMW X5 SUV official image"
- "Maruti Swift hatchback"
- "Hyundai Creta compact SUV"
- "Mahindra Thar off-road"

### Current Status:
✅ Code updated to use JPG images
⏳ Need to add actual JPG files to `/public/images/` folder

### Fallback:
If images don't load, the system will show colored gradient placeholders with car names.