export default /* glsl */ `
varying vec2 vUv;
uniform sampler2D uBaseColor;
#define M_PI 3.1415926535897932384626433832795

void eigen(in mat2 J, out vec2 A0, out vec2 A1, out float r0, out float r1) {
    float d = determinant(J), t = J[0][0]+J[1][1],
          D = sqrt(t*t-4.*d); 
          r0 = (t+D)/2., r1 = (t-D)/2.;           
    A0 = normalize(vec2( -J[0][1], J[0][0] - r0 ));
    A1 = normalize(vec2( -J[0][1], J[0][0] - r1 ));
}

void main()
{
    vec4 sampleColor = (texture2D(uBaseColor, vUv) * 2.0) - 1.0;
    mat2 matrix = mat2(sampleColor.r, sampleColor.g, sampleColor.g, sampleColor.b);

    vec2 vector0;
    vec2 vector1;
    float value0;
    float value1;

    eigen(matrix, vector0, vector1, value0, value1);

    vec2 smallerVector;
    if (value0 < value1)
    {
        smallerVector = vector0;
    } else
    {
        smallerVector = vector1;
    }
    float angle = ((atan(smallerVector[1],smallerVector[0])/M_PI));

    gl_FragColor = vec4(angle,angle, angle, 1.0);
}`;
