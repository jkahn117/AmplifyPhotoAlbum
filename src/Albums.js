import React, { useEffect, useReducer } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Link } from "@reach/router";

import useAmplifyAuth from './useAmplifyAuth';
import { listAlbums as listAlbumsQuery } from './graphql/queries';
import { createAlbum as createAlbumMutation } from './graphql/mutations';
import { onCreateAlbum } from './graphql/subscriptions';

import {
  Button,
  Form,
  Grid,
  Header,
  Input
} from 'semantic-ui-react';

function AlbumList(props) {
  return (
    <ul>
      {
        props.albums.map((album, i) => (
          <li key={i}>
            <Link to={'/album/' + album.id}>{album.name}</Link>
          </li>
        ))
      }
    </ul>
  );
}

function Albums(props) {
  const initalState = {
    albums: [],
    error: null,
    // form inputs for new album...
    newAlbumName: ''
  };

  const [state, dispatch] = useReducer(reducer, initalState);
  const { state: { user } } = useAmplifyAuth();

  useEffect(() => {
    if (!user) { return; }
    const { username } = user;
    const subscription = API.graphql(graphqlOperation(onCreateAlbum, { owner: username })).subscribe({
          next: (data) => {
            const album = data.value.data.onCreateAlbum;
            dispatch({ type: 'add', album });
          }
        });

    return () => {
      subscription.unsubscribe();
    }
  }, [ user ]);

  useEffect(() => {
    listAlbums(dispatch)
  }, []);
  
  function reducer(state, action) {
    switch(action.type) {
      case 'set':
        return { ...state, albums: action.albums }
      case 'add':
        return { ...state, albums: [ ...state.albums, action.album ] }
      case 'input':
        return { ...state, [action.inputValue]: action.value }  
      case 'reset':
          return { ...state, [action.inputValue]: '' }
      case 'error':
        return { ...state, error: true }
      default:
        new Error();
    }
  }
  
  async function listAlbums(dispatch) {
    try {
      const albumsData = await API.graphql(graphqlOperation(listAlbumsQuery));
      dispatch({ type: 'set', albums: albumsData.data.listAlbums.items })
    } catch(error) {
      dispatch({ type: 'error' });
      console.error('[ERROR - listAlbums] ', error);
    }
  }
  
  async function createAlbum(user, state, dispatch) {
    const { newAlbumName } = state;
    const newAlbum = {
      name: newAlbumName,
      owner: user.username
    }
  
  // taking this out for now to avoid duplication when creating new...
  // in his sample, nader does not add in subscription if this client app created the 
  // object. hard to do that here with related objects....??
    // const updatedAlbums = [ ...state.albums, newAlbum ];
    // dispatch({ type: 'set', albums: updatedAlbums });
  
    try {
      await API.graphql(graphqlOperation(createAlbumMutation, { input: newAlbum }));
      dispatch({ type: 'reset' });
      console.log('New album created');
    } catch (error) {
      dispatch({ type: 'error' });
      console.error('[ERROR - createAlbum] ', error);
    }
  }
  
  function update(value, inputValue, dispatch) {
    dispatch({ type: 'input', value, inputValue });
  }

  return (
    <div>
      <Header as='h1'>My Albums</Header>

      <Grid divided>
        <Grid.Row>
          <Grid.Column width={8}>
            <AlbumList albums={state.albums} />
          </Grid.Column>

          <Grid.Column width={4}>
            <Header as='h3'>Create Album</Header>

            <Form>
              <Form.Field>
                <label>Name</label>
                <Input placeholder='name'
                  onChange={ e => update(e.target.value, 'newAlbumName', dispatch) }
                  value={ state.newAlbumName } />
              </Form.Field>
              <Button primary onClick={() => createAlbum(user, state, dispatch)}>
                Create
              </Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
};

export default Albums;