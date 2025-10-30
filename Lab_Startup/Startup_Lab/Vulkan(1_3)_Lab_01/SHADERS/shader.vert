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
layout(location = 1) in vec3 inColor;
layout(location = 2) in vec3 inNormal;

layout(location = 0) out vec3 fragColor;
layout(location = 1) out vec3 fragWorldPos;
layout(location = 2) out vec3 fragWorldNormal; 

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
    
    vec3 eyePos = ubo.eye.xyz;
    vec3 centerPos = ubo.center.xyz;
    vec3 upDir = ubo.up.xyz;

    mat4 viewMatrix = lookAtRH(eyePos, centerPos, upDir);
    mat4 projMatrix = perspective(ubo.fovy, ubo.aspect, ubo.zNear, ubo.zFar);
    
    // Transform position and normal to world space
    //vec3 worldPos = (pushConstants.model * vec4(inPosition, 1.0)).xyz;
    //vec3 worldNormal = mat3(transpose(inverse(pushConstants.model))) * inNormal;
    // Define light and material properties
    //vec3 lightColor = vec3(1.0, 0.0, 0.0); // Light color
    //vec3 ambientMaterial = vec3(0.2, 0.1, 0.2); // Ambient light component
    // Diffuse calculation
    //vec3 norm = normalize(worldNormal);
    //vec3 lightDir = normalize(cam.lightPos.xyz - worldPos);
    //float diff = max(dot(norm, lightDir), 0.0);
    //vec3 diffuse = diff * lightColor;

    //vec3 viewDir = normalize(eyePos - worldPos);
    //vec3 reflectDir = normalize(reflect(-lightDir, norm));
    //float shininess = 1.0;
   //float spec = pow(max(dot(reflectDir, viewDir), 0.0), shininess);
    //vec3 specMaterial=vec3(1.0);
    //vec3 specular = specMaterial *lightColor*spec;
    // Combine and pass to fragment shader
    //vec3 diffMaterial=vec3(1.0);
    //fragColor = ambientMaterial* lightColor;
    //fragColor += diffMaterial* lightColor* diffuse;
    //fragColor += specular;

    fragWorldPos = (pushConstants.model * vec4(inPosition, 1.0)).xyz;
    fragWorldNormal = mat3(transpose(inverse(pushConstants.model))) * inNormal;
    fragColor = inColor;
    
    gl_Position = projMatrix * viewMatrix * pushConstants.model * vec4(inPosition, 1.0);
    gl_PointSize = 10.0;
}