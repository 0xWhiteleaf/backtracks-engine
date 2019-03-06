const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebaseConfig = require('./constants');

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
  admin.initializeApp({
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    messagingSenderId,
  });

  firebaseInitialized = true;
}

const cors = require('cors')({
  origin: true,
});

const region = 'europe-west1';
const statsRef = admin.firestore().collection('statistics').doc('default');

function onError(error) {
  return cors(req, res, () => {
    res.status(500).send(error);
  });
}

exports.searches = functions
  .region(region)
  .https.onRequest((req, res) => {

    if (!firebaseInitialized)
      return onError('Firebase not initialized !');

    switch (req.method) {
      case 'GET':
        statsRef.get()
          .then(result => {
            return cors(req, res, () => {
              res.status(200).send({ searches: result.data().searches });
            });
          })
          .catch(error => {
            onError(error);
          });
        break;

      case 'POST':
        statsRef.get()
          .then(result => {
            const searchesCount = result.data().searches;
            if (searchesCount == null || searchesCount < 0)
              searchesCount = 0;

            statsRef.set({ searches: (searchesCount + 1) })
              .then(result => {
                return cors(req, res, () => {
                  res.status(200).send();
                });
              })
              .catch(error => {
                onError(error);
              });
          })
          .catch(error => {
            onError(error);
          });
        break;

      case 'OPTIONS':
        return cors(req, res, () => {
          res.set('Access-Control-Allow-Origin', "*");
          res.set('Access-Control-Allow-Methods', 'GET, POST');
          res.status(200).send();
        });

      default:
        return res.status(403).send();
    }
  });

exports.deleteEmptyPlaylists = functions
  .region(region)
  .firestore.document("/users/{userId}/playlists/{playlistId}")
  .onWrite((change) => {
    const playlistId = change.after.id;
    const playlist = change.after.data();

    console.log('Checking playlist: ' + playlistId + '...');
    console.log('Playlist: ' + playlistId + ' has ' + playlist.videos.length + ' video(s)');

    if (playlist.videos == null || playlist.videos.length == 0) {
      console.log('Deleting playlist: ' + playlistId + '...');
      return Promise.all([change.after.ref.delete()]);
    } else {
      return 'No changes required.';
    }
  });