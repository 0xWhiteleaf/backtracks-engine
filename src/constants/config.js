const devMode = (process.env.NODE_ENV === 'development');

export default {
  // App Details
  appName: 'BackTracks Engine',

  // Cloud Functions API
  cloundFunctionsBaseUrl: 'https://europe-west1-backtracks-engine.cloudfunctions.net',

  // Youtube API
  youtubeApiBaseUrl: 'https://www.googleapis.com/youtube/v3',
  youtubeApiKey: process.env.YT_API_KEY,
  youtubeResultsLimit: process.env.YT_RESULTS_LIMIT,

  // App Behaviors
  statisticsUpdateFrequency: 60000,
  defaultPrefixKeywords: 'Backing Tracks',
  pagination: {
    itemsCountPerPage: devMode ? 12 : 24,
    pageRangeDisplayed: devMode ? 5 : 10
  },

  // Local Storage
  localStorageKey: 'backtrackseng:state',

  // Build Configuration - eg. Debug or Release?
  DEV: devMode,

  // Google Analytics - uses a 'dev' account while we're testing
  gaTrackingId: (devMode) ? 'UA-84284256-2' : 'UA-84284256-1',
};