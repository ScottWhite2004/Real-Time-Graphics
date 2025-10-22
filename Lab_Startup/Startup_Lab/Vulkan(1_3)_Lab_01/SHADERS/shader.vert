#version 450

layout(binding = 0) uniform UniformBufferObject {
    mat4 view;
    mat4 proj;
} ubo;

layout(std140, binding = 0) uniform Camera{
    vec4 eye;
    vec4 center;
    vec4 up;
    float fovy;
    float aspect;
    float zNear;
    float zFar;
}cam;

layout(push_constant) uniform PushConstants {
    mat4 model;
} pushConstants;

layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec3 inColor;

layout(location = 0) out vec3 fragColor;

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
    float tanHalfFovy = tan(fovy * 0.5f);
    mat4 result = mat4(0.0);
    result[0][0] = 1.0f / (aspect * tanHalfFovy);
    result[1][1] = 1.0f / (tanHalfFovy);
    result[2][2] = -(zFar + zNear) / (zFar - zNear);
    result[2][3] = -1.0f;
    result[3][2] = -(2.0f * zFar * zNear) / (zFar - zNear);
    return result;
}

void main() {
    
    vec3 eyePos = cam.eye.xyz;
    vec3 centerPos = cam.center.xyz;
    vec3 upDir = cam.up.xyz;

    mat4 viewMatrix = lookAtRH(eyePos, centerPos, upDir);
    mat4 projMatrix = perspective(cam.fovy, cam.aspect, cam.zNear, cam.zFar);
    
    gl_Position = proj * view * pushConstants.model * vec4(inPosition, 1.0);
    gl_PointSize = 10.0;
    fragColor = inColor;
}