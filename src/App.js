import React from 'react';
import { Router, Link } from "@reach/router";

import { withAuthenticator } from 'aws-amplify-react';
import useAmplifyAuth from './useAmplifyAuth';
import Albums from './Albums';
import AlbumDetail from './AlbumDetail';

import {
  Container,
  Menu
} from 'semantic-ui-react';


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
        <Router>
          <Albums path='/' />
          <AlbumDetail path='/album/:albumId'/>
        </Router>
      </Container>      
    </div>
  );
}

export default withAuthenticator(App, { signUpConfig: { hiddenDefaults: ['phone_number'] } });
