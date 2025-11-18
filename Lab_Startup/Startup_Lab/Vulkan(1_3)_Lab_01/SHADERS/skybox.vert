#version 450
layout(std140, binding = 0) uniform UniformBufferObject{
    vec4 eye;
    vec4 center;
    vec4 up;
    vec4 lightPos;
    vec4 light2Pos;
    float fovy;
    float aspect;
    float zNear;
    float zFar;
}ubo;

layout(push_constant) uniform PushConstants {
    mat4 model;
    float shininess;
    vec4 matAmbient;
} pushConstants;

layout(location = 0) in vec3 inPosition;

layout(location = 3) out vec3 fragDir;

mat4 viewRotationOnly(vec3 eye, vec3 center, vec3 up) {
    vec3 f = normalize(center - eye);
    vec3 s = normalize(cross(f, up));
    vec3 u = cross(s, f);
    mat4 v = mat4(1.0);
    v[0][0] = s.x; v[1][0] = s.y; v[2][0] = s.z;
    v[0][1] = u.x; v[1][1] = u.y; v[2][1] = u.z;
    v[0][2] = -f.x; v[1][2] = -f.y; v[2][2] = -f.z;
    return v; // no translation -> skybox stays centered
}

mat4 perspective(float fovy, float aspect, float zNear, float zFar)
{
    float tanHalfFovy = tan(fovy * 0.5f);
    mat4 result = mat4(0.0);
    result[0][0] = 1.0f / (aspect * tanHalfFovy);
    result[1][1] = 1.0f / (tanHalfFovy);
    result[2][2] = -(zFar + zNear) / (zFar - zNear);
    result[2][3] = -1.0f;
    result[3][2] = -(2.0f * zFar * zNear) / (zFar - zNear);
    return result;
}

void main()
{
    fragDir = inPosition;
    mat4 view = viewRotationOnly(ubo.eye.xyz, ubo.center.xyz, ubo.up.xyz);
    mat4 proj = perspective(ubo.fovy, ubo.aspect, ubo.zNear, ubo.zFar);
    proj[1][1] *= -1; // flip Y for Vulkan
    mat4 modelRotScale = mat4(mat3(pushConstants.model));
    gl_Position = proj * view * modelRotScale * vec4(inPosition, 1.0);
}

