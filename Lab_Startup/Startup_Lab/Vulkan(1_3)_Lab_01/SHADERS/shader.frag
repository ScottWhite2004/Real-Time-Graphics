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

layout(push_constant) uniform PushConstants {
    mat4 model;
    float shininess;
    vec4 matAmbient;
} pushConstants;

layout(location = 0) in vec3 fragColor;
layout(location = 1) in vec3 fragWorldPos;
layout(location = 2) in vec3 fragWorldNormal;
layout(location = 3) in vec2 fragTexCoord;

layout(location = 0) out vec4 outColor;

void main() {
    
    // Transform position and normal to world space
    // Define light and material properties
    
    // White light
    //vec3 lightColor = vec3(1.0, 1.0, 0.0); // Light color
   // vec3 ambientMaterial = pushConstants.matAmbient.xyz; // Ambient light component
    
    // Diffuse calculation
    
    //vec3 norm = normalize(fragWorldNormal);
    //vec3 lightDir = normalize(ubo.lightPos.xyz - fragWorldPos);
    //float diff = max(dot(norm, lightDir), 0.0);
    //vec3 diffuse = diff * lightColor;


    //vec3 diffMaterial = textureColor.xyz;
    //vec3 viewDir = normalize(ubo.eye.xyz - fragWorldPos);
    //vec3 reflectDir = normalize(reflect(-lightDir, norm));
    //float shininess = pushConstants.shininess;
    //float spec = pow(max(dot(reflectDir, viewDir), 0.0), shininess);
    //vec3 specMaterial=vec3(1.0);
    //vec3 specular = specMaterial * lightColor * spec;


    //vec3 color = ambientMaterial * lightColor + specular + diffuse * diffMaterial;


    //Red light
    //lightColor = vec3(1.0, 1.0, 0.0); // Light color
    //ambientMaterial = pushConstants.matAmbient.xyz; // Ambient light component
    
    // Diffuse calculation
    
    //norm = normalize(fragWorldNormal);
    //lightDir = normalize(ubo.light2Pos.xyz - fragWorldPos);
    //diff = max(dot(norm, lightDir), 0.0);
    //diffuse = diff * lightColor;


   //diffMaterial = textureColor.xyz;
    //viewDir = normalize(ubo.eye.xyz - fragWorldPos);
    //reflectDir = normalize(reflect(-lightDir, norm));
    //shininess = pushConstants.shininess;
    //spec = pow(max(dot(reflectDir, viewDir), 0.0), shininess);
    //specMaterial=vec3(1.0);
    //specular = specMaterial * lightColor * spec;




    //vec4 coin = texture(texSampler[0], fragTexCoord);
    //vec4 base = texture(texSampler[1], fragTexCoord);
    //vec3 rgb = coin.xyz + base.xyz;
    //outColor = vec4(rgb, 1.0);

    vec3 N = normalize(fragWorldNormal);
    vec3 aN = abs(N);

    // identify dominant axis (which face of the cube)
    int face;
    if (aN.z > aN.x && aN.z > aN.y) {
        face = (N.z > 0.0) ? 0 : 1; // +Z front / -Z back
    } else if (aN.x > aN.y) {
        face = (N.x > 0.0) ? 2 : 3; // +X right / -X left
    } else {
        face = (N.y > 0.0) ? 4 : 5; // +Y top / -Y bottom
    }

    if(face == 4 || face ==5)
    {
    discard;
    }

    // For 2 textures: choose texture index by sign (example)
    // map positive-direction faces -> texture 0, negative-direction faces -> texture 1
    int texIdx = gl_FrontFacing ? 0 : 1;

    // Optionally use different UV scale per face
    vec2 uv = fragTexCoord;

    // safe clamp just in case
    texIdx = clamp(texIdx, 0, 1);

    vec4 sampled = texture(texSampler[texIdx], uv);

    // If coin (or second texture) has alpha and you want opaque result:
    sampled.a = 1.0;

    outColor = sampled;
}