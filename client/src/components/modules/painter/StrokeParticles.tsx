import React, { useMemo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Instances, Instance, useTexture } from "@react-three/drei";
import { Dimensions } from "../image/types";
import brush0 from "./brushes/brush.png";
import brush1 from "./brushes/longBrush.png";
import brush2 from "./brushes/longBrush2.png";
import * as THREE from "three";
import rng from "../image/rng";

type StrokeParticlesProps = {
  imageWorldSize: Dimensions;
  randomSeed: number;
  particleCount: number;
  strokeScale: number;
  scaleNoise: number;
  colorNoise: number;
  colorMap: THREE.Texture;
  orientationMap: THREE.Texture;
  importanceMap?: THREE.Texture;
  zOffset: number;
};

const tempObject = new THREE.Object3D();
const distanceTowardsCamera = 0.1;

const StrokeParticles = (props: StrokeParticlesProps) => {
  const texture = useTexture(brush2);

  const [loading, setLoading] = useState(false);

  const colorMapRef = useRef({ value: null });
  useEffect(() => {
    colorMapRef.current.value = props.colorMap;
  }, [props.colorMap]);

  const orientationMapRef = useRef({ value: null });
  useEffect(() => {
    orientationMapRef.current.value = props.orientationMap;
  }, [props.orientationMap]);

  const colorNoiseRef = useRef({ value: 0.0 });
  useEffect(() => {
    colorNoiseRef.current.value = props.colorNoise;
  }, [props.colorNoise]);

  const useImportanceRef = useRef({ value: false });
  const importanceMapRef = useRef({ value: null });

  useEffect(() => {
    importanceMapRef.current.value = props.importanceMap;
    useImportanceRef.current.value =
      props.importanceMap !== null && props.importanceMap !== undefined;
  }, [props.importanceMap]);

  useLayoutEffect(() => {
    texture.magFilter = THREE.NearestFilter;
  }, [texture]);

  const onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>
        uniform sampler2D uColorMap;
        uniform sampler2D uImportanceMap;
        uniform sampler2D uOrientationMap;
        uniform bool uUseImportance;
        uniform float uColorNoise;
        attribute vec2 colorUv;
        attribute float randomFactor;
        varying vec2 vColorUv;
        varying float vRandomFactor;`
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
      #define M_PI 3.1415926535897932384626433832795

      vColorUv = colorUv;
      vRandomFactor = randomFactor;
      vec4 orientationSample = texture2D(uOrientationMap,vColorUv);
      float s = sin(orientationSample.x * M_PI);
      float c = cos(orientationSample.x * M_PI);
      vec2 position2D = vec2(transformed.x, transformed.y);
      mat2 rotation2D = mat2(c, -s, s, c);
      vec2 rotated = rotation2D * position2D;

      transformed.x = rotated.x;
      transformed.y = rotated.y;
      `
    );

    shader.uniforms.uColorMap = colorMapRef.current;
    shader.uniforms.uImportanceMap = importanceMapRef.current;
    shader.uniforms.uOrientationMap = orientationMapRef.current;
    shader.uniforms.uUseImportance = useImportanceRef.current;
    shader.uniforms.uColorNoise = colorNoiseRef.current;

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
        uniform sampler2D uColorMap;
        uniform sampler2D uImportanceMap;
        uniform sampler2D uOrientationMap;
        uniform bool uUseImportance;
        uniform float uColorNoise;
        varying vec2 vColorUv;
        varying float vRandomFactor;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <alphamap_fragment>",
      `
        #include <alphamap_fragment>
        vec4 sampledDiffuseColor = texture2D( uColorMap, vColorUv );

        float alpha = 1.0;
        if (uUseImportance)
        {
          vec4 sampledImportance = texture2D( uImportanceMap, vColorUv);
          if (sampledImportance.r < 0.001)
          {
            alpha = 0.0;
          }
        }

        float noiseStrength = uColorNoise;
        float offset = ((vRandomFactor * noiseStrength) - (noiseStrength / 2.0)) * 2.0;
        vec3 color = vec3(sampledDiffuseColor.x,sampledDiffuseColor.y,sampledDiffuseColor.z) * (1.0 + offset);
        diffuseColor *= vec4(color,alpha);;
        `
    );
  };

  const meshRef = useRef<THREE.InstancedMesh>(null);

  const [colorUVArray, randomArray] = useMemo(() => {
    setLoading(true);
    const getSeededRandom = rng(props.randomSeed.toString());
    const getSeededRandom2 = rng(props.randomSeed.toString());

    return [
      Float32Array.from(
        Array.from(
          { length: Math.max(props.particleCount, 0) * 2 },
          (value, index) => getSeededRandom() + 0.5 // Remap [0,1]
        )
      ),
      Float32Array.from(
        Array.from(
          { length: Math.max(props.particleCount, 0) },
          (value, index) => getSeededRandom2() + 0.5 // Remap [0,1]
        )
      ),
    ];
  }, [
    props.randomSeed,
    props.particleCount,
    props.imageWorldSize.width,
    props.imageWorldSize.height,
  ]);

  useEffect(() => {
    if (meshRef.current && props.particleCount >= 0) {
      for (let i = 0; i < props.particleCount; i++) {
        tempObject.position.set(
          (colorUVArray[i * 2] - 0.5) * props.imageWorldSize.width,
          (colorUVArray[i * 2 + 1] - 0.5) * props.imageWorldSize.height,
          distanceTowardsCamera
        );
        tempObject.scale.setScalar(
          props.strokeScale + props.scaleNoise * ((randomArray[i] - 0.5) * 2.0)
        );
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObject.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      setLoading(false);
    }
  }, [meshRef, colorUVArray, props.strokeScale, props.scaleNoise]);

  return (
    <>
      <instancedMesh
        args={[null, null, Math.max(props.particleCount, 0)]}
        ref={meshRef}
        visible={!loading}
        position={[0, 0, props.zOffset]}
      >
        <planeGeometry args={[0.1, 0.1]}>
          <instancedBufferAttribute attach="attributes-colorUv" args={[colorUVArray, 2]} />
          <instancedBufferAttribute attach="attributes-randomFactor" args={[randomArray, 1]} />
        </planeGeometry>
        <meshBasicMaterial
          alphaMap={texture}
          transparent={true}
          onBeforeCompile={(shader) => onBeforeCompile(shader)}
        />
      </instancedMesh>
    </>
  );
};

export default StrokeParticles;
