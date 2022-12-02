export default /* glsl */ `
varying vec2 vUv;
uniform sampler2D uBaseColor;
uniform vec2 uResolution;

void make_kernel(inout vec4 n[9], sampler2D tex, vec2 coord)
{
	float w = 1.0 / uResolution.x;
	float h = 1.0 / uResolution.y;

	n[0] = texture2D(tex, coord + vec2( -w, -h));
	n[1] = texture2D(tex, coord + vec2(0.0, -h));
	n[2] = texture2D(tex, coord + vec2(  w, -h));
	n[3] = texture2D(tex, coord + vec2( -w, 0.0));
	n[4] = texture2D(tex, coord);
	n[5] = texture2D(tex, coord + vec2(  w, 0.0));
	n[6] = texture2D(tex, coord + vec2( -w, h));
	n[7] = texture2D(tex, coord + vec2(0.0, h));
	n[8] = texture2D(tex, coord + vec2(  w, h));
}

void main()
{
    vec4 n[9];
	make_kernel( n, uBaseColor, vUv );
    
    float gradientXWeights[9] = float[9](1.0, 0.0, -1.0, 2.0, 0.0, -2.0, 1.0, 0.0, -1.0);
    float gradientX = 0.0;
    for (int i = 0; i < 9; i++)
    {
        gradientX += n[i].r * gradientXWeights[i];
    }

    float gradientYWeights[9] = float[9](-1.0, -2.0, -1.0, 0.0, 0.0, 0.0, 1.0, 2.0, 1.0);
    float gradientY = 0.0;
    for (int i = 0; i < 9; i++)
    {
        gradientY += n[i].r * gradientYWeights[i];
    }

    vec3 tensor = vec3(gradientX * gradientX, gradientX * gradientY, gradientY * gradientY);
    tensor = (tensor + 1.0) / 2.0;
    gl_FragColor = vec4(tensor, 1.0);
}`;
