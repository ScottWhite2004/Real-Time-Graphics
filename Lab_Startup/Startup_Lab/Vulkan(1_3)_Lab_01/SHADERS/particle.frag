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
    float time;
} ubo;

// removed texture sampler — color fading done procedurally

layout(location = 0) in vec3 fragColor;
layout(location = 1) in vec3 fragWorldPos;
layout(location = 2) in vec3 fragWorldNormal;
layout(location = 3) in vec2 fragTexCoord;

layout(location = 0) out vec4 outColor;

void main() {
    // base colour from vertex input
    vec3 baseColor = fragColor; // e.g. orange passed from vertex shader

    // target colour to fade into
    vec3 targetColor = vec3(1.0, 0.0, 0.0); // adjust as needed

    // map world Y to [0..1] across expected particle system height (match particleSystemHeight/2)
    const float minY = -60.0;
    const float maxY =  60.0;
    float h = (fragWorldPos.y - minY) / max(0.0001, (maxY - minY));
    h = clamp(h, 0.0, 1.0);

    // optional time pulse to add subtle animation
    float pulse = 0.5 + 0.5 * sin(ubo.time * 1.25 + fragTexCoord.x * 6.28318);

    // combine height-driven fade with pulse and clamp to valid range
    float fade = clamp(smoothstep(0.0, 1.0, h) * pulse, 0.0, 1.0);

    // final colour mixes base -> target by fade factor
    vec3 finalRGB = mix(baseColor, targetColor, fade);

    // keep full alpha (change if you want particles to fade out)
    float alpha = 1.0;

    outColor = vec4(finalRGB, alpha);
}