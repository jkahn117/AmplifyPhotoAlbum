import React, { useEffect, useState, useReducer } from 'react';
import { Button, Card, Header, Icon, Image, Input, Loader, Message, /* Modal */ Segment } from 'semantic-ui-react';
import { API, Storage, graphqlOperation } from 'aws-amplify';
import { S3Image /*, PhotoPicker */ } from 'aws-amplify-react';
import awsconfig from './aws-exports';
import uuid from 'uuid/v4';

import MLPhotoPickerModal from './MLPhotoPickerModal';

import { getAlbum as getAlbumQuery } from './graphql/queries';
import { createPhoto as createPhotoMutation } from './graphql/mutations';
import { updateAlbum as updateAlbumMutation } from './graphql/mutations';
import { onAlbumPhotosChange } from './graphql/subscriptions';

function PhotoCard(props) {
  const [src, setSrc] = useState('');
  const { createdAt, gps, fullsize, thumbnail } = props.photo;

  return (
    <Card>
      <S3Image hidden level='protected'
            identityId={ props.owner || null }
            imgKey={ thumbnail ? thumbnail.key : fullsize.key }
            onLoad={ url => setSrc(url) } />
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
          <PhotoCard key={ i } photo={ photo } owner={ props.owner } />
        ))
      }
    </Card.Group>
  );
}

function AlbumDetail({ albumId, user }) {
  const {
    aws_user_files_s3_bucket_region: region,
    aws_user_files_s3_bucket: bucket
  } = awsconfig;
  
  const initalState = {
    album: {},
    photos: [],
    // user interface
    isLoading: false,
    message: '',
    error: null
  };

  const [openModal, showModal] = useState(false);
  const [state, dispatch] = useReducer(reducer, initalState);

  useEffect(() => {
    dispatch({ type: 'init' });
    getAlbum(albumId, dispatch);
  }, [ albumId ]);

  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onAlbumPhotosChange, { photoAlbumId: albumId })).subscribe({
      next: (data) => {
        const photo = data.value.data.onAlbumPhotosChange;
        dispatch({ type: 'addPhoto', newPhoto: photo })
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [albumId]);
  
  function reducer(state, action) {
    switch(action.type) {
      case 'init':
        return { ...state, isLoading: true };
      case 'set':
        return { 
          ...state,
          isLoading: false,
          album: action.album,
          photos: action.album.photos.items ? action.album.photos.items : []
        };
      case 'addPhoto':
        return { ...state, photos: [...state.photos, action.newPhoto] }
      case 'message':
        return { ...state, message: action.message };
      case 'error':
        return { ...state, error: true };
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
      };
  
      try {
        await Storage.put(key, file, { level: 'protected', contentType: mimeType, metadata: { albumId: state.album.id, photoId } });
        await API.graphql(graphqlOperation(createPhotoMutation, { input: inputData }));
        dispatch({ type: 'message', message: 'New photo created successfully' });
        console.log(`Successfully created photo - ${photoId}`);
        showModal(false);
      } catch(error) {
        console.error('[ERROR - createPhoto] ', error);
      }
    }
  }

  return state.isLoading ? (
    <p>loading...</p>
  ) : (
    <div>
      { user && user.username === state.album.owner &&
        <MLPhotoPickerModal
            open={openModal}
            onClose={() => { showModal(false) }}
            trigger={ <Button primary floated='right' onClick={() => { showModal(true) }}>Add Photo</Button> }
            onPick={ (data) => {
              showModal(false);
              createPhoto(data, state, dispatch);
            }} /> }
    
      <Header as='h1'>{ state.album.name }</Header>
      { state.message &&
        <Message><p>{ state.message }</p></Message> }
      <PhotoGrid photos={ state.photos } owner={ state.album.ownerId } />

      { user && user.username === state.album.owner &&
        <AlbumSharing album={ state.album } />}
    </div>
  );
}

function AlbumSharing(props) {
  const [viewers, setViewers] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setViewers(props.album.viewers || []);
  }, [props.album]);

  async function addMember() {
    setIsLoading(true);
    const inputData = {
      id: props.album.id,
      viewers: [ ...props.album.viewers || [], newUser ]
    };

    const result = await API.graphql(graphqlOperation(updateAlbumMutation, { input: inputData }));
    console.log(`${newUser} is now a viewer of album ${result.data.updateAlbum.id}`);
    
    setViewers([...viewers, newUser]);
    setNewUser('');
    setIsLoading(false);
  };

  return (
    <Segment size='small'>
      <Header as='h4'>Album shared with...</Header>
      <p>{ viewers.length > 0 ? viewers.join(', ') : 'No one' }</p>

      <Input placeholder='add viewer'
        size='small'
        disabled={isLoading}
        action={{ icon: 'user add', onClick: addMember }}
        onChange={ e => setNewUser(e.target.value) }
        value={ newUser } />
      <span style={{ 'paddingLeft': '1rem' }}>
        <Loader active={ isLoading } inline size='small'/>
      </span>
    </Segment>
  );
}

export default AlbumDetail;