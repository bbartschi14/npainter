export default /* glsl */ `
varying vec2 vUv;
uniform sampler2D uBaseColor;

void main()
{
    gl_Position = vec4(position, 1.0);
    vUv = uv;
}
`;
