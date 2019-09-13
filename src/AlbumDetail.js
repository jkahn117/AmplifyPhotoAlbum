import React, { useEffect, useState, useReducer } from 'react';
import { API, Storage, graphqlOperation } from 'aws-amplify';
import { S3Image } from 'aws-amplify-react';
import awsconfig from './aws-exports';
import uuid from 'uuid/v4';

import MLPhotoPickerModal from './MLPhotoPickerModal';

import {
  Button,
  Card,
  Header,
  Icon,
  Image
} from 'semantic-ui-react';

import { getAlbum as getAlbumQuery } from './graphql/queries';
import { createPhoto as createPhotoMutation } from './graphql/mutations';

function PhotoCard(props) {
  const [src, setSrc] = useState('');
  const { createdAt, gps, thumbnail } = props.photo;

  return (
    <Card>
      <S3Image hidden level='protected' imgKey={ thumbnail.key } onLoad={ url => setSrc(url) } />
      <Image src={ src } />
      <Card.Content extra>
        <p><Icon name='calendar' /> { createdAt }</p>
        { gps &&
            <p><Icon name='globe' /> { gps.latitude } { gps.longitude } </p>
        }
      </Card.Content>
    </Card>
  )
};

function PhotoGrid(props) {
  return (
    <Card.Group itemsPerRow={3}>
      {
        props.photos.map((photo, i) => (
          <PhotoCard key={ i } photo={ photo } />
        ))
      }
    </Card.Group>
  );
};

function AlbumDetail(props) {
  const {
    aws_user_files_s3_bucket_region: region,
    aws_user_files_s3_bucket: bucket
  } = awsconfig;
  
  const initalState = {
    album: {},
    photos: [],
    isLoading: false,
    modalOpen: false,
    error: null
  };

  const [state, dispatch] = useReducer(reducer, initalState);

  // add subscription for new photos in this album

  useEffect(() => {
    dispatch({ type: 'init' })
    getAlbum(props.albumId, dispatch)
  }, [props.albumId]);
  
  function reducer(state, action) {
    switch(action.type) {
      case 'init':
        return { ...state, isLoading: true }
      case 'set':
        return { 
          ...state,
          isLoading: false,
          album: action.album,
          photos: action.album.photos.items ? action.album.photos.items : []
      }
      case 'openModal':
        return { ...state, modalOpen: true }
      case 'closeModal':
        return { ...state, modalOpen: false }
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
      const extension = file.name.substr((file.name.lastIndexOf('.') + 1));
      const photoId = uuid();
      const key = `images/${photoId}.${extension}`;
  
      const inputData = {
        id: photoId,
        photoAlbumId: state.album.id,
        contentType: mimeType,
        fullsize: {
          key: key,
          region: region,
          bucket: bucket
        }
      }
  
      try {
        await Storage.put(key, file, { level: 'protected', contentType: mimeType, metadata: { albumId: state.album.id, photoId } });
        await API.graphql(graphqlOperation(createPhotoMutation, { input: inputData }));
        console.log(`Successfully created photo - ${photoId}`);
        dispatch({ type: 'closeModal' });
      } catch(error) {
        console.error('[ERROR - createPhoto] ', error)
      }
    }
  }

  function openModal() {
    dispatch({ type: 'openModal' });
  }

  return state.isLoading ? (
    <p>loading...</p>
  ) : (
    <div>
      { /* <CreatePhotoModal state={ state } dispatch={ dispatch } /> */ }
      <MLPhotoPickerModal
        open= { state.modalOpen }
        trigger={ <Button primary floated='right' onClick={ openModal }>Add Photo</Button> }
        onPick={ (data) => createPhoto(data, state, dispatch) }/>

      <Header as='h1'>{ state.album.name }</Header>

      <PhotoGrid photos={ state.photos } />
    </div>
  );
};

// function CreatePhotoModal(props) {
//   return (
//     <Modal basic size='small' closeIcon
//       trigger={<Button primary floated='right'>Add Photo</Button>}>
//       <Modal.Header>Select a Photo</Modal.Header>
//       <Modal.Content>
//         <PhotoPicker preview onPick={(data) => createPhoto(data, props.state, props.dispatch)} />
//       </Modal.Content>
//     </Modal>
//   );
// };

export default AlbumDetail;