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

layout(location = 0) in vec3 fragColor;
layout(location = 1) in vec3 fragWorldPos;
layout(location = 2) in vec3 fragWorldNormal;

layout(location = 0) out vec4 outColor;

void main() {
    
    // Transform position and normal to world space
    // Define light and material properties
    
    // White light
    vec3 lightColor = vec3(1.0, 1.0, 1.0); // Light color
    vec3 ambientMaterial = pushConstants.matAmbient.xyz; // Ambient light component
    
    // Diffuse calculation
    
    vec3 norm = normalize(fragWorldNormal);
    vec3 lightDir = normalize(ubo.lightPos.xyz - fragWorldPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;


    vec3 diffMaterial = fragColor;
    vec3 viewDir = normalize(ubo.eye.xyz - fragWorldPos);
    vec3 reflectDir = normalize(reflect(-lightDir, norm));
    float shininess = pushConstants.shininess;
    float spec = pow(max(dot(reflectDir, viewDir), 0.0), shininess);
    vec3 specMaterial=vec3(1.0);
    vec3 specular = specMaterial * lightColor * spec;


    vec3 color = ambientMaterial * lightColor + diffuse * diffMaterial;

    color += specular;

    //Red light
    lightColor = vec3(1.0, 0.0, 0.0); // Light color
    ambientMaterial = pushConstants.matAmbient.xyz; // Ambient light component
    
    // Diffuse calculation
    
    norm = normalize(fragWorldNormal);
    lightDir = normalize(ubo.light2Pos.xyz - fragWorldPos);
    diff = max(dot(norm, lightDir), 0.0);
    diffuse = diff * lightColor;


    diffMaterial = fragColor;
    viewDir = normalize(ubo.eye.xyz - fragWorldPos);
    reflectDir = normalize(reflect(-lightDir, norm));
    shininess = pushConstants.shininess;
    spec = pow(max(dot(reflectDir, viewDir), 0.0), shininess);
    specMaterial=vec3(1.0);
    specular = specMaterial * lightColor * spec;


    color += ambientMaterial * lightColor + diffuse * diffMaterial;

    color += specular;

    outColor = vec4(color, 1.0);
}