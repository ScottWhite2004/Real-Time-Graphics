#version 450

layout(std140, set = 0, binding = 0) uniform UniformBufferObject {
    vec4 eye;
    vec4 center;
    vec4 up;
    vec4 lightPos;
    vec4 light2Pos;
    float fovy;
    float aspect;
    float zNear;
    float zFar;
    float time;
} ubo;

layout(set = 0, binding = 1) uniform sampler2D sceneTexture;

layout(push_constant) uniform PushConstants {
    mat4 model;
    float shininess;
    vec4 matAmbient;
} pushConstants;

layout(location = 3) in vec2 fragTexCoord;
layout(location = 0) out vec4 outColor;

vec3 poissonBlur(sampler2D tex, vec2 uv, vec2 pixelSize, float radius) 
{
    vec3 sum = vec3(0.0);
    int count = 0;
    int r = int(radius);
    for (int j = -r; j <= r; ++j) 
    {
        for (int i = -r; i <= r; ++i) 
        {
            vec2 offset = vec2(i, j) * pixelSize;
            sum += texture(tex, uv + offset).rgb;
            count++;
        }
    }
    return sum / float(count);
}

//Based on fractal brownian motion
float animatedRadius(vec2 uv, float time) {
    float amplitude = 75.0;
    float frequency = 10;
    float value = 0.0;
    const int octaves = 20;
    const float gain = 0.55;
    const float lacunarity = 2.2;
    for (int o = 0; o < octaves; ++o) {
        value += sin((uv.x + time * 0.3) * frequency) * amplitude;
        value += cos((uv.y + time * 0.3) * frequency) * amplitude;
        amplitude *= gain;
        frequency *= lacunarity;
    }
    // Normalize to 0..1 (approx) then map
    value = abs(value); // remove negative
    return clamp(4.0 + value * 0.15, 1.0, 60.0);
}

void main() {
    vec2 uv = fragTexCoord;
    vec3 original = texture(sceneTexture, uv).rgb;
    vec2 pixelSize = 1.0 / vec2(textureSize(sceneTexture, 0));

    float amplitude = 20.0; // Adjust amplitude as needed
    float frequency = 5.0;
    float radius = animatedRadius(uv, ubo.time);
    vec3 blurred = vec3(0.0);
    blurred = poissonBlur(sceneTexture, uv, pixelSize, radius);

   
    blurred += original;
    vec3 fireTintLow = vec3(10.0, 1.0, 0.0);
    vec3 fireTintHigh = vec3(1.0, 1.0, 0.0);
    float t = clamp(uv.y, 0.0, 1.0);
    vec3 fireTint = mix(fireTintLow, fireTintHigh, t);
    original *= fireTint;

    if(original.r <= 0.001)
    {
        original = vec3(fireTint.x * blurred.x * 25, fireTint.y * blurred.y * 25, fireTint.z * blurred.z * 25);
    }

    original += blurred;
    original *= blurred * 3.0;

    outColor = vec4(original, 1.0);
}