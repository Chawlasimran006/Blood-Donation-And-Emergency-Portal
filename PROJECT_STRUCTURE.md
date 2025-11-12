# Project Structure Update - November 2025

## ✅ Folder Reorganization Complete

The Blood Donation Portal project has been reorganized into a cleaner folder structure:

### New Folder Structure

```
FEE-II/
├── html/           # All HTML files
│   ├── about.html
│   ├── Contact.html
│   ├── donate.html
│   ├── donation.html (main homepage)
│   ├── drive.html
│   ├── FAQs.html
│   ├── find-center.html
│   ├── login.html
│   ├── sign.html
│   └── why-donate.html
│
├── css/            # All CSS files
│   ├── about.css
│   ├── chatbot.css
│   ├── Contact.css
│   ├── donate.css
│   ├── donation.css
│   ├── faqs.css
│   └── find-center.css
│
├── js/             # All JavaScript files
│   ├── chatbot.js
│   ├── Contact.js
│   ├── donate.js
│   ├── donation.js
│   └── find-center.js
│
├── Images (root)   # Images remain in root
│   ├── favicon1.ico
│   ├── hero-right.png
│   ├── img1.jpg
│   ├── img2.jpg
│   ├── procedure.png
│   ├── reyan.jpeg
│   ├── ritika.jpeg
│   ├── rohan.jpeg
│   └── simran.jpeg
│
└── Other files
    ├── team.json
    ├── README.md
    └── CHATBOT_SETUP.md
```

## Path Updates Made

### 1. HTML Files (in html/ folder)
All HTML files now reference resources with `../` to go back to parent directory:

- **CSS:** `<link rel="stylesheet" href="../css/donation.css">`
- **JS:** `<script src="../js/donation.js"></script>`
- **Images:** `<link rel="icon" href="../favicon1.ico">`
- **JSON:** `fetch('../team.json')`

### 2. CSS Files (in css/ folder)
Updated image paths to use `../` prefix:

- `background-image: url('../img2.jpg');`
- `background-image: url('../procedure.png');`

### 3. Team JSON
Updated team member image paths:

```json
{
  "image": "../ritika.jpeg"
}
```

## How to Access the Website

### Option 1: Direct File Access
Open any HTML file from the `html/` folder:
- **Homepage:** `html/donation.html`
- **About:** `html/about.html`
- **Find Drive:** `html/drive.html`

### Option 2: Local Server (Recommended)
Use a local web server for better testing:

```powershell
# Using Python
cd "c:\Users\IRFAN\Desktop\FEE-II"
python -m http.server 8000

# Then open: http://localhost:8000/html/donation.html
```

```powershell
# Using Node.js (if installed)
cd "c:\Users\IRFAN\Desktop\FEE-II"
npx http-server

# Then open: http://localhost:8080/html/donation.html
```

## Benefits of New Structure

✅ **Better Organization**
- Separate folders for HTML, CSS, and JavaScript
- Easier to locate and maintain files

✅ **Professional Structure**
- Industry-standard folder organization
- Makes collaboration easier

✅ **Cleaner Root Directory**
- Only essential files in root
- Images and data files grouped logically

✅ **Easier Deployment**
- Clear separation of concerns
- Simple to configure build tools if needed

## Important Notes

### Inline Styles Kept
Files like `sign.html` and `login.html` have inline CSS/JS - these were kept as-is per requirements.

### Images Location
All images remain in the root directory for easier access across multiple folders.

### Navigation Links
All internal HTML links updated to work within the `html/` folder structure.

## Testing Checklist

- [x] Homepage loads correctly (donation.html)
- [x] CSS styles apply properly
- [x] JavaScript functionality works
- [x] Images display correctly
- [x] Navigation between pages works
- [x] Chatbot loads and functions
- [x] Team member images show on About page
- [x] Forms submit properly
- [x] Mobile responsive design intact

## If Something Doesn't Work

### Images Not Showing?
Check that image paths in CSS use `../` prefix:
```css
background-image: url('../image.jpg');
```

### CSS Not Loading?
Verify link tags use correct path:
```html
<link rel="stylesheet" href="../css/yourfile.css">
```

### JavaScript Errors?
Check script tags:
```html
<script src="../js/yourfile.js"></script>
```

### Navigation Not Working?
Update links to include folder:
```html
<a href="about.html">About</a>  <!-- Correct (same folder) -->
<a href="../index.html">Home</a>  <!-- If linking outside html/ -->
```

## Next Steps (Optional Improvements)

1. **Create an assets folder** for images
2. **Add a dist/ folder** for production builds
3. **Set up a build process** (Webpack, Gulp, etc.)
4. **Add source maps** for easier debugging
5. **Minify CSS/JS** for production

---

**Updated:** November 12, 2025
**Status:** ✅ Complete and Tested
