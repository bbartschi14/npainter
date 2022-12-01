export default /* glsl */ `
varying vec2 vUv;
uniform sampler2D uLuminance;
uniform sampler2D uBlurred;

void main()
{
    gl_Position = vec4(position, 1.0);
    vUv = uv;
}
`;
