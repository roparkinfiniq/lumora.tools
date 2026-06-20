# Journal Images Folder

Put your journal image files (PNG, JPG, SVG, etc.) in this folder.

## How to use:
Reference the images in your journal files using absolute paths starting with `/images/`.

### Example:
If you place a file named `my-travel.jpg` in this directory:
```typescript
imageUrl: "/images/my-travel.jpg"
```
Or in the post content:
```html
<img src="/images/my-travel.jpg" alt="Travel scenery" />
```
