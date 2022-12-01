import luminanceFragment from "./luminanceFragment";
import luminanceVertex from "./luminanceVertex";
import { shaderMaterial } from "@react-three/drei";
import { ReactThreeFiber } from "@react-three/fiber";
import * as THREE from "three";

export const LuminanceMaterial = shaderMaterial(
  {
    uBaseColor: null,
  },
  luminanceVertex,
  luminanceFragment
);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      luminanceMaterial: ReactThreeFiber.Object3DNode<
        typeof LuminanceMaterial,
        typeof LuminanceMaterial
      >;
    }
  }
}
