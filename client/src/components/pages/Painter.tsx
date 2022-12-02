import { Canvas } from "@react-three/fiber";
import { useState, useMemo, useEffect } from "react";
import { FileWithPath } from "@mantine/dropzone";
import PainterInputs from "../modules/painter/PainterInputs";
import { useImageSize } from "../modules/image/useImageSize";
import Painter3D from "../modules/painter/Painter3D";
import Info from "../modules/common/Info";
import ControlsDisplay from "../modules/painter/ControlsDisplay";

/**
 * Main painter app
 */
const Painter = () => {
  const [imageFile, setImageFile] = useState<FileWithPath[]>([]);
  const [randomSeed, setRandomSeed] = useState(32);
  const [numStrokes, setNumStrokes] = useState(2500);
  const [strokeScale, setStrokeScale] = useState(5);
  const [strokeScaleNoise, setStrokeScaleNoise] = useState(0.1);
  const [strokeColorNoise, setStrokeColorNoise] = useState(0.1);

  const [randomSeedSmall, setRandomSeedSmall] = useState(32);
  const [numStrokesSmall, setNumStrokesSmall] = useState(2500);
  const [strokeScaleSmall, setStrokeScaleSmall] = useState(2.5);
  const [strokeScaleNoiseSmall, setStrokeScaleNoiseSmall] = useState(0.1);
  const [strokeColorNoiseSmall, setStrokeColorNoiseSmall] = useState(0.1);

  const [unsharpBlurIters, setUnsharpBlurIters] = useState(10);
  const [unsharpBlurRadius, setUnsharpBlurRadius] = useState(10);
  const [highFreqBlurIters, setHighFreqBlurIters] = useState(6);
  const [highFreqBlurRadius, setHighFreqBlurRadius] = useState(6);

  const [lumiBlurIters, setLumiBlurIters] = useState(6);
  const [lumiBlurRadius, setLumiBlurRadius] = useState(2);

  const [tensorBlurIters, setTensorBlurIters] = useState(5);
  const [tensorBlurRadius, setTensorBlurRadius] = useState(2);

  const [displayBaseColor, setDisplayBaseColor] = useState(true);
  const [displayDetailTexture, setDisplayDetailTexture] = useState(true);
  const [displayOrientTexture, setDisplayOrientTexture] = useState(true);

  // Convert image file to usable URL
  const imageURL = useMemo(() => {
    if (imageFile.length > 0) {
      console.log(imageFile);
      return URL.createObjectURL(imageFile[0]);
    } else {
      return null;
    }
  }, [imageFile]);

  // Retrieve important data using URL
  const [data, { loading, error }] = useImageSize(imageURL);

  // Cleanup URL memory
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(imageURL);
    };
  }, [imageURL]);

  return (
    <>
      <Canvas orthographic={true} camera={{ zoom: 120 }}>
        {imageURL !== null ? (
          <Painter3D
            imageURL={imageURL}
            imageData={data}
            randomSeed={randomSeed}
            numStrokes={numStrokes}
            strokeScale={strokeScale}
            strokeScaleNoise={strokeScaleNoise}
            strokeColorNoise={strokeColorNoise}
            displayBaseColor={displayBaseColor}
            displayDetailTexture={displayDetailTexture}
            displayOrientTexture={displayOrientTexture}
            randomSeedSmall={randomSeedSmall}
            numStrokesSmall={numStrokesSmall}
            strokeScaleSmall={strokeScaleSmall}
            strokeScaleNoiseSmall={strokeScaleNoiseSmall}
            strokeColorNoiseSmall={strokeColorNoiseSmall}
            unsharpBlurIters={unsharpBlurIters}
            unsharpBlurRadius={unsharpBlurRadius}
            highFreqBlurIters={highFreqBlurIters}
            highFreqBlurRadius={highFreqBlurRadius}
            lumiBlurIters={lumiBlurIters}
            lumiBlurRadius={lumiBlurRadius}
            tensorBlurIters={tensorBlurIters}
            tensorBlurRadius={tensorBlurRadius}
          />
        ) : (
          <></>
        )}
      </Canvas>
      <PainterInputs
        imageURL={imageURL}
        imageData={data}
        setImageFile={setImageFile}
        randomSeed={randomSeed}
        setRandomSeed={setRandomSeed}
        numStrokes={numStrokes}
        setNumStrokes={setNumStrokes}
        strokeScale={strokeScale}
        setStrokeScale={setStrokeScale}
        strokeScaleNoise={strokeScaleNoise}
        setStrokeScaleNoise={setStrokeScaleNoise}
        strokeColorNoise={strokeColorNoise}
        setStrokeColorNoise={setStrokeColorNoise}
        displayBaseColor={displayBaseColor}
        setDisplayBaseColor={setDisplayBaseColor}
        displayDetailTexture={displayDetailTexture}
        setDisplayDetailTexture={setDisplayDetailTexture}
        displayOrientTexture={displayOrientTexture}
        setDisplayOrientTexture={setDisplayOrientTexture}
        randomSeedSmall={randomSeedSmall}
        setRandomSeedSmall={setRandomSeedSmall}
        numStrokesSmall={numStrokesSmall}
        setNumStrokesSmall={setNumStrokesSmall}
        strokeScaleSmall={strokeScaleSmall}
        setStrokeScaleSmall={setStrokeScaleSmall}
        strokeScaleNoiseSmall={strokeScaleNoiseSmall}
        setStrokeScaleNoiseSmall={setStrokeScaleNoiseSmall}
        strokeColorNoiseSmall={strokeColorNoiseSmall}
        setStrokeColorNoiseSmall={setStrokeColorNoiseSmall}
        unsharpBlurIters={unsharpBlurIters}
        setUnsharpBlurIters={setUnsharpBlurIters}
        highFreqBlurIters={highFreqBlurIters}
        setHighFreqBlurIters={setHighFreqBlurIters}
        highFreqBlurRadius={highFreqBlurRadius}
        setHighFreqBlurRadius={setHighFreqBlurRadius}
        unsharpBlurRadius={unsharpBlurRadius}
        setUnsharpBlurRadius={setUnsharpBlurRadius}
        lumiBlurIters={lumiBlurIters}
        setLumiBlurIters={setLumiBlurIters}
        lumiBlurRadius={lumiBlurRadius}
        setLumiBlurRadius={setLumiBlurRadius}
        tensorBlurIters={tensorBlurIters}
        setTensorBlurIters={setTensorBlurIters}
        tensorBlurRadius={tensorBlurRadius}
        setTensorBlurRadius={setTensorBlurRadius}
      />
      <Info />
      {false ? <></> : <ControlsDisplay />}
    </>
  );
};

export default Painter;
