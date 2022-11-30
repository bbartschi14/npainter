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
  const [numStrokes, setNumStrokes] = useState(500);

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
          <Painter3D imageURL={imageURL} imageData={data} numStrokes={numStrokes} />
        ) : (
          <></>
        )}
      </Canvas>
      <PainterInputs
        imageURL={imageURL}
        imageData={data}
        setImageFile={setImageFile}
        numStrokes={numStrokes}
        setNumStrokes={setNumStrokes}
      />
    </>
  );
};

export default Painter;
