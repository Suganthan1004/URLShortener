# URL Shortener Frontend

A modern React + Vite frontend for the URL Shortener with Analytics System (USAS).

## 📋 Overview

This frontend application provides:
- **URL Shortening**: Submit long URLs and receive shortened links with unique short codes
- **Analytics Dashboard**: View comprehensive click statistics and history
- **Real-time Tracking**: Monitor clicks, timestamps, and optional IP addresses
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🎨 Features

### 1. URL Shortener Page
- Input form for long URLs with real-time validation
- Copy-to-clipboard functionality for shortened URLs
- Instant short code generation using Base62 encoding (backend)
- Quick stats showing total clicks
- "How It Works" guide with step-by-step instructions

### 2. Analytics Dashboard
- **Summary Statistics**: 
  - Total shortened URLs
  - Total clicks across all URLs
  - Last 24-hour click count
  - Per-URL click count
- **URL Management**: 
  - List of all shortened URLs
  - Click counts per URL
  - Original URL display
  - Creation timestamps
- **Click History**:
  - Detailed click log with timestamps
  - IP address tracking (optional)
  - Sortable and scrollable interface
  - Per-URL click analysis

### 3. Navigation & UX
- Sticky header with navigation buttons
- Smooth page transitions
- Active page highlighting
- Responsive layout for all screen sizes
- Professional gradient design with purple/blue theme

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The frontend will run on `http://localhost:5173` by default.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── URLShortener.jsx      # URL shortening form and display
│   │   └── Analytics.jsx          # Analytics dashboard
│   ├── styles/
│   │   ├── URLShortener.css       # Shortener component styles
│   │   └── Analytics.css          # Analytics component styles
│   ├── App.jsx                    # Main application wrapper
│   ├── App.css                    # Global application styles
│   ├── index.css                  # Base styles
│   ├── main.jsx                   # React entry point
│   └── assets/                    # Static assets
├── public/                        # Public assets
├── .env.example                   # Environment variables template
├── package.json                   # Dependencies
├── vite.config.js                # Vite configuration
└── eslint.config.js              # ESLint configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Backend API endpoint
VITE_API_BASE_URL=http://localhost:8080/api

# Frontend URL (used for displaying shortened URLs)
VITE_APP_URL=http://localhost:5173
```

## 🔌 API Integration

The frontend communicates with the backend via RESTful APIs:

### Endpoints Used

#### 1. Shorten URL
```
POST /api/urls/shorten
Body: { "longUrl": "https://example.com/..." }
Response: { "id": 1, "shortCode": "Ab3Xy9", "longUrl": "...", "totalClicks": 0, "createdAt": "..." }
```

#### 2. Get All URL Stats
```
GET /api/urls/stats
Response: [{ "id": 1, "shortCode": "Ab3Xy9", "longUrl": "...", "totalClicks": 5, "createdAt": "..." }, ...]
```

#### 3. Get Click History
```
GET /api/urls/{urlId}/clicks
Response: [{ "id": 1, "clickedAt": "2026-02-24T10:30:45Z", "ipAddress": "192.168.1.1" }, ...]
```

## 🎨 Component Architecture

### URLShortener Component
- **Props**: None (manages internal state)
- **State**:
  - `longUrl`: User input URL
  - `shortenedUrl`: Server response with short code
  - `loading`: API call status
  - `error`: Error messages
  - `copied`: Copy button feedback

### Analytics Component
- **Props**: None (manages internal state)
- **State**:
  - `urlStats`: Array of all shortened URLs
  - `selectedUrlId`: Currently selected URL
  - `clickHistory`: Click history for selected URL
  - `loading`: Page loading state
  - `historyLoading`: History fetch state

## 🎯 Key Features Explained

### URL Validation
- Uses browser's native `URL()` constructor
- Validates before sending to backend
- Provides user-friendly error messages

### Click Tracking
- Displays total clicks per URL
- Calculates last 24-hour clicks client-side
- Shows detailed click history with timestamps and IPs

### Copy to Clipboard
- One-click copy of full shortened URL
- Visual feedback with checkmark
- Auto-reset after 2 seconds

### Analytics Filtering
- Last 24-hour analytics with client-side filtering
- Dynamically calculated from click history
- Real-time updates when fetching new data

## 📱 Responsive Breakpoints

- **Desktop**: Full layout with sidebar
- **Tablet (≤1024px)**: Single column layout
- **Mobile (≤768px)**: Optimized touch interface
- **Small Mobile (≤480px)**: Compact layout

## 🎨 Design System

### Colors
- **Primary Gradient**: `#667eea` to `#764ba2`
- **Background**: `#f5f7fa`
- **Text Dark**: `#333`
- **Text Light**: `#666`
- **Border**: `#e0e4e8`
- **Success**: `#34c759`
- **Error**: `#ff3b30`

### Typography
- **Font**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Headings**: Bold, letter-spaced
- **Code**: Courier New, monospace

## 🧪 Testing Notes

### Manual Testing Checklist
- [ ] Form validation (empty, invalid URLs)
- [ ] API connectivity (backend running)
- [ ] Copy to clipboard functionality
- [ ] Analytics data loading
- [ ] Last 24-hour calculation accuracy
- [ ] Responsive design across devices
- [ ] Error handling and user feedback
- [ ] Navigation between pages

## 🚀 Performance Optimization

- Lazy loading of components
- Efficient state management
- Debounced API calls
- Optimized CSS with minimal repaints
- Smooth animations (60fps)
- Responsive image loading

## 🔒 Security Notes

- URL validation before submission
- No localStorage of sensitive data
- CORS-compatible API calls
- XSS protection via React's built-in escaping
- Input sanitization

## 📦 Dependencies

- **React**: UI library
- **Vite**: Build tool and dev server
- **ESLint**: Code quality

See `package.json` for full dependency list.

## 🐛 Troubleshooting

### Backend Connection Failed
- Ensure backend is running on configured `VITE_API_BASE_URL`
- Check CORS configuration on backend
- Verify `.env` file has correct API URL

### No Analytics Data
- Create a shortened URL first
- Access the short URL to generate clicks
- Wait for backend to update stats
- Click "Refresh Data" button

### Copy to Clipboard Not Working
- Check browser permissions for clipboard access
- Verify HTTPS for production (some browsers require it)
- Use supported browsers (Chrome 63+, Firefox 53+, Safari 13+)

## 📚 Usage Examples

### Creating a Shortened URL
1. Navigate to "Shorten URL" tab
2. Enter a long URL
3. Click "Shorten URL" button
4. Copy the shortened URL
5. Share as needed

### Viewing Analytics
1. Navigate to "Analytics" tab
2. Select a URL from the list
3. View total clicks and 24-hour stats
4. Examine detailed click history
5. Click "Refresh Data" to update

## 📝 Future Enhancements

- [ ] Custom short codes
- [ ] Geo-location analytics
- [ ] Advanced filtering and search
- [ ] Export analytics to CSV
- [ ] QR code generation
- [ ] Link expiration settings
- [ ] User authentication
- [ ] Dark mode theme
- [ ] Real-time analytics updates
- [ ] Browser/device tracking

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Contributing

Contributions are welcome! Please follow the existing code style and component structure.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review component documentation
3. Check browser console for errors
4. Verify backend API is running

---

**URL Shortener © 2026** | Built with React + Vite
