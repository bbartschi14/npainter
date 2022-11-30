import React, { useState, useEffect } from "react";
import { Plane, useTexture, OrbitControls } from "@react-three/drei";
import { Dimensions } from "../image/types";
import StrokeParticles from "./StrokeParticles";

type Painter3DProps = {
  imageURL: string;
  imageData: Dimensions;
  numStrokes: number;
};

const Painter3D = (props: Painter3DProps) => {
  const texture = useTexture(props.imageURL);
  const [worldSpaceDimensions, setworldSpaceDimensions] = useState<Dimensions>({
    width: 1,
    height: 1,
  });

  // Size plane in world space to match image aspect ratio
  useEffect(() => {
    const scaledWidth = 10;
    if (props.imageData !== null) {
      const aspectRatio = props.imageData.width / props.imageData.height;
      setworldSpaceDimensions({ width: scaledWidth, height: scaledWidth / aspectRatio });
    }
  }, [props.imageData]);

  return (
    <>
      <OrbitControls enableRotate={true} />
      <StrokeParticles
        imageWorldSize={worldSpaceDimensions}
        particleCount={props.numStrokes}
        colorMap={texture}
      />
      <Plane args={[worldSpaceDimensions.width, worldSpaceDimensions.height]}>
        <meshBasicMaterial map={texture} />
      </Plane>
    </>
  );
};

export default Painter3D;
