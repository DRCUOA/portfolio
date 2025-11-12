# How to Use Local Screenshots

## Quick Start

1. **Place your images** in the `frontend/public/screenshots/` directory
2. **Organize by project** (optional but recommended)
3. **Use relative paths** starting with `/screenshots/` in the project form

## Example

### Step 1: Add Images to Public Folder

```
frontend/public/screenshots/
  └── my-awesome-app/
      ├── screenshot1.png
      ├── screenshot2.png
      └── screenshot3.jpg
```

### Step 2: Use Paths in Project Form

In the "Screenshots" field of the Project Form, enter:

```
/screenshots/my-awesome-app/screenshot1.png
/screenshots/my-awesome-app/screenshot2.png
/screenshots/my-awesome-app/screenshot3.jpg
```

### Step 3: How It Works

- Files in `frontend/public/` are served at the root URL
- `/screenshots/...` paths resolve to `frontend/public/screenshots/...`
- Works in both development (`npm run dev`) and production (`npm run build`)

## Path Examples

### ✅ Correct Local Paths
```
/screenshots/project1/img1.png
/screenshots/project1/img2.jpg
/screenshots/project2/screenshot.png
```

### ❌ Incorrect Paths
```
screenshots/project1/img1.png          (missing leading slash)
frontend/public/screenshots/img1.png  (too specific)
file:///path/to/image.png              (file:// URLs don't work in browsers)
C:\Users\...\image.png                 (absolute file paths don't work)
```

## Mixing Local and Remote URLs

You can mix local and remote URLs:

```
/screenshots/my-project/local1.png
https://example.com/remote-screenshot.png
/screenshots/my-project/local2.png
https://cdn.example.com/another-image.jpg
```

## Tips

- **Organize by project**: Create subdirectories for each project
- **Use descriptive names**: `screenshot1.png` is less clear than `home-screen.png`
- **Optimize images**: Compress images before adding them for better performance
- **Supported formats**: PNG, JPG, JPEG, GIF, WebP, SVG

