import * as FirebaseModule from 'firebase';
import * as FirebaseUIModule from 'firebaseui';
import firebaseConfig from './../constants/firebase';

const {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
} = firebaseConfig;

let firebaseInitialized = false;

if (
  apiKey !== 'null'
  && authDomain !== 'null'
  && databaseURL !== 'null'
  && projectId !== 'null'
  && storageBucket !== 'null'
  && messagingSenderId !== 'null'
) {
  FirebaseModule.initializeApp({
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    messagingSenderId,
  });

  firebaseInitialized = true;
}

export const FirebaseRef = firebaseInitialized ? FirebaseModule.firestore() : null;
export const Firebase = firebaseInitialized ? FirebaseModule : null;

let uiConfig = {
  signInOptions: [
    {
      provider: Firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      recaptchaParameters: {
        type: 'image', // 'audio'
        size: 'normal', // 'invisible' or 'compact'
        badge: 'bottomleft'
      },
      defaultCountry: 'FR'
    }
  ]
};
export const ConfigureFirebaseUI = function (signInSuccessWithAuthResultCallback) {
  uiConfig.callbacks = {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      signInSuccessWithAuthResultCallback(authResult);
      return false;
    }
  };
};

const ui = new FirebaseUIModule.auth.AuthUI(Firebase.auth());
export const FirebaseUI = function (container) {
  ui.start(container, uiConfig);
};