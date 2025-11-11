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

layout(binding = 1) uniform sampler2D texSampler[2];
layout(binding = 2) uniform sampler2D normalSampler;


layout(push_constant) uniform PushConstants {
    mat4 model;
    float shininess;
    vec4 matAmbient;
} pushConstants;

layout(location = 0) in vec3 fragColor;
layout(location = 1) in vec3 fragWorldPos;
layout(location = 2) in vec3 fragWorldNormal;
layout(location = 3) in vec2 fragTexCoord;
layout(location = 4) in vec3 fragLightPos_tangent;
layout(location = 5) in vec3 fragViewPos_tangent;


layout(location = 0) out vec4 outColor;

void main() {
    
    vec3 albedo = texture(texSampler[0], fragTexCoord).rgb;

    vec3 N_tangent = texture(normalSampler, fragTexCoord).rgb * 2.0 - 1.0;
    N_tangent = normalize(N_tangent);

    vec3 L = normalize(fragLightPos_tangent);
    vec3 V = normalize(fragViewPos_tangent);

    vec3 ambient = pushConstants.matAmbient.rgb * albedo;

    float NdotL = max(dot(N_tangent, L), 0.0);
    vec3 diffuse = NdotL * albedo;

    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N_tangent, H), 0.0), pushConstants.shininess);
    vec3 specular = spec * texture(texSampler[1], fragTexCoord).rgb;

    vec3 color = ambient + diffuse + specular;
    
    outColor = vec4(color, 1.0);
}