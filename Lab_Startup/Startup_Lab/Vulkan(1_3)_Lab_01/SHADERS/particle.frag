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

// no texture sampler — colour is procedural

layout(location = 0) in vec3 fragColor;
layout(location = 1) in vec3 fragWorldPos;
layout(location = 2) in vec3 fragWorldNormal;
layout(location = 3) in vec2 fragTexCoord;
layout(location = 4) in float fragLife; // normalized lifetime from vertex

layout(location = 0) out vec4 outColor;

void main() {
    vec3 baseColor = fragColor;               // e.g. orange
    vec3 targetColor = vec3(1.0, 0.0, 0.0);   // fade-to colour (red)
    vec3 orangeColor = vec3(1.0, 0.5, 0.0);
    vec3 whiteColor = vec3(1.0, 1.0, 1.0);

    // correct lifetime clamp
    float life = clamp(fragLife, 0.0, 1.0);

    // Compute a per-fragment threshold so top pixels become "red" earlier.
    // top (y=1) -> threshold = 0.0, bottom (y=0) -> threshold = 1.0
    float threshold = 1.0 - fragTexCoord.y;

    // soften the transition edge (tweak edgeSoft to taste)
    float edgeSoft = 0.5;

    // localFade goes from 0->1 when life crosses the per-fragment threshold
    float localFade = smoothstep(threshold - edgeSoft, threshold + edgeSoft, life);

    // optional subtle time pulse (low amplitude so it doesn't dominate)
    float pulse = 1.0 + 0.06 * sin(ubo.time * 2.0 + fragTexCoord.x * 6.28318);

    float fade = clamp(localFade * pulse, 0.0, 1.0);

    vec3 finalRGB = mix(baseColor, targetColor, fade);
    float alpha = 1.0;

    outColor = vec4(finalRGB, alpha);
}