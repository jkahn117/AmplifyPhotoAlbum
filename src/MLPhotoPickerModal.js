import React, { useEffect, useReducer, useRef, useState } from 'react';
import Predictions from '@aws-amplify/predictions';

import {
  Button,
  Dimmer,
  Divider,
  Grid,
  Header,
  Icon,
  List,
  Loader,
  Modal,
  Segment
} from 'semantic-ui-react';

function PhotoPicker(props) {
  const fileInput = useRef(null);

  function handleInput(e) {
    const file = e.target.files[0];
    if (!file) { return; }

    const { name, size, type } = file;
    console.log(`Selected file ${name}`);

    const { onPick } = props;
    if (onPick) {
      onPick({ file, name, size, type });
    }
  }

  return (
    <Segment placeholder>
      <Header icon>
        <Icon name='photo'/>
        Use Maching Learning to Find Faces
      </Header>
      <Button primary onClick={ (e) => fileInput.current.click() }>Select Photo</Button>
      <input ref={ fileInput } title='Pick a photo'
            type="file"
            hidden
            accept='image/*'
            onChange={ handleInput }/>
    </Segment>
  );
};

function ResultPane(props) {
  let { imageSrc, onUpload } = props;
  const [ isAnalyzing, setIsAnalyzing ] = useState(false);
  const [ celebrities, setCelebrities ] = useState([]);
  const [ boundingBoxes, setBoundingBoxes ] = useState([]);

  useEffect(() => {
    identify(props.file);
  }, [props.file]);

  async function identify(file) {
    if (!file) { return; }

    setIsAnalyzing(true);

    try {
      let result = await Predictions.identify({
        entities: {
          source: {
            file
          },
          celebrityDetection: true
        }
      });

      const entities = result.entities;
      console.log(entities);
      let celebs = [];
      let boxes = [];

      entities.forEach(({ boundingBox, metadata: { name='' } }) => {
        if (boundingBox) { boxes.push(boundingBox); }
        if (name) { celebs.push(name); }
      });

      setBoundingBoxes(boxes);
      setCelebrities(celebs);
    } catch (error) {
      console.error('[identify] ', error);
    }

    setIsAnalyzing(false);
  }

  function upload() {
    if (onUpload) {
      onUpload();
    }
  }

  return (
    <Grid columns={ 2 }>
      <Grid.Row>
        <Grid.Column>
          <ImagePreview src={ imageSrc }
                isAnalyzing={ isAnalyzing }
                boundingBoxes={ boundingBoxes }/>
        </Grid.Column>
        <Grid.Column>
          <Header as='h3'>Celebrities</Header>
          <List bulleted>
            { celebrities.map((c, i) => (
              <List.Item key={ i }>{ c }</List.Item>
            )) }
          </List>

          <Divider/>

          <div>
            <Button primary onClick={ upload }>Upload</Button>
          </div>
          
        </Grid.Column>
      </Grid.Row>
    </Grid>

  );
};

function ImagePreview(props) {
  const { isAnalyzing } = props;

  return (
    <Segment>
      <Dimmer.Dimmable dimmed={ isAnalyzing }>
        <CanvasImage src={ props.src } boundingBoxes={ props.boundingBoxes }/>
        <Dimmer active={ isAnalyzing }>
          <Loader>Analyzing...</Loader>
        </Dimmer>
      </Dimmer.Dimmable>
    </Segment>
  );
};


function CanvasImage(props) {
  const { src, boundingBoxes } = props;
  const canvas = useRef(null);
  const image = useRef(null);

  useEffect(() => {
    const cnvs = canvas.current;
    const ctx = cnvs.getContext('2d');
    const img = image.current;

    ctx.clearRect(0, 0, cnvs.width, cnvs.height);
    ctx.drawImage(img, 0, 0);
  }, [src]);

  useEffect(() => {
    const cnvs = canvas.current;
    const ctx = cnvs.getContext('2d');
    const img = image.current;

    if (!boundingBoxes) { return; }

    boundingBoxes.forEach((box) => {
      ctx.beginPath();
      ctx.lineWidth = '3';
      ctx.strokeStyle = 'red';
      ctx.rect(box.left * img.width,
          box.top * img.height,
          box.width * img.width,
          box.height * img.height);
      ctx.stroke();
    });
  }, [boundingBoxes]);

  return (
    <div className="image content">
      <div className="ui medium image">
        <canvas ref={ canvas } width={300} height={300}/>
        <img ref={ image } className='ui hidden image' alt='' src={ src }/>
      </div>
    </div>
  );
};

function MLPhotoPicker(props) {
  const { open, trigger, onPick } = props;

  const initalState = {
    src: '',
    file: null,
    data: null
  };

  const [state, dispatch] = useReducer(reducer, initalState);

  function reducer(state, action) {
    switch(action.type) {
      case 'setFile':
        return { ...state, file: action.file, data: action.data }
      case 'setSrc':
        return { ...state, src: action.url }
      default:
        new Error();
    }
  }

  function handlePick(data) {
    const { file } = data;
    dispatch({ type: 'setFile', file, data });

    if (onPick) { /*onPick(data);*/ }

    const reader = new FileReader();
    reader.onload = function(e) {
      const url = e.target.result;
      dispatch({ type: 'setSrc', url });
    };
    reader.readAsDataURL(file);
  }

  function doUpload() {
    if (onPick) {
      onPick(state.data);
    }
  }

  return (
    <Modal size='small' trigger={ trigger } open={ open }>
      <Modal.Header>Add Photo</Modal.Header>
      <Modal.Content image>        
        <Modal.Description>
          { state.src ? (
            <ResultPane imageSrc={ state.src } file={ state.file } onUpload={ doUpload }/>
          ) : (
            <PhotoPicker onPick={ handlePick } />
          )}
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

export default MLPhotoPicker;