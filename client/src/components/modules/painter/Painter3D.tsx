import React, { useState, useEffect, useRef, useMemo } from "react";
import { Plane, useTexture, OrbitControls } from "@react-three/drei";
import { Dimensions } from "../image/types";
import StrokeParticles from "./StrokeParticles";
import { subscribe, unsubscribe } from "../../events";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrthographicCamera } from "three";
import RenderSharpness from "./RenderSharpness";

type Painter3DProps = {
  imageURL: string;
  imageData: Dimensions;
  randomSeed: number;
  numStrokes: number;
  strokeScale: number;
  displayBaseColor: boolean;

  randomSeedSmall: number;
  numStrokesSmall: number;
  strokeScaleSmall: number;

  unsharpBlurIters: number;
  unsharpBlurRadius: number;
  highFreqBlurIters: number;
};

const Painter3D = (props: Painter3DProps) => {
  const texture = useTexture(props.imageURL);
  const [sharpnessTexture, setSharpnessTexture] = useState<THREE.Texture>(null);

  const { gl, scene, camera } = useThree();
  const orbitRef = useRef();

  const [worldSpaceDimensions, setworldSpaceDimensions] = useState<Dimensions>({
    width: 1,
    height: 1,
  });

  const worldSpaceDimensionRef = useRef<Dimensions>(null);

  useEffect(() => {
    worldSpaceDimensionRef.current = worldSpaceDimensions;
  }, [worldSpaceDimensions]);

  // Size plane in world space to match image aspect ratio
  useEffect(() => {
    const scaledWidth = 10;
    if (props.imageData !== null) {
      const aspectRatio = props.imageData.width / props.imageData.height;
      setworldSpaceDimensions({ width: scaledWidth, height: scaledWidth / aspectRatio });
    }
  }, [props.imageData]);

  // Subscribe to save event
  const onSave = (e, orthoDimensions, orbitControlsRef) => {
    const ortho = camera as OrthographicCamera;

    // Cache ortho settings
    const left = ortho.left;
    const right = ortho.right;
    const bottom = ortho.bottom;
    const top = ortho.top;
    const zoom = ortho.zoom;

    // Face camera towards canvas using orbit controls
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset();
    }

    // Align ortho extents to the displayed image
    ortho.left = -orthoDimensions.current.width / 2;
    ortho.right = orthoDimensions.current.width / 2;
    ortho.top = orthoDimensions.current.height / 2;
    ortho.bottom = -orthoDimensions.current.height / 2;
    ortho.zoom = 1;
    ortho.updateProjectionMatrix();

    // Cache previous renderer size
    const originalSize: THREE.Vector2 = new THREE.Vector2();
    gl.getSize(originalSize);

    // Set renderer size to match desired output resolution
    gl.setSize(
      e.detail.resolution.width / gl.getPixelRatio(),
      e.detail.resolution.height / gl.getPixelRatio()
    );

    // Render and save to disk
    gl.render(scene, camera);
    const link = document.createElement("a");
    link.setAttribute("download", "canvas.png");
    link.setAttribute("href", gl.domElement.toDataURL("image/png"));
    link.click();

    // Restore renderer and ortho properties
    gl.setSize(originalSize.x, originalSize.y);
    ortho.left = left;
    ortho.right = right;
    ortho.top = top;
    ortho.bottom = bottom;
    ortho.zoom = zoom;
    ortho.updateProjectionMatrix();
  };

  useEffect(() => {
    let save = (e) => onSave(e, worldSpaceDimensionRef, orbitRef);
    subscribe("save", save);
    return () => {
      unsubscribe("save", save);
    };
  }, [orbitRef]);

  const sharpnessVisualRef = useRef(null);
  useEffect(() => {
    sharpnessVisualRef.current.material.needsUpdate = true;
  }, [sharpnessTexture]);

  return (
    <>
      <OrbitControls enableRotate={false} ref={orbitRef} />

      <StrokeParticles
        imageWorldSize={worldSpaceDimensions}
        randomSeed={props.randomSeed}
        particleCount={props.numStrokes}
        strokeScale={props.strokeScale}
        colorMap={texture}
      />
      <StrokeParticles
        imageWorldSize={worldSpaceDimensions}
        randomSeed={props.randomSeedSmall}
        particleCount={props.numStrokesSmall}
        strokeScale={props.strokeScaleSmall}
        colorMap={texture}
        importanceMap={sharpnessTexture}
      />
      <Plane
        args={[worldSpaceDimensions.width, worldSpaceDimensions.height]}
        visible={props.displayBaseColor}
      >
        <meshBasicMaterial map={texture} />
      </Plane>

      <Plane
        args={[worldSpaceDimensions.width, worldSpaceDimensions.height]}
        visible={props.displayBaseColor}
        ref={sharpnessVisualRef}
        position={[0, -worldSpaceDimensions.height, 0]}
      >
        <meshBasicMaterial map={sharpnessTexture} />
      </Plane>

      <RenderSharpness
        baseColor={texture}
        setSharpnessTexture={setSharpnessTexture}
        highFreqBlurIters={props.highFreqBlurIters}
        unsharpBlurIters={props.unsharpBlurIters}
        unsharpBlurRadius={props.unsharpBlurRadius}
      />
    </>
  );
};

export default Painter3D;
