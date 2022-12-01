import React, { useEffect, useRef } from "react";
import { createPortal, extend, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Plane } from "@react-three/drei";
import { BlurMaterial } from "./shaders/BlurMaterial";
import { LuminanceMaterial } from "./shaders/LuminanceMaterial";
import { HighFreqMaterial } from "./shaders/HighFreqMaterial";
import { Dimensions } from "../image/types";

extend({ LuminanceMaterial });
extend({ BlurMaterial });
extend({ HighFreqMaterial });

type RenderSharpnessProps = {
  baseColor: THREE.Texture;
  setSharpnessTexture: React.Dispatch<React.SetStateAction<THREE.Texture>>;
  unsharpBlurIters: number;
  unsharpBlurRadius: number;
  highFreqBlurIters: number;
};

const RenderSharpness = (props: RenderSharpnessProps) => {
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
  const rt2 = useRef(
    new THREE.WebGLRenderTarget(128, 128, {
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      samples: 8,
    })
  );

  const blurMaterialRef = useRef(null);
  const luminanceMaterialRef = useRef(null);
  const highFreqMaterialRef = useRef(null);

  useEffect(() => {
    if (
      planeRef.current === null ||
      blurMaterialRef.current === null ||
      luminanceMaterialRef.current === null ||
      highFreqMaterialRef.current === null
    )
      return;
    // Update all render target sizes
    if (
      rt0.current.width !== props.baseColor.image.width ||
      rt0.current.height !== props.baseColor.image.height
    ) {
      rt0.current.setSize(props.baseColor.image.width, props.baseColor.image.height);
      rt1.current.setSize(props.baseColor.image.width, props.baseColor.image.height);
      rt2.current.setSize(props.baseColor.image.width, props.baseColor.image.height);
    }
    scene.current.background = new THREE.Color("green");
    // RENDER LUMINANCE
    planeRef.current.material = luminanceMaterialRef.current;
    luminanceMaterialRef.current.uBaseColor = props.baseColor;
    // console.log(luminanceMaterialRef.current);
    gl.setRenderTarget(rt2.current);
    gl.render(scene.current, camera.current);
    gl.setRenderTarget(rt0.current);
    gl.render(scene.current, camera.current);

    let writeTexture = rt1;
    let readTexture = rt0;
    let swap = null;

    // RENDER GAUSSIAN BLUR #1
    const renderGaussian = true;
    if (renderGaussian) {
      planeRef.current.material = blurMaterialRef.current;
      blurMaterialRef.current.uResolution.set(
        props.baseColor.image.width,
        props.baseColor.image.height
      );
      blurMaterialRef.current.uFlip = true;

      const iterations = props.unsharpBlurIters;
      const totalIterations = iterations * 2;
      for (let i = 0; i < totalIterations; i++) {
        // const radius = iterations - Math.floor(i / 2.0);
        const radius = props.unsharpBlurRadius;

        blurMaterialRef.current.uBaseColor = readTexture.current.texture;
        blurMaterialRef.current.uDirection.set(i % 2 === 0 ? radius : 0, i % 2 === 0 ? 0 : radius);
        gl.setRenderTarget(writeTexture.current);
        gl.render(scene.current, camera.current);

        swap = writeTexture;
        writeTexture = readTexture;
        readTexture = swap;
      }
    }

    // RENDER HIGH FREQ
    const renderHighFreq = true;
    if (renderHighFreq) {
      planeRef.current.material = highFreqMaterialRef.current;
      highFreqMaterialRef.current.uBlurred = readTexture.current.texture;
      highFreqMaterialRef.current.uLuminance = rt2.current.texture;

      gl.setRenderTarget(writeTexture.current);
      gl.render(scene.current, camera.current);

      swap = writeTexture;
      writeTexture = readTexture;
      readTexture = swap;
    }

    // RENDER GAUSSIAN BLUR #2
    const renderGaussian2 = true;
    if (renderGaussian2) {
      planeRef.current.material = blurMaterialRef.current;
      blurMaterialRef.current.uResolution.set(
        props.baseColor.image.width,
        props.baseColor.image.height
      );
      blurMaterialRef.current.uFlip = true;

      const iterations = props.highFreqBlurIters;
      const totalIterations = iterations * 2;
      for (let i = 0; i < totalIterations; i++) {
        const radius = iterations - Math.floor(i / 2.0);
        blurMaterialRef.current.uBaseColor = readTexture.current.texture;
        blurMaterialRef.current.uDirection.set(i % 2 === 0 ? radius : 0, i % 2 === 0 ? 0 : radius);
        gl.setRenderTarget(writeTexture.current);
        gl.render(scene.current, camera.current);

        swap = writeTexture;
        writeTexture = readTexture;
        readTexture = swap;
      }
    }
    props.setSharpnessTexture(readTexture.current.texture);
    gl.setRenderTarget(null);
  }, [props.baseColor, props.highFreqBlurIters, props.unsharpBlurIters, props.unsharpBlurRadius]);

  return (
    <>
      {createPortal(<Plane args={[2, 2]} ref={planeRef}></Plane>, scene.current)}
      <blurMaterial ref={blurMaterialRef} />
      <luminanceMaterial ref={luminanceMaterialRef} />
      <highFreqMaterial ref={highFreqMaterialRef} />
    </>
  );
};

export default RenderSharpness;
