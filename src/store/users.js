import { getGlobal, setGlobal } from 'reactn';
import { refs } from './../constants/firebase';
import { FirebaseRef } from './../lib/firebase';

const isLogged = () => {
    return getGlobal().isLogged;
}

const currentUser = () => {
    return getGlobal().user;
}

/* UserData */

export const getUserData = async () => {
    if (!isLogged)
        throw new Error('Must be logged to call getUserData()');

    const userRef = FirebaseRef.collection(refs.users);
    const user = await userRef.doc(currentUser().id).get();

    return user.data();
}

export const updateUserData = async (userData) => {
    if (!isLogged)
        throw new Error('Must be logged to call updateUserData(userData)');

    const userRef = FirebaseRef.collection(refs.users);
    const result = await userRef.doc(currentUser().id).set(userData);

    return result;
}

export const updateLastConnectionDate = async () => {
    return await updateUserData({ lastConnectionDate: new Date() });
}

/* Favorites */

export const getFavorites = async () => {
    if (!isLogged)
        throw new Error('Must be logged to call getFavorites()');

    const userRef = FirebaseRef.collection(refs.users);
    const favsRef = userRef.doc(currentUser().id).collection(refs.favorites);

    const _favorites = await favsRef.orderBy('addedOn', 'desc').get();
    const favorites = [];

    _favorites.forEach(fav => {
        favorites.push({ id: fav.id, data: fav.data() });
    });

    return favorites;
}

export const getFavorite = async (videoId) => {
    if (!isLogged)
        throw new Error('Must be logged to call getFavorite(videoId)');

    const userRef = FirebaseRef.collection(refs.users);
    const favsRef = userRef.doc(currentUser().id).collection(refs.favorites);

    const favorite = await favsRef.doc(videoId).get();

    return favorite;
}

export const addFavorite = async (videoId) => {
    if (!isLogged)
        throw new Error('Must be logged to call addFavorite(videoId)');

    const userRef = FirebaseRef.collection(refs.users);
    const favsRef = userRef.doc(currentUser().id).collection(refs.favorites);

    const result = await favsRef.doc(videoId).set({
        addedOn: new Date()
    });

    return result;
}

export const removeFavorite = async (videoId) => {
    if (!isLogged)
        throw new Error('Must be logged to call removeFavorite(videoId)');

    const userRef = FirebaseRef.collection(refs.users);
    const favsRef = userRef.doc(currentUser().id).collection(refs.favorites);

    const result = await favsRef.doc(videoId).delete();

    return result;
}

/* Comments */

export const getCommentsCount = async () => {
    const videoRef = FirebaseRef.collection(refs.videos);
    videoRef.
        videoRef.where("comments.`[memberID]`")
    const commentsRef = videoRef.doc(videoId).collection(refs.comments);

    const _comments = await commentsRef.orderBy('addedOn', 'desc').get();
    const comments = [];

    _comments.forEach(com => {
        comments.push({ id: com.id, data: com.data() });
    });

    return comments;
}

export const getComments = async (videoId) => {
    const videoRef = FirebaseRef.collection(refs.videos);
    const commentsRef = videoRef.doc(videoId).collection(refs.comments);

    const _comments = await commentsRef.orderBy('addedOn', 'desc').get();
    const comments = [];

    _comments.forEach(com => {
        comments.push({ id: com.id, data: com.data() });
    });

    return comments;
}

export const addComment = async (videoId, content) => {
    if (!isLogged)
        throw new Error('Must be logged to call addComment(videoId)');

    const videoRef = FirebaseRef.collection(refs.videos);
    const commentsRef = videoRef.doc(videoId).collection(refs.comments);

    const comment = {
        userId: currentUser().id,
        phoneNumber: currentUser().phoneNumber,
        content: content,
        addedOn: new Date()
    };
    const result = await commentsRef.add(comment);

    return { ref: result, copy: comment };
}

export const removeComment = async (videoId, commentId) => {
    if (!isLogged)
        throw new Error('Must be logged to call removeComment(commentId)');

    const videoRef = FirebaseRef.collection(refs.videos);
    const commentsRef = videoRef.doc(videoId).collection(refs.comments);

    const result = await commentsRef.doc(commentId).delete();

    return result;
}

/* Playlists */

export const getPlaylists = async (orderBy = 'createdOn', direction = 'desc') => {
    if (!isLogged)
        throw new Error('Must be logged to call getPlaylists(orderBy, direction)');

    const userRef = FirebaseRef.collection(refs.users);
    const playsRef = userRef.doc(currentUser().id).collection(refs.playlists);

    const _playlists = await playsRef.orderBy(orderBy, direction).get();
    const playlists = [];

    _playlists.forEach(play => {
        playlists.push({ id: play.id, data: play.data() });
    });

    return playlists;
}

export const getPlaylist = async (id) => {
    if (!isLogged)
        throw new Error('Must be logged to call getPlaylist(id)');

    const userRef = FirebaseRef.collection(refs.users);
    const playsRef = userRef.doc(currentUser().id).collection(refs.playlists);

    const playlist = await playsRef.doc(id).get();

    return playlist;
}

export const createPlaylist = async (name, video) => {
    if (!isLogged)
        throw new Error('Must be logged to call createPlaylist(name, video)');

    const userRef = FirebaseRef.collection(refs.users);
    const playsRef = userRef.doc(currentUser().id).collection(refs.playlists);

    const playlist = {
        name: name,
        createdOn: new Date(),
        videos: [video]
    };
    const result = await playsRef.add(playlist);

    return result;
}

export const updatePlaylist = async (playlistId, videos) => {
    if (!isLogged)
        throw new Error('Must be logged to call updatePlaylist(playlistId, videos)');

    const userRef = FirebaseRef.collection(refs.users);
    const playsRef = userRef.doc(currentUser().id).collection(refs.playlists);

    const result = await playsRef.doc(playlistId).update({ videos: videos });

    return result;
}

export const deletePlaylist = async (playlistId) => {
    if (!isLogged)
        throw new Error('Must be logged to call deletePlaylist(playlistId)');

    const userRef = FirebaseRef.collection(refs.users);
    const playsRef = userRef.doc(currentUser().id).collection(refs.playlists);

    const result = await playsRef.doc(playlistId).delete();

    return result;
}