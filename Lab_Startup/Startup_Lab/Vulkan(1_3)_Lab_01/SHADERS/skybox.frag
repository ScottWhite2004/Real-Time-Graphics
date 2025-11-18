#version 450

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
} ubo;

layout(binding = 4) uniform samplerCube skyboxSampler;

layout(push_constant) uniform PushConstants {
    mat4 model;
    float shininess;
    vec4 matAmbient;
} pushConstants;

layout(location = 3) in vec3 fragDir;
layout(location = 0) out vec4 outColor;

void main() {
    outColor = texture(skyboxSampler,normalize(fragDir));
}
