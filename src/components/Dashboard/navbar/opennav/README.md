# OpenNav - Responsive Sidebar Navigation Component

A fully responsive sidebar navigation component with smooth slide-in/slide-out animations, built with React and pure CSS (no Tailwind).

## Features

✅ **Smooth Animations**
- Hamburger menu animates to X when open
- Sidebar slides in from left with cubic-bezier easing
- Overlay fades in/out smoothly

✅ **Responsive Design**
- Works on desktop (1024px+), tablet (768px-1024px), and mobile (< 768px)
- Sidebar width: 250px (desktop/tablet), 280px (mobile)
- Toggle button always visible and accessible

✅ **Accessibility**
- ARIA labels and roles for screen readers
- Keyboard focus visible indicators
- Semantic HTML structure

✅ **User Experience**
- Clicking overlay closes sidebar
- Close button in header for easy closing
- Menu items automatically close sidebar after selection
- CSS transitions (no janky JavaScript animations)

✅ **Theming**
- Uses CSS variables (--bg-dark, --accent, etc.)
- Respects the global theme system
- Changes dynamically when theme changes in Settings

## Component Files

```
src/components/Dashboard/navbar/opennav/
├── Sidebar.jsx          (React component with state management)
├── Sidebar.css          (All styling and animations)
└── README.md            (This file)
```

## Usage

### Import the Component

```jsx
import Sidebar from './navbar/opennav/Sidebar'

export default function Dashboard() {
  const handleMenuClick = (action) => {
    console.log('Menu item clicked:', action)
    // Handle navigation based on action:
    // 'home', 'settings', 'support', 'account'
  }

  return (
    <div>
      <Sidebar onMenuClick={handleMenuClick} />
      {/* Rest of your content */}
    </div>
  )
}
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `onMenuClick` | function | Callback when menu item is clicked. Receives action ID. |

## Component Structure

```jsx
// Sidebar State
const [isOpen, setIsOpen] = useState(false)

// Functions
toggleSidebar()           // Toggle open/close
closeSidebar()           // Force close
handleMenuItemClick()    // Handle menu clicks

// UI Sections
1. Hamburger Toggle Button (always visible)
2. Overlay Backdrop (click to close)
3. Sidebar Container
   - Header (title + close button)
   - Navigation Menu (4 items)
   - Footer (version info)
```

## Animation Details

### Hamburger Icon Animation
- **Line 1**: Rotates 45° and translates
- **Line 2**: Fades out
- **Line 3**: Rotates -45° and translates

### Sidebar Slide Animation
- **Closed**: `translateX(-250px)`
- **Open**: `translateX(0)`
- **Duration**: 400ms
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (smooth ease-out)

### Overlay Fade
- Fades in/out in 300ms
- Opacity: 0 → 1
- Click to close

## Menu Items

The sidebar includes 4 menu items:
1. 🏠 **Home** - Navigate to dashboard home
2. ⚙️ **Settings** - Open settings page
3. ❓ **Support** - Open support page
4. 👤 **Account** - Open account page

Each item has:
- Hover effect (background color change, left border indicator)
- Active state (highlighted)
- Focus visible outline for keyboard navigation
- Automatic sidebar close after selection

## Styling with CSS Variables

The component uses theme CSS variables for dynamic theming:

```css
--bg-dark                 /* Main background */
--bg-dark-secondary       /* Secondary background */
--text-primary           /* Primary text color */
--text-secondary         /* Secondary text color */
--accent                 /* Primary accent (green) */
--accent-cyan            /* Cyan accent */
```

When you change the theme in Settings, the sidebar automatically updates!

## Responsive Breakpoints

### Desktop (1024px+)
- Sidebar width: 250px
- Toggle button: 50px × 50px
- No visible close button (use toggle to close)

### Tablet (768px - 1024px)
- Sidebar width: 250px
- Toggle button: 44px × 44px
- Close button visible in header

### Mobile (< 768px)
- Sidebar width: 280px (wider for touch)
- Toggle button: 40px × 40px
- Close button visible in header

## Z-Index Stack

```
999  ← Toggle Button (always on top)
998  ← Overlay Backdrop
997  ← Sidebar Container
```

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## Integration with Dashboard

The sidebar can be integrated into:
1. **DashboardPage.jsx** - Main dashboard layout
2. **Dashboard.jsx** - Individual page containers
3. **Any layout component** - Universal navigation

### Example Integration

```jsx
// In DashboardPage.jsx
import Sidebar from './navbar/opennav/Sidebar'

export default function DashboardPage() {
  const handleMenuClick = (action) => {
    switch(action) {
      case 'home':
        navigate('')
        break
      case 'settings':
        navigate('settings')
        break
      case 'account':
        navigate('account')
        break
      case 'support':
        // Handle support navigation
        break
    }
  }

  return (
    <div>
      <Sidebar onMenuClick={handleMenuClick} />
      {/* Page content */}
    </div>
  )
}
```

## Performance

- ✅ Uses CSS transitions (GPU accelerated)
- ✅ Minimal JavaScript (state only)
- ✅ No layout thrashing
- ✅ Smooth 60fps animations

## Customization

To customize the sidebar, edit:

1. **Menu Items** - Modify `menuItems` array in Sidebar.jsx
2. **Colors** - Change CSS variables in ThemeContext.jsx
3. **Width** - Adjust `width: 250px` in Sidebar.css
4. **Animation Speed** - Change `transition: transform 0.4s`
5. **Icons** - Replace emoji in menu items

## Troubleshooting

**Sidebar not closing on mobile?**
- Ensure overlay is clickable and has z-index: 998

**Hamburger icon animation jumpy?**
- Check CSS transitions are applied to all `.line` elements

**Theme not applying?**
- Ensure CSS variables are set in root `:root` selector

**Sidebar hidden behind other content?**
- Check z-index values in your layout components
