export default /* glsl */ `
varying vec2 vUv;
uniform sampler2D uLuminance;
uniform sampler2D uBlurred;

void main()
{
    vec4 sampleLuminance = texture2D(uLuminance, vUv);
    vec4 sampleBlurred = texture2D(uBlurred, vUv);

    vec4 final = sampleLuminance - sampleBlurred;
    gl_FragColor = vec4(final.r * final.r, final.g * final.g, final.b * final.b, 1.0);
}`;
