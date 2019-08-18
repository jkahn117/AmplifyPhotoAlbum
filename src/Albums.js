import React, { useEffect, useReducer } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Link } from "@reach/router";

import useAmplifyAuth from './useAmplifyAuth';
import { listAlbums as listAlbumsQuery } from './graphql/queries';
import { createAlbum as createAlbumMutation } from './graphql/mutations';
import { onCreateAlbum } from './graphql/subscriptions';

const initalState = {
  albums: [],
  error: null,
  // form inputs for new album...
  newAlbumName: ''
};

function reducer(state, action) {
  switch(action.type) {
    case 'set':
      return { ...state, albums: action.albums }
    case 'add':
      return { ...state, albums: [ ...state.albums, action.album ] }
    case 'input':
      return { ...state, [action.inputValue]: action.value }  
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
    createdBy: user.username
  }

// taking this out for now to avoid duplication when creating new...
// in his sample, nader does not add in subscription if this client app created the 
// object. hard to do that here with related objects....??
  // const updatedAlbums = [ ...state.albums, newAlbum ];
  // dispatch({ type: 'set', albums: updatedAlbums });

  try {
    await API.graphql(graphqlOperation(createAlbumMutation, { input: newAlbum }));
    console.log('New album created');
  } catch (error) {
    dispatch({ type: 'error' });
    console.error('[ERROR - createAlbum] ', error);
  }
}

function update(value, inputValue, dispatch) {
  dispatch({ type: 'input', value, inputValue });
}

function Albums() {
  const [state, dispatch] = useReducer(reducer, initalState);
  const { state: { user } } = useAmplifyAuth();

  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onCreateAlbum)).subscribe({
          next: (data) => {
            const album = data.value.data.onCreateAlbum;
            dispatch({ type: 'add', album });
          }
        });

    return () => {
      subscription.unsubscribe();
    }
  }, []);

  useEffect(() => {
    listAlbums(dispatch)
  }, []);

  return (
    <div>
      <ul>
        {
          state.albums.map((album, i) => (
            <li key={i}>
              <Link to={'/album/' + album.id}>{album.name}</Link>
            </li>
          ))
        }
      </ul>

      <hr />

      <h2>Create Album</h2>
      <input type="text"
            placeholder="title"
            onChange={e => update(e.target.value, 'newAlbumName', dispatch)}
            value={state.newAlbumName} />
      <button onClick={() => createAlbum(user, state, dispatch)}>create</button>
    </div>
  )
};

export default Albums;