import React from 'react';
import { useGlobal } from 'reactn';
import { Switch, Route, Redirect } from 'react-router-dom';

// Templates
import TemplateSidebar from '../components/templates/TemplateSidebar';

// Routes
import DefaultContainer from '../../containers/Default';

import LoginComponent from '../components/pages/Login';
import FavoritesComponent from '../components/pages/Favorites';

import PlaylistContainer from '../../containers/Playlist';
import PlaylistComponent from '../components/pages/Playlist';

import PlaylistsComponent from '../components/pages/Playlists';

import SearchContainer from '../../containers/Search';
import SearchComponent from '../components/pages/Search';

import VideoDetailsContainer from '../../containers/VideoDetails';
import VideoDetailsComponent from '../components/pages/VideoDetails';

import Error from '../components/pages/Error';

const Index = () => {

  const [isLogged] = useGlobal('isLogged');

  return (
    <Switch>
      <Route
        exact
        path="/"
        render={props => (
          <TemplateSidebar>
            <SearchContainer {...props} Layout={SearchComponent} />
          </TemplateSidebar>
        )}
      />
      <Route
        path="/auth"
        render={(props) => (
          isLogged ? (
            <Redirect to="/" />
          ) : (
              <TemplateSidebar>
                <DefaultContainer {...props} Layout={LoginComponent} />
              </TemplateSidebar>
            )
        )}
      />
      <Route
        path="/video/:id"
        render={props => (
          <TemplateSidebar>
            <VideoDetailsContainer {...props} Layout={VideoDetailsComponent} />
          </TemplateSidebar>
        )}
      />
      <Route
        path="/favorites"
        render={(props) => (
          !isLogged ? (
            <Redirect to="/auth" />
          ) : (
              <TemplateSidebar>
                <DefaultContainer {...props} Layout={FavoritesComponent} />
              </TemplateSidebar>
            )
        )}
      />
      <Route
        path="/playlists"
        render={(props) => (
          !isLogged ? (
            <Redirect to="/auth" />
          ) : (
              <TemplateSidebar>
                <DefaultContainer {...props} Layout={PlaylistsComponent} />
              </TemplateSidebar>
            )
        )}
      />
      <Route
        path="/playlist/:id"
        render={(props) => (
          !isLogged ? (
            <Redirect to="/auth" />
          ) : (
              <TemplateSidebar>
                <PlaylistContainer {...props} Layout={PlaylistComponent} />
              </TemplateSidebar>
            )
        )}
      />
      <Route
        render={props => (
          <TemplateSidebar>
            <Error {...props} title="404" content="Sorry, the route you requested does not exist" />
          </TemplateSidebar>
        )}
      />
    </Switch>
  );
};

export default Index;
