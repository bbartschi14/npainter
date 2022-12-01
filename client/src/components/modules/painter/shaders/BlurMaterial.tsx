import blurFragment from "./blurFragment";
import blurVertex from "./blurVertex";
import { shaderMaterial } from "@react-three/drei";
import { extend, ReactThreeFiber } from "@react-three/fiber";
import * as THREE from "three";

export const BlurMaterial = shaderMaterial(
  {
    uBaseColor: null,
    uFlip: false,
    uDirection: new THREE.Vector2(1, 0),
    uResolution: new THREE.Vector2(128, 128),
  },
  blurVertex,
  blurFragment
);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      blurMaterial: ReactThreeFiber.Object3DNode<typeof BlurMaterial, typeof BlurMaterial>;
    }
  }
}
