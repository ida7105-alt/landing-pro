export const CONFIG = {
    // 顏色設定: [R, G, B, A] -> 白色 50% 透明度
    color: [1.0, 1.0, 1.0, 0.5], 
    
    // 波浪物理參數
    waveSpeed: 0.8,         // 波浪流動速度
    waveFrequency: 1.5,     // 波浪密度
    waveAmplitude: 0.25,    // 波浪起伏高度
    
    // 滑鼠互動參數
    mouseSensitivity: 0.15, // 滑鼠影響旋轉的強度
    lerpSpeed: 0.05,        // 慣性平滑速度 (越小越滑)
    
    // 進場動態
    baseScale: 0.4,         // Loading 完後的縮小比例
    transitionDelay: 2500   // 模擬 Loading 時間 (毫秒)
};