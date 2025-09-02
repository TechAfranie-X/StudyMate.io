# 🚀 Frontend Quick Start Guide

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## 🛠️ Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

3. **Build for Production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/            # Base UI components (Button, Input, etc.)
│   ├── Layout.jsx     # Main layout with sidebar + top nav
│   ├── Sidebar.jsx    # Navigation sidebar
│   ├── TopNav.jsx     # Top navigation bar
│   └── ...            # Other components
├── pages/              # Page components
│   ├── Dashboard.jsx  # Main dashboard
│   ├── Tasks.jsx      # Task management
│   └── Settings.jsx   # User settings
├── context/            # React contexts
│   └── ThemeContext.jsx # Theme management
├── hooks/              # Custom React hooks
│   ├── useLocalStorage.js
│   ├── useApi.js
│   └── useDebounce.js
├── utils/              # Utility functions
│   └── api.js         # API connection layer
└── App.jsx            # Main app component
```

## 🎨 Key Features

### ✅ Dark/Light Mode
- Toggle in top navigation
- Persistent across sessions
- System preference detection

### ✅ Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-optimized interactions

### ✅ Component Library
- Reusable UI components
- Consistent design system
- Tailwind CSS styling

### ✅ API Integration
- Centralized API layer
- Authentication handling
- Error management

## 🔧 Development

### Adding New Components
1. Create component in `src/components/`
2. Use Tailwind classes for styling
3. Implement dark mode support with `dark:` classes
4. Add to component exports if needed

### Adding New Pages
1. Create page in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation item in `src/components/Sidebar.jsx`

### Custom Hooks
- `useLocalStorage` - Persistent state
- `useApi` - API call management
- `useDebounce` - Debounced values

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Next Steps

The frontend structure is complete and ready for:
- Enhanced user experience features
- Performance optimizations
- Testing implementation
- Additional premium features

## 🐛 Troubleshooting

### Build Errors
- Ensure all imports are correct
- Check for missing exports
- Verify PostCSS configuration

### Development Server Issues
- Clear node_modules and reinstall
- Check port conflicts
- Verify file paths

### Styling Issues
- Ensure Tailwind classes are correct
- Check dark mode implementation
- Verify CSS imports

## 📚 Resources

- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)


