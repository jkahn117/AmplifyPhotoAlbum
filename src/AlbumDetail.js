import React, { useEffect, useReducer } from 'react';
import { API, Storage, graphqlOperation } from 'aws-amplify';
import { PhotoPicker } from 'aws-amplify-react';
import awsconfig from './aws-exports';
import uuid from 'uuid/v4';

import { getAlbum as getAlbumQuery } from './graphql/queries';
import { createPhoto as createPhotoMutation } from './graphql/mutations';

const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket
} = awsconfig;

const initalState = {
  album: {},
  isLoading: false,
  error: null
};

function reducer(state, action) {
  switch(action.type) {
    case 'init':
      return { ...state, isLoading: true }
    case 'set':
      return { ...state, isLoading: false, album: action.album }
    case 'error':
      return { ...state, error: true }
    default:
      new Error();
  }
}

async function getAlbum(albumId, dispatch) {
  try {
    const albumData = await API.graphql(graphqlOperation(getAlbumQuery, { id: albumId }));
    dispatch({ type: 'set', album: albumData.data.getAlbum });
  } catch (error) {
    dispatch({ type: 'error' });
    console.error('[ERROR - getAlbum] ', error);
  } 
}

async function createPhoto(data, state, dispatch) {
  if (data && data.file) {
    const { file, type: mimeType } = data;
    const extension = file.name.split(".")[1];
    const key = `images/${uuid()}-full.${extension}`;

    const inputData = { 
      photoAlbumId: state.album.id,
      contentType: mimeType,
      fullsize: {
        key: key,
        region: region,
        bucket: bucket
      }
    }

    try {
      await Storage.put(key, file, { contentType: mimeType });
      await API.graphql(graphqlOperation(createPhotoMutation, { input: inputData }));
      console.log('successfully created photo')
    } catch(error) {
      console.error('[ERROR - createPhoto] ', error)
    }
  }
}

function AlbumDetail(props) {
  const [state, dispatch] = useReducer(reducer, initalState);

  // add subscription for new photos in this album

  useEffect(() => {
    dispatch({ type: 'init' })
    getAlbum(props.albumId, dispatch)
  }, [props.albumId]);

  return state.isLoading ? (
    <p>loading...</p>
  ) : (
    <div>
      <h1>{ state.album.name }</h1>
      <strong>{ state.album.createdAt }</strong>

      <hr />

      <PhotoPicker preview onPick={(data) => createPhoto(data, state, dispatch)} />
    </div>
  );
};

export default AlbumDetail;