# Orbitta Mobile Application

## Project Overview

Orbitta is a comprehensive mobile application built with Ionic, Angular, and Capacitor. The application is designed to provide a seamless cross-platform experience for both Android and iOS devices, leveraging modern web technologies combined with native device capabilities.

## Table of Contents

- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Development Workflow](#development-workflow)
- [Build and Deployment](#build-and-deployment)
- [Authentication](#authentication)
- [Environment Access](#environment-access)
- [Testing](#testing)
- [Contributing](#contributing)

## Architecture

Orbitta follows a modular architecture based on Angular best practices with the following key architectural components:

- **Presentation Layer**: Ionic components and Angular modules organized by feature
- **Business Logic Layer**: Services and utilities handling core application logic
- **Data Access Layer**: API communication services and local storage management
- **State Management**: Reactive state handling with RxJS
- **Security Layer**: Encryption and secure data handling with crypto-js

## Technology Stack

- **Frontend Framework**: Angular 16.x with Ionic 7.x
- **Mobile Framework**: Capacitor 5.x
- **State Management**: RxJS
- **CSS Framework**: SCSS
- **Programming Language**: TypeScript
- **Testing Framework**: Jest

## Project Structure

```
/
├── android/                 # Android platform-specific code
├── ios/                     # iOS platform-specific code
├── src/                     # Application source code
│   ├── app/                 # Angular application code
│   │   ├── components/      # Shared UI components
│   │   ├── directives/      # Custom Angular directives
│   │   ├── guards/          # Route guards for authentication
│   │   ├── models/          # TypeScript interfaces and types
│   │   ├── pages/           # Page components (routes)
│   │   ├── pipes/           # Custom Angular pipes
│   │   ├── services/        # Shared services
│   │   ├── tabs/            # Tab-based navigation components
│   │   ├── util/            # Utility functions
│   │   └── db/              # Data access layer
│   │       └── queries/     # Database queries
│   ├── assets/              # Static assets (images, fonts, etc.)
│   ├── environments/        # Environment configuration
│   └── theme/               # Global styling and theming
├── resources/               # App icon and splash screen resources
├── scripts/                 # Build and deployment scripts
└── icons/                   # Application icons
```

## Environment Setup

### Prerequisites

- Node.js (v16+)
- npm (v8+)
- Ionic CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Docker (optional, for containerization)

### Installation

```bash
# Install dependencies
npm install

# Install Ionic CLI globally
npm install -g @ionic/cli

# Set up Capacitor
npx cap init
```

## Development Workflow

### Starting the Development Server

```bash
npm start
```

### Adding Native Functionality

```bash
# Add a Capacitor plugin
npm install @capacitor/camera
npx cap sync
```

### Running on Devices/Emulators

```bash
# Build the app
npm run build

# Sync changes to native projects
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode (macOS only)
npx cap open ios
```

## Build and Deployment

### Building for Different Environments

```bash
# Build for development
npm run build --env=development

# Build for homologation
npm run build --env=homolog

# Build for production
npm run build --env=production

# Build for external homologation
npm run build --env=hext
```

### Android Build

```bash
npm run build-android
```

### iOS Build

```bash
npm run build-ios
```

## Authentication

The application uses Supabase Auth for authentication. Authentication flow includes:

1. User login with document number and password
2. Token-based session management
3. Biometric authentication option for returning users
4. Role-based access control

## Environment Access

### Development Environment [DEV]

- **URL**: https://orbitta-development.web.app
- **Username**: 39933248000140
- **Password**: Ale030802@

### Homologation Environment [HML]

- **URL**: https://orbitta-homolog.web.app
- **Username**: 04017078000170
- **Password**: teste123

### External Homologation Environment [HEXT]

- **URL**: https://orbitta-hext.web.app
- **Username**: 39933248000140
- **Password**: Ale030802@

## Testing

```bash
# Run unit tests
npm test

# Run linting
npm run lint
```

## Data Access Layer

Data access is implemented in the `app/db/queries/_.ts` files, providing a clean abstraction for database operations. The API layer is exposed through endpoints defined in `app/api/_.ts` files.

## Security Features

- Client-side encryption for sensitive data
- Secure token storage
- Biometric authentication integration
- Input validation and sanitization

## Performance Optimizations

- Lazy loading of Angular modules
- Optimized bundle size with Angular build optimizer
- Memory management best practices
- Efficient rendering with OnPush change detection

## Contributing

1. Branch naming convention: `feature/feature-name` or `fix/bug-name`
2. Submit pull requests with comprehensive descriptions
3. Ensure all tests pass before requesting review
4. Follow the established code style and architecture patterns

---

© 2025 Orbitta. All rights reserved.
