# FitTrack

FitTrack is a mobile sports application designed to help users create and manage their workout routines. The app allows users to track exercises, sets, reps, and rest times, making it easier to stay organized and motivated in their fitness journey.

## Features

- **Create and Manage Workout Routines**: Users can create custom workout routines tailored to their fitness goals.
- **Track Exercises**: Log exercises with details such as sets, reps, and weights.
- **Rest Timer**: Manage rest periods between sets to optimize workout efficiency.
- **User Authentication**: Secure login and registration for personalized user experiences.
- **Exercise Library**: Browse and manage a library of exercises to include in workout routines.
- **Supersets & Circuit Training**: Group exercises into supersets, trisets, and circuits for advanced workout programming.
- **Interactive Workout Execution**: Enhanced UI for executing workouts with visual cues for exercise grouping.

## Recent Updates

### May 11, 2025 - Enhanced Exercise Grouping System

- **Exercise Grouping**: Implemented a comprehensive system for creating and managing supersets, trisets, and circuit training workouts
- **Improved Exercise Selection**: Enhanced the exercise selection modal with toggle functionality for easier exercise management
- **Redesigned Active Workout Experience**: Completely overhauled the workout execution UI with:
  - Intuitive navigation between exercise groups
  - Visual indicators for supersets and grouped exercises
  - Enhanced rest timers with intelligent transitions
  - Better visualization of workout progress
- **Data Model Improvements**: Updated the underlying data structures to support complex exercise grouping

### Future Development Plans

- **Performance Analytics**: Implementation of workout history tracking and performance analytics
- **Exercise Video Demonstrations**: Integration of video demonstrations for proper exercise form
- **Custom Exercise Creation**: Allow users to create and save custom exercises
- **Workout Templates**: Pre-defined workout templates for various fitness goals
- **Social Features**: Share workouts and achievements with friends

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
