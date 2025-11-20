#version 450

#define particleSpeed 0.48
#define particleSpread 2.0
#define particleShape 0.37
#define particleSize 1.0
#define particleSystemHeight 10.0

layout(std140, binding = 0) uniform UniformBufferObject {
    vec4 eye;
    vec4 center;
    vec4 up;
    vec4 lightPos;
    vec4 light2Pos;
    float fovy;
    float aspect;
    float zNear;
    float zFar;
    float time; // make sure C++ writes this into the UBO each frame
} ubo;

layout(push_constant) uniform PushConstants {
    mat4 model;
    float shininess;
    vec4 matAmbient;
} pushConstants;

layout(location = 0) in vec3 inPosition;   // quad corner (-1..1)
layout(location = 1) in vec3 inColor;
layout(location = 2) in vec3 inNormal;
layout(location = 3) in vec2 inTexCoord;
// Instance attribute bound at binding 1, location 6
layout(location = 6) in vec3 inInstanceOffset; // uses .z as seed

layout(location = 0) out vec3 fragColor;
layout(location = 1) out vec3 fragWorldPos;
layout(location = 2) out vec3 fragWorldNormal;
layout(location = 3) out vec2 fragTexCoord;
layout(location = 4) out float fragLife;

mat4 lookAtRH(vec3 eye, vec3 center, vec3 up)
{
    vec3 z_axis = normalize(eye - center);
    vec3 x_axis = normalize(cross(up, z_axis));
    vec3 y_axis = cross(z_axis, x_axis);
    mat4 result = mat4(1.0);
    result[0][0] = x_axis.x;
    result[1][0] = x_axis.y;
    result[2][0] = x_axis.z;
    result[0][1] = y_axis.x;
    result[1][1] = y_axis.y;
    result[2][1] = y_axis.z;
    result[0][2] = z_axis.x;
    result[1][2] = z_axis.y;
    result[2][2] = z_axis.z;
    result[3][0] = -dot(x_axis, eye);
    result[3][1] = -dot(y_axis, eye);
    result[3][2] = -dot(z_axis, eye);
    return result;
}

mat4 perspective(float fovy, float aspect, float zNear, float zFar)
{
    float tanHalfFovy = tan(fovy * 0.5);
    mat4 result = mat4(0.0);
    result[0][0] = 1.0 / (aspect * tanHalfFovy);
    result[1][1] = 1.0 / (tanHalfFovy);
    result[2][2] = -(zFar + zNear) / (zFar - zNear);
    result[2][3] = -1.0;
    result[3][2] = -(2.0 * zFar * zNear) / (zFar - zNear);
    return result;
}

void main()
{
    // build camera matrices
    mat4 view = lookAtRH(ubo.eye.xyz, ubo.center.xyz, ubo.up.xyz);
    mat4 proj = perspective(ubo.fovy, ubo.aspect, ubo.zNear, ubo.zFar);

    // use instance z as a particle "seed" and animate using time
    float seed = inInstanceOffset.z;
    float t = fract(seed + particleSpeed * ubo.time);
    fragLife = t;

    // radial spread controlled by seed and t
    float angleX = 50.0 * seed;
    float angleZ = 120.0 * seed;
    vec3 basePos;
    basePos.x = particleSpread * t * cos(angleX);
    basePos.z = particleSpread * t * sin(angleZ);

    // vertical movement across the system height
    basePos.y = mix(particleSystemHeight * 0.5, -particleSystemHeight * 0.5, t);

    // create billboard offset from quad-local coordinates (inPosition.x/y)
    // compute inverse view to extract camera right/up vectors
    vec3 camRight = vec3(view[0][0], view[1][0], view[2][0]);
    vec3 camUp    = vec3(view[0][1], view[1][1], view[2][1]);

    // scale quad corners by particleSize and optional shape
    vec2 quadUV = inPosition.xy; // expected [-1..1] quad
    // shape factor modulates size along z/other if you like
    vec3 billboardOffset = (quadUV.x * camRight + quadUV.y * -camUp) * (particleSize * 0.5);

    // optionally add a seed-based jitter for more organic spread
    float jitter = (fract(sin(seed * 43758.5453) * 43758.5453) - 0.5) * particleShape;
    basePos += vec3(jitter, jitter * 0.5, jitter);

    // final world position for this quad vertex
    vec3 worldPos = (pushConstants.model * vec4(basePos, 1.0)).xyz + billboardOffset;

    // outputs
    fragWorldPos = worldPos;
    fragWorldNormal = normalize(mat3(transpose(inverse(pushConstants.model))) * inNormal);
    fragTexCoord = inTexCoord;
    fragColor = inColor;

    gl_Position = proj * view * vec4(worldPos, 1.0);
}