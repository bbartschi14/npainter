import { Canvas } from "@react-three/fiber";
import { useState, useMemo, useEffect } from "react";
import { FileWithPath } from "@mantine/dropzone";
import PainterInputs from "../modules/painter/PainterInputs";
import { useImageSize } from "../modules/image/useImageSize";
import Painter3D from "../modules/painter/Painter3D";

/**
 * Main painter app
 */
const Painter = () => {
  const [imageFile, setImageFile] = useState<FileWithPath[]>([]);
  const [randomSeed, setRandomSeed] = useState(32);
  const [numStrokes, setNumStrokes] = useState(2500);
  const [strokeScale, setStrokeScale] = useState(5);

  const [randomSeedSmall, setRandomSeedSmall] = useState(32);
  const [numStrokesSmall, setNumStrokesSmall] = useState(2500);
  const [strokeScaleSmall, setStrokeScaleSmall] = useState(2.5);
  const [unsharpBlurIters, setUnsharpBlurIters] = useState(10);
  const [unsharpBlurRadius, setUnsharpBlurRadius] = useState(10);
  const [highFreqBlurIters, setHighFreqBlurIters] = useState(6);

  const [displayBaseColor, setDisplayBaseColor] = useState(true);

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
            displayBaseColor={displayBaseColor}
            randomSeedSmall={randomSeedSmall}
            numStrokesSmall={numStrokesSmall}
            strokeScaleSmall={strokeScaleSmall}
            unsharpBlurIters={unsharpBlurIters}
            unsharpBlurRadius={unsharpBlurRadius}
            highFreqBlurIters={highFreqBlurIters}
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
        displayBaseColor={displayBaseColor}
        setDisplayBaseColor={setDisplayBaseColor}
        randomSeedSmall={randomSeedSmall}
        setRandomSeedSmall={setRandomSeedSmall}
        numStrokesSmall={numStrokesSmall}
        setNumStrokesSmall={setNumStrokesSmall}
        strokeScaleSmall={strokeScaleSmall}
        setStrokeScaleSmall={setStrokeScaleSmall}
        unsharpBlurIters={unsharpBlurIters}
        setUnsharpBlurIters={setUnsharpBlurIters}
        highFreqBlurIters={highFreqBlurIters}
        setHighFreqBlurIters={setHighFreqBlurIters}
        unsharpBlurRadius={unsharpBlurRadius}
        setUnsharpBlurRadius={setUnsharpBlurRadius}
      />
    </>
  );
};

export default Painter;
