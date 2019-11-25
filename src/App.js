import React from 'react';
import { Container, Menu } from 'semantic-ui-react';
import { Router, Link } from "@reach/router";

import { withAuthenticator } from 'aws-amplify-react';
import useAmplifyAuth from './useAmplifyAuth';

import Albums from './Albums';
import AlbumDetail from './AlbumDetail';

export const UserContext = React.createContext();

function App() {
  const { state: { user }, onSignOut } = useAmplifyAuth();

  function UserData(props) {
    return !user ? (
      <div></div>
    ) : (
      <div>Welcome {user.username} (<Link to="/" onClick={onSignOut}>Sign Out</Link>)</div>
    );
  }

  return (
    <div>
      <Menu fixed='top' borderless inverted>
        <Container>
          <Menu.Item as={Link} to='/' header>
            Amplify Photo Album
          </Menu.Item>

          <Menu.Menu position='right'>
            <Menu.Item>
              <UserData></UserData>
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>

      <Container text style={{ marginTop: '5em' }}>
        <UserContext.Provider user={ user }>
          <Router>
            <Albums path='/' user={ user } />
            <AlbumDetail path='/album/:albumId' user={ user }/>
          </Router>
        </UserContext.Provider>
      </Container>    
    </div>
  );
}

export default withAuthenticator(App, { signUpConfig: { hiddenDefaults: ['phone_number'] } });