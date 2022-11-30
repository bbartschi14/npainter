import React, { useMemo, useEffect, useLayoutEffect, useRef } from "react";
import { Instances, Instance, useTexture } from "@react-three/drei";
import { Dimensions } from "../image/types";
import brush0 from "./brushes/brush.png";
import brush1 from "./brushes/longBrush.png";
import brush2 from "./brushes/longBrush2.png";
import * as THREE from "three";

type StrokeParticlesProps = {
  imageWorldSize: Dimensions;
  particleCount: number;
  colorMap: THREE.Texture;
};

const tempObject = new THREE.Object3D();
const distanceTowardsCamera = 0.1;

const StrokeParticles = (props: StrokeParticlesProps) => {
  const texture = useTexture(brush2);

  const colorMapRef = useRef({ value: null });
  // @ts-ignore
  useEffect(() => {
    colorMapRef.current.value = props.colorMap;
  }, [props.colorMap]);

  const colorUVArray = useMemo(
    () =>
      Float32Array.from(
        Array.from({ length: props.particleCount * 2 }, (value, index) => Math.random())
      ),
    [props.particleCount, props.imageWorldSize.width, props.imageWorldSize.height]
  );

  useLayoutEffect(() => {
    texture.magFilter = THREE.NearestFilter;
  }, [texture]);

  const onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>
        uniform sampler2D uColorMap;
        attribute vec2 colorUv;
        varying vec2 vColorUv;`
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
        vColorUv = colorUv;`
    );

    shader.uniforms.uColorMap = colorMapRef.current;

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
        uniform sampler2D uColorMap;
        varying vec2 vColorUv;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <alphamap_fragment>",
      `
        #include <alphamap_fragment>
        vec4 sampledDiffuseColor = texture2D( uColorMap, vColorUv );
        //diffuseColor.b = vColorUv.r;
        //diffuseColor.g = vColorUv.g;
        //diffuseColor.r = 0.0;
        diffuseColor *= vec4(sampledDiffuseColor.x,sampledDiffuseColor.y,sampledDiffuseColor.z,1.0);
        `
    );
  };

  const meshRef = useRef<THREE.InstancedMesh>();

  useEffect(() => {
    if (meshRef.current) {
      for (let i = 0; i < props.particleCount; i++) {
        tempObject.position.set(
          (colorUVArray[i * 2] - 0.5) * props.imageWorldSize.width,
          (colorUVArray[i * 2 + 1] - 0.5) * props.imageWorldSize.height,
          distanceTowardsCamera
        );
        tempObject.scale.setScalar(5);
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObject.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      meshRef.current.geometry.attributes.colorUv.needsUpdate = true;
    }
  }, [meshRef, colorUVArray]);

  return (
    <instancedMesh args={[null, null, props.particleCount]} ref={meshRef}>
      <planeGeometry args={[0.1, 0.1]}>
        <instancedBufferAttribute attach="attributes-colorUv" args={[colorUVArray, 2]} />
      </planeGeometry>
      {/* With depthTest off, we don't have to worry about z-fighting. Will have to consider render order */}
      <meshBasicMaterial
        alphaMap={texture}
        transparent={true}
        depthTest={false}
        onBeforeCompile={(shader) => onBeforeCompile(shader)}
      />
    </instancedMesh>
  );
};

export default StrokeParticles;
