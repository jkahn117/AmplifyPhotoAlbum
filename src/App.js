import React from 'react';
import { Router, Link } from "@reach/router";

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import useAmplifyAuth from './useAmplifyAuth';

import Albums from './Albums';
import AlbumDetail from './AlbumDetail';

Amplify.configure(awsconfig);

function App() {
  const { state: { user }, onSignOut } = useAmplifyAuth();

  function UserData(props) {
    return !user ? (
      <div></div>
    ) : (
      <div>Welcome {user.attributes.email} (<a href="/signout" onClick={onSignOut}>Sign Out</a>)</div>
    );
  }

  return (
    <div>
      <h1><Link to=''>Amplify Photo Album</Link></h1>
      <UserData></UserData>
      <hr />

      <Router>
        <Albums path='/' />
        <AlbumDetail path='/album/:albumId'/>
      </Router>
    </div>
  );
}

export default withAuthenticator(App, { signUpConfig: { hiddenDefaults: ['phone_number'] } });
