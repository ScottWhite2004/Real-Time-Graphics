#version 450
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

layout(binding = 1) uniform sampler2D texSampler;
layout(binding = 2) uniform sampler2D normalSampler;
layout(binding = 3) uniform sampler2D heightSampler;
layout(binding = 4) uniform samplerCube skyboxSampler;


layout(push_constant) uniform PushConstants {
    mat4 model;
    float shininess;
    vec4 matAmbient;
} pushConstants;

layout(location = 3) in vec3 fragTexCoord;
layout(location = 1) in vec3 viewDir;

layout(location = 0) out vec4 outColor;

void main()
{
    outColor = texture(skyboxSampler, fragTexCoord);
}
