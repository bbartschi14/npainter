import fragment from "./highFreqFragment";
import vertex from "./highFreqVertex";
import { shaderMaterial } from "@react-three/drei";
import { ReactThreeFiber } from "@react-three/fiber";
import * as THREE from "three";

export const HighFreqMaterial = shaderMaterial(
  {
    uLuminance: null,
    uBlurred: null,
  },
  vertex,
  fragment
);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      highFreqMaterial: ReactThreeFiber.Object3DNode<
        typeof HighFreqMaterial,
        typeof HighFreqMaterial
      >;
    }
  }
}
