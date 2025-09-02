# StudyMate Frontend

A modern React frontend for the StudyMate application built with Vite, TailwindCSS, and React Router.

## 🚀 Features

- **Modern React**: Built with React 18 and Vite for fast development
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Routing**: Client-side routing with React Router
- **Component Architecture**: Modular and reusable components
- **Beautiful UI**: Clean and modern interface with custom styling

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The application will start on `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── Layout.jsx     # Main layout component
│   │   └── Sidebar.jsx    # Navigation sidebar
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx  # Dashboard page
│   │   ├── Tasks.jsx      # Tasks management page
│   │   └── Settings.jsx   # Settings page
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles with TailwindCSS
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # TailwindCSS configuration
└── postcss.config.js      # PostCSS configuration
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6) - Used for buttons, links, and accents
- **Gray Scale**: Various shades for text, backgrounds, and borders
- **Status Colors**: Green (success), Yellow (warning), Red (error)

### Components
- **Buttons**: Primary and secondary button styles
- **Cards**: White background with subtle shadows and borders
- **Navigation**: Responsive sidebar with active states
- **Forms**: Consistent input styling with focus states

## 🔌 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Pages

### Dashboard (`/dashboard`)
- Welcome message
- Quick statistics (completed tasks, pending tasks, study hours)
- Recent activity feed

### Tasks (`/tasks`)
- Task list with status and priority indicators
- Filter options (All, Pending, In Progress, Completed)
- Add new task functionality (placeholder)

### Settings (`/settings`)
- Profile settings (name, email, profile picture)
- Notification preferences
- Study preferences (session duration, breaks, theme)

## 🎯 Key Features

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile devices
- Responsive grid layouts

### Navigation
- Persistent sidebar navigation
- Active state indicators
- Breadcrumb-style navigation

### Interactive Elements
- Hover effects on buttons and cards
- Smooth transitions and animations
- Form controls with proper focus states

## 🔧 Customization

### TailwindCSS Configuration
The project uses a custom TailwindCSS configuration with:
- Custom primary color palette
- Responsive breakpoints
- Custom component classes

### Styling
- Global styles in `src/index.css`
- Component-specific styles using TailwindCSS classes
- Custom CSS components for buttons, navigation, etc.

## 🚀 Development

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add the route in `src/App.jsx`
3. Add navigation link in `src/components/Sidebar.jsx`

### Adding New Components
1. Create component in `src/components/`
2. Import and use in pages as needed
3. Follow existing naming conventions

### Styling Guidelines
- Use TailwindCSS utility classes
- Create custom components for repeated patterns
- Maintain consistent spacing and typography

## 📦 Build and Deploy

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

The built files will be in the `dist/` directory.

## 🔗 Backend Integration

This frontend is designed to work with the StudyMate backend API. To connect:

1. Ensure the backend is running on `http://localhost:5000`
2. Update API endpoints in components as needed
3. Handle CORS configuration on the backend

## 📄 License

MIT License
