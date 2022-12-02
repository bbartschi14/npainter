import fragment from "./eigenFragment";
import vertex from "./eigenVertex";
import { shaderMaterial } from "@react-three/drei";
import { ReactThreeFiber } from "@react-three/fiber";
import * as THREE from "three";

export const EigenMaterial = shaderMaterial(
  {
    uBaseColor: null,
  },
  vertex,
  fragment
);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      eigenMaterial: ReactThreeFiber.Object3DNode<typeof EigenMaterial, typeof EigenMaterial>;
    }
  }
}
