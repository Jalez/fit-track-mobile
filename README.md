# FitTrack

FitTrack is a mobile sports application designed to help users create and manage their workout routines. The app allows users to track exercises, sets, reps, and rest times, making it easier to stay organized and motivated in their fitness journey.

## Features

- **Create and Manage Workout Routines**: Users can create custom workout routines tailored to their fitness goals.
- **Track Exercises**: Log exercises with details such as sets, reps, and weights.
- **Rest Timer**: Manage rest periods between sets to optimize workout efficiency.
- **User Authentication**: Secure login and registration for personalized user experiences.
- **Exercise Library**: Browse and manage a library of exercises to include in workout routines.

## Project Structure

The application follows a clean architecture pattern with the following structure:

```
src/
├── api/            - API clients and data fetching
├── components/     - Reusable UI components
│   ├── common/     - Shared components (buttons, cards, etc.)
│   ├── exercise/   - Exercise-specific components
│   └── workout/    - Workout-specific components
├── contexts/       - React Context providers
├── hooks/          - Custom React hooks
├── models/         - TypeScript interfaces and types
├── navigation/     - Navigation configuration
├── screens/        - App screens by feature
│   ├── auth/       - Authentication screens
│   ├── exercise/   - Exercise management screens
│   ├── profile/    - User profile screens
│   └── workout/    - Workout management screens
├── services/       - Business logic services
└── utils/          - Utility functions and constants
```

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- iOS development environment (for iOS)
- Android development environment (for Android)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Jalez/fit-track-mobile.git
   ```

2. Install dependencies:
   ```
   npm install
   ```
   
3. For iOS, install CocoaPods dependencies:
   ```
   cd ios && pod install && cd ..
   ```

### Running the App

#### iOS
```
npm run ios
```

#### Android
```
npm run android
```

## Development

Start the Metro bundler:
```
npm start
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
