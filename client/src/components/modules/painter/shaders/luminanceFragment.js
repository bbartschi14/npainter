export default /* glsl */ `
varying vec2 vUv;
uniform sampler2D uBaseColor;

void main()
{
    float weights[3] = float[3](0.299, 0.587, 0.114);

    vec4 sampleColor = texture2D(uBaseColor, vUv);

    float weighted_sum = 0.0;
    float sum = 0.0;
    for (int i = 0; i < 3; i++)
    {
        weighted_sum += sampleColor[i] * weights[i];
        sum += weights[i];
    }
    vec4 final = vec4(weighted_sum / sum);
    gl_FragColor = vec4(final.rgb, 1.0);
}`;
