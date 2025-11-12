# Screenshots Directory

Place your project screenshots in this directory. You can organize them by project name.

## Example Structure

```
screenshots/
  ├── my-project/
  │   ├── screenshot1.png
  │   ├── screenshot2.png
  │   └── screenshot3.jpg
  └── another-project/
      ├── img1.png
      └── img2.png
```

## Usage in Project Form

When adding screenshots to a project, use paths relative to the public folder:

- `/screenshots/my-project/screenshot1.png`
- `/screenshots/my-project/screenshot2.png`
- `/screenshots/another-project/img1.png`

These paths will work in both development and production builds.

## Notes

- Files in the `public` folder are served at the root URL path
- Use forward slashes `/` in paths (not backslashes)
- Supported image formats: PNG, JPG, JPEG, GIF, WebP, SVG

