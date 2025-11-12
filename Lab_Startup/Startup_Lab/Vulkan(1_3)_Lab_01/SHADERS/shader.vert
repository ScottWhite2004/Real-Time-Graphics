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
layout(location = 3) in vec2 inTexCoord;
layout(location = 4) in vec3 inTangent;
layout(location = 5) in vec3 inBinormal;

layout(location = 0) out vec3 fragColor;
layout(location = 1) out vec3 fragWorldPos;
layout(location = 2) out vec3 fragWorldNormal; 
layout(location = 3) out vec2 fragTexCoord;
layout(location = 4) out vec3 fragLightPos_tangent;
layout(location = 5) out vec3 fragViewPos_tangent;
layout(location = 6) out vec3 fragPos_tangent;

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
        
        // Model -> World
    mat4 model = pushConstants.model;
    vec4 worldPos4 = model * vec4(inPosition, 1.0);
    fragWorldPos = worldPos4.xyz;

    // Normal matrix and world-space normal
    mat3 normalMat = mat3(transpose(inverse(model)));
    fragWorldNormal = normalize(normalMat * inNormal);

    vec3 T = normalize(normalMat * inTangent);
    vec3 N = normalize(normalMat * inNormal);
    vec3 B = normalize(normalMat * inBinormal);
    mat3 TBN = mat3(T, cross(T,N), N); // Tangent to World matrix
    TBN = transpose(TBN); // Use transpose to invert
    
    // Get world-space light and view positions
    vec3 lightPos_world = ubo.lightPos.xyz;
    vec3 viewPos_world = eyePos;
    vec3 fragPos_world = (model * vec4(inPosition, 1.0)).xyz;

    vec3 lightDir_world = lightPos_world - fragPos_world;
    vec3 viewDir_world  = viewPos_world  - fragPos_world;


    // Transform light and view POSITIONS to tangent space
    fragLightPos_tangent = TBN * lightDir_world;
    fragViewPos_tangent = TBN * viewDir_world;
    fragPos_tangent =TBN *fragPos_world;



    // Pass-through
    fragTexCoord = inTexCoord;
    fragColor = inColor;

    gl_Position = projMatrix * viewMatrix * model * vec4(inPosition, 1.0);
    gl_PointSize = 10.0;

}