#version 450

layout(std140, binding = 0) uniform UniformBufferObject{
    vec4 eye;
    vec4 center;
    vec4 up;
    vec3 lightPos;
    float fovy;
    float aspect;
    float zNear;
    float zFar;
}ubo;

layout(location = 0) in vec3 fragColor;
layout(location = 1) in vec3 fragWorldPos;
layout(location = 2) in vec3 fragWorldNormal;

layout(location = 0) out vec4 outColor;

void main() {
    
    // Transform position and normal to world space
    // Define light and material properties
    
    vec3 lightColor = vec3(1.0, 0.0, 0.0); // Light color
    vec3 ambientMaterial = vec3(0.2, 0.1, 0.2); // Ambient light component
    
    // Diffuse calculation
    
    vec3 norm = normalize(fragWorldNormal);
    vec3 lightDir = normalize(ubo.lightPos.xyz - fragWorldPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;


    vec3 diffMaterial = fragColor;

    vec3 color = ambientMaterial * lightColor + diffuse * diffMaterial;
    outColor = vec4(color, 1.0);
}