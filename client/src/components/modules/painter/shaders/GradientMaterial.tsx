import fragment from "./gradientFragment";
import vertex from "./gradientVertex";
import { shaderMaterial } from "@react-three/drei";
import { ReactThreeFiber } from "@react-three/fiber";
import * as THREE from "three";

export const GradientMaterial = shaderMaterial(
  {
    uBaseColor: null,
    uResolution: new THREE.Vector2(128, 128),
  },
  vertex,
  fragment
);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      gradientMaterial: ReactThreeFiber.Object3DNode<
        typeof GradientMaterial,
        typeof GradientMaterial
      >;
    }
  }
}
