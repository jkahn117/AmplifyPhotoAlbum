import React, { useEffect, useRef, useState } from 'react';
import Predictions from '@aws-amplify/predictions';

import {
  Button,
  Header,
  Modal
} from 'semantic-ui-react';

function Picker(props) {
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
    <div>
      <Button primary onClick={ (e) => fileInput.current.click() }>Select Photo</Button>
      <input ref={ fileInput }
            title={ props.title || 'Pick a file' }
            type="file"
            hidden
            accept={ props.accept || '*/*' }
            onChange={ handleInput }/>
    </div>
  );
};

function CanvasImage(props) {
  const { src, defaultSrc } = props;
  const canvas = useRef(null);
  const image = useRef(null);

  useEffect(() => {
    const cnvs = canvas.current;
    const ctx = cnvs.getContext('2d');
    const img = image.current;

    img.onload = () => {
      ctx.clearRect(0, 0, cnvs.width, cnvs.height);
      ctx.drawImage(img, 0, 0);
    };
  }, [props.src]);

  useEffect(() => {
    const cnvs = canvas.current;
    const ctx = cnvs.getContext('2d');
    const img = image.current;

    props.boundingBoxes.forEach((box) => {
      ctx.beginPath();
      ctx.lineWidth = '3';
      ctx.strokeStyle = 'red';
      ctx.rect(box.left * img.width,
          box.top * img.height,
          box.width * img.width,
          box.height * img.height);
      ctx.stroke();
    });
  }, [props.boundingBoxes]);

  return (
    <div className="image content">
      <div className="ui medium image">
        <canvas ref={ canvas } width={300} height={300}/>
        <img ref={ image } className='ui hidden image' alt='' src={ src || defaultSrc }/>
      </div>
    </div>
  );
};

function MLPhotoPicker(props) {
  const [ src, setSrc ] = useState('');
  const [ celebrities, setCelebrities ] = useState([]);
  const [ boxes, setBoxes ] = useState([]);
  const { trigger, onPick } = props;

  function handlePick(data) {
    setCelebrities([]);
    setBoxes([]);
    const { file } = data;

    if (onPick) { /*onPick(data);*/ }
    identify(file);

    const reader = new FileReader();
    reader.onload = function(e) {
      const url = e.target.result;
      setSrc(url);
      // if on load
    };
    reader.readAsDataURL(file);
  }

  async function identify(file) {
    if (!file) { return; }

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
      })

      setCelebrities(celebs);
      setBoxes(boxes);
    } catch (error) {
      console.error('[identify] ', error);
    }
  }

  return (
    <Modal trigger={ trigger }>
      <Modal.Header>Select a Photo</Modal.Header>

      <Modal.Content image>        
        <CanvasImage src={ src }
            boundingBoxes={ boxes }
            defaultSrc='https://place-hold.it/300'/>
        
        <Modal.Description>
          <Header>Use Maching Learning to Find Faces</Header>
          <p>
            Our photo picker uses Amazon Rekognition to identify celebrity faces in the image.
          </p>
          <Picker title="Select a Photo" accept="image/*" onPick={handlePick} />

          { celebrities.length > 0 &&
            <div>
              <strong>Celebrities</strong>
              <ul>
                { celebrities.map((c, i) => (
                  <li key={ i }>{ c }</li>
                )) }
              </ul>
            </div>
          }
          
          <Button primary>Upload</Button>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

export default MLPhotoPicker;