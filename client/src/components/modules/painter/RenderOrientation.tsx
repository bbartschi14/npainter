import React, { useEffect, useRef } from "react";
import { createPortal, extend, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Plane } from "@react-three/drei";
import { BlurMaterial } from "./shaders/BlurMaterial";
import { GradientMaterial } from "./shaders/GradientMaterial";
import { LuminanceMaterial } from "./shaders/LuminanceMaterial";
import { EigenMaterial } from "./shaders/EigenMaterial";
import { Dimensions } from "../image/types";

extend({ GradientMaterial });
extend({ LuminanceMaterial });
extend({ BlurMaterial });
extend({ EigenMaterial });

const remap = (value, sourceMin, sourceMax, destMin = 0, destMax = 1) =>
  destMin + ((value - sourceMin) / (sourceMax - sourceMin)) * (destMax - destMin);

type RenderOrientationProps = {
  baseColor: THREE.Texture;
  setOrientationTexture: React.Dispatch<React.SetStateAction<THREE.Texture>>;
  lumiBlurIters: number;
  lumiBlurRadius: number;
  tensorBlurIters: number;
  tensorBlurRadius: number;
};

const RenderOrientation = (props: RenderOrientationProps) => {
  const { gl } = useThree();
  const scene = useRef(new THREE.Scene());
  const camera = useRef(new THREE.PerspectiveCamera());
  const planeRef = useRef(null);

  const rt0 = useRef(
    new THREE.WebGLRenderTarget(128, 128, {
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      samples: 8,
    })
  );
  const rt1 = useRef(
    new THREE.WebGLRenderTarget(128, 128, {
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      samples: 8,
    })
  );

  const luminanceMaterialRef = useRef(null);
  const blurMaterialRef = useRef(null);
  const gradientMaterialRef = useRef(null);
  const eigenMaterialRef = useRef(null);

  useEffect(() => {
    if (
      planeRef.current === null ||
      luminanceMaterialRef.current === null ||
      blurMaterialRef.current === null ||
      gradientMaterialRef.current === null ||
      eigenMaterialRef.current === null
    )
      return;

    // Update all render target sizes
    if (
      rt0.current.width !== props.baseColor.image.width ||
      rt0.current.height !== props.baseColor.image.height
    ) {
      rt0.current.setSize(props.baseColor.image.width, props.baseColor.image.height);
      rt1.current.setSize(props.baseColor.image.width, props.baseColor.image.height);
    }

    let writeTexture = rt0;
    let readTexture = rt1;
    let swap = null;

    // RENDER LUMI
    planeRef.current.material = luminanceMaterialRef.current;
    luminanceMaterialRef.current.uBaseColor = props.baseColor;

    gl.setRenderTarget(writeTexture.current);
    gl.render(scene.current, camera.current);

    swap = writeTexture;
    writeTexture = readTexture;
    readTexture = swap;

    // BLUR LUMI
    const blurLuminance = true;
    if (blurLuminance) {
      planeRef.current.material = blurMaterialRef.current;
      blurMaterialRef.current.uResolution.set(
        props.baseColor.image.width,
        props.baseColor.image.height
      );
      blurMaterialRef.current.uFlip = true;

      const iterations = props.lumiBlurIters;
      const totalIterations = iterations * 2;
      for (let i = 0; i < totalIterations; i++) {
        const radius = remap(Math.floor(i / 2), 0, iterations - 1, props.lumiBlurRadius, 0);
        blurMaterialRef.current.uBaseColor = readTexture.current.texture;
        blurMaterialRef.current.uDirection.set(i % 2 === 0 ? radius : 0, i % 2 === 0 ? 0 : radius);
        gl.setRenderTarget(writeTexture.current);
        gl.render(scene.current, camera.current);

        swap = writeTexture;
        writeTexture = readTexture;
        readTexture = swap;
      }
    }

    // RENDER GRADIENT
    const renderGradient = true;
    if (renderGradient) {
      planeRef.current.material = gradientMaterialRef.current;
      gradientMaterialRef.current.uBaseColor = readTexture.current.texture;
      gradientMaterialRef.current.uResolution.set(
        props.baseColor.image.width,
        props.baseColor.image.height
      );
      gl.setRenderTarget(writeTexture.current);
      gl.render(scene.current, camera.current);

      swap = writeTexture;
      writeTexture = readTexture;
      readTexture = swap;
    }

    // BLUR TENSOR
    const blurTensor = true;
    if (blurTensor) {
      planeRef.current.material = blurMaterialRef.current;
      blurMaterialRef.current.uResolution.set(
        props.baseColor.image.width,
        props.baseColor.image.height
      );
      blurMaterialRef.current.uFlip = true;

      const iterations = props.tensorBlurIters;
      const totalIterations = iterations * 2;
      for (let i = 0; i < totalIterations; i++) {
        const radius = remap(Math.floor(i / 2), 0, iterations - 1, props.tensorBlurRadius, 0);

        blurMaterialRef.current.uBaseColor = readTexture.current.texture;
        blurMaterialRef.current.uDirection.set(i % 2 === 0 ? radius : 0, i % 2 === 0 ? 0 : radius);
        gl.setRenderTarget(writeTexture.current);
        gl.render(scene.current, camera.current);

        swap = writeTexture;
        writeTexture = readTexture;
        readTexture = swap;
      }
    }

    // ANGLES FROM EIGEN
    const angles = true;
    if (angles) {
      planeRef.current.material = eigenMaterialRef.current;
      eigenMaterialRef.current.uBaseColor = readTexture.current.texture;

      gl.setRenderTarget(writeTexture.current);
      gl.render(scene.current, camera.current);

      swap = writeTexture;
      writeTexture = readTexture;
      readTexture = swap;
    }

    props.setOrientationTexture(readTexture.current.texture);
    gl.setRenderTarget(null);
  }, [
    props.baseColor,
    props.lumiBlurIters,
    props.lumiBlurRadius,
    props.tensorBlurIters,
    props.tensorBlurRadius,
  ]);

  return (
    <>
      {createPortal(<Plane args={[2, 2]} ref={planeRef}></Plane>, scene.current)}
      <blurMaterial ref={blurMaterialRef} />
      <luminanceMaterial ref={luminanceMaterialRef} />
      <gradientMaterial ref={gradientMaterialRef} />
      <eigenMaterial ref={eigenMaterialRef} />
    </>
  );
};

export default RenderOrientation;
