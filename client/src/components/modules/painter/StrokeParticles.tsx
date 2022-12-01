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
  colorMap: THREE.Texture;
  importanceMap?: THREE.Texture;
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
        uniform bool uUseImportance;
        attribute vec2 colorUv;
        varying vec2 vColorUv;`
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
        vColorUv = colorUv;`
    );

    shader.uniforms.uColorMap = colorMapRef.current;
    shader.uniforms.uImportanceMap = importanceMapRef.current;
    shader.uniforms.uUseImportance = useImportanceRef.current;

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
        uniform sampler2D uColorMap;
        uniform sampler2D uImportanceMap;
        uniform bool uUseImportance;
        varying vec2 vColorUv;`
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
        diffuseColor *= vec4(sampledDiffuseColor.x,sampledDiffuseColor.y,sampledDiffuseColor.z,alpha);;
        `
    );
  };

  const meshRef = useRef<THREE.InstancedMesh>(null);

  const colorUVArray = useMemo(() => {
    setLoading(true);
    const getSeededRandom = rng(props.randomSeed.toString());

    return Float32Array.from(
      Array.from(
        { length: Math.max(props.particleCount, 0) * 2 },
        (value, index) => getSeededRandom() + 0.5
      ) // Remap [0,1]
    );
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
        tempObject.scale.setScalar(props.strokeScale);
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObject.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      setLoading(false);
    }
  }, [meshRef, colorUVArray, props.strokeScale]);

  return (
    <>
      <instancedMesh
        args={[null, null, Math.max(props.particleCount, 0)]}
        ref={meshRef}
        visible={!loading}
      >
        <planeGeometry args={[0.1, 0.1]}>
          <instancedBufferAttribute attach="attributes-colorUv" args={[colorUVArray, 2]} />
        </planeGeometry>
        {/* With depthTest off, we don't have to worry about z-fighting. Will have to consider render order */}
        <meshBasicMaterial
          alphaMap={texture}
          transparent={true}
          depthTest={true}
          onBeforeCompile={(shader) => onBeforeCompile(shader)}
        />
      </instancedMesh>
    </>
  );
};

export default StrokeParticles;
