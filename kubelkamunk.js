/**
 * KubelkaMunk.js - A library for color mixing and optical calculations using Kubelka-Munk theory
 * 
 * The Kubelka-Munk theory is a mathematical model used to analyze the optical properties
 * of materials, particularly for predicting the behavior of paint mixtures, paper, textiles,
 * and other applications where light scattering and absorption are important.
 */

class KubelkaMunk {
  /**
   * Creates a new KubelkaMunk instance
   * @param {Object} options - Configuration options
   * @param {number[]} [options.wavelengths=[400, 410, ..., 700]] - Wavelengths (nm) for spectral calculations
   */
  constructor(options = {}) {
    // Default to visible spectrum wavelengths at 10nm intervals
    this.wavelengths = options.wavelengths || 
      Array.from({ length: 31 }, (_, i) => 400 + i * 10);
      
    // Store the CIE Standard Observer color matching functions (1931 2° observer)
    this.observer = {
      x: [0.0143, 0.0435, 0.1344, 0.2839, 0.3483, 0.3362, 0.2908, 0.1954, 0.0956, 0.032, 
          0.0049, 0.0093, 0.0633, 0.1655, 0.2904, 0.4334, 0.5945, 0.7621, 0.9163, 1.0263, 
          1.0622, 1.0026, 0.8544, 0.6424, 0.4479, 0.2835, 0.1649, 0.0874, 0.0468, 0.0227, 0.0114],
      y: [0.0004, 0.0012, 0.004, 0.0116, 0.023, 0.038, 0.06, 0.091, 0.139, 0.208, 
          0.323, 0.503, 0.71, 0.862, 0.954, 0.995, 0.995, 0.952, 0.87, 0.757, 
          0.631, 0.503, 0.381, 0.265, 0.175, 0.107, 0.061, 0.032, 0.017, 0.0082, 0.0041],
      z: [0.0679, 0.2074, 0.6456, 1.3856, 1.7471, 1.7721, 1.6692, 1.2876, 0.813, 0.4652, 
          0.272, 0.1582, 0.0782, 0.0422, 0.0203, 0.0087, 0.0039, 0.0021, 0.0017, 0.0011, 
          0.0008, 0.0003, 0.0002, 0, 0, 0, 0, 0, 0, 0, 0]
    };
    
    // Illuminant D65 normalized to Y=1
    this.illuminantD65 = [
      0.9642, 1.0, 0.9548, 1.0579, 1.0196, 1.0004, 1.0034, 0.9818, 0.9355, 0.9082,
      0.8747, 0.8347, 0.8173, 0.7739, 0.7386, 0.7172, 0.7002, 0.6838, 0.6706, 0.6597,
      0.6501, 0.6293, 0.6163, 0.5982, 0.5833, 0.5718, 0.5612, 0.5511, 0.5410, 0.5333, 0.5270
    ];
  }

  /**
   * Convert reflectance to absorption/scattering ratio (K/S value) using the Kubelka-Munk transform
   * @param {number} reflectance - Reflectance value [0,1]
   * @returns {number} K/S value
   */
  reflectanceToKS(reflectance) {
    // Handle edge cases
    if (reflectance <= 0) return 1000000; // Prevent division by zero with a large number
    if (reflectance >= 1) return 0;
    
    // Kubelka-Munk formula: K/S = (1-R)² / (2R)
    return Math.pow(1 - reflectance, 2) / (2 * reflectance);
  }

  /**
   * Convert K/S value back to reflectance
   * @param {number} ks - Absorption/scattering ratio (K/S)
   * @returns {number} Reflectance [0,1]
   */
  ksToReflectance(ks) {
    // Handle edge cases
    if (ks <= 0) return 1;
    if (ks >= 1000000) return 0;
    
    // Inverse Kubelka-Munk equation: R = 1 + K/S - sqrt((K/S)² + 2K/S)
    const root = Math.sqrt(ks * (ks + 2));
    return 1 + ks - root;
  }

  /**
   * Mix multiple colorants based on their spectral reflectance curves and concentrations
   * @param {Object[]} components - Array of components to mix
   * @param {number[]} components[].reflectance - Array of reflectance values matching wavelengths
   * @param {number} components[].concentration - Relative concentration of this component
   * @returns {number[]} Mixed reflectance curve
   */
  mixReflectance(components) {
    if (!components || components.length === 0) {
      return Array(this.wavelengths.length).fill(1); // Return white if no components
    }
    
    // Normalize concentrations to sum to 1
    const totalConcentration = components.reduce((sum, comp) => sum + comp.concentration, 0);
    const normalizedComponents = components.map(comp => ({
      ...comp,
      concentration: comp.concentration / totalConcentration
    }));
    
    // Calculate mixed K/S value for each wavelength
    const mixedKS = this.wavelengths.map((_, index) => {
      // Sum K/S values weighted by concentration
      return normalizedComponents.reduce((sum, comp) => {
        const reflectance = comp.reflectance[index] || 0;
        const ks = this.reflectanceToKS(reflectance);
        return sum + (ks * comp.concentration);
      }, 0);
    });
    
    // Convert K/S values back to reflectance
    return mixedKS.map(ks => this.ksToReflectance(ks));
  }

  /**
   * Calculate the XYZ tristimulus values from a reflectance curve
   * @param {number[]} reflectance - Reflectance values matching the instance wavelengths
   * @param {string} [illuminant='D65'] - The illuminant to use (currently only D65 supported)
   * @returns {Object} XYZ values normalized to Y=100 for a perfect reflector
   */
  reflectanceToXYZ(reflectance) {
    // Use the CIE Standard Observer for the calculations
    let X = 0, Y = 0, Z = 0;
    let sumWeights = 0;
    
    // Wavelength step to compute proper integration
    const wavelengthStep = (this.wavelengths[this.wavelengths.length - 1] - this.wavelengths[0]) / (this.wavelengths.length - 1);
    
    // Compute tristimulus values using the illuminant, reflectance, and color matching functions
    for (let i = 0; i < this.wavelengths.length; i++) {
      const illuminantFactor = this.illuminantD65[i];
      
      X += illuminantFactor * reflectance[i] * this.observer.x[i];
      Y += illuminantFactor * reflectance[i] * this.observer.y[i];
      Z += illuminantFactor * reflectance[i] * this.observer.z[i];
      sumWeights += illuminantFactor * this.observer.y[i];
    }
    
    // Normalize values
    const k = 100 / sumWeights;
    return {
      X: X * k,
      Y: Y * k,
      Z: Z * k
    };
  }

  /**
   * Convert XYZ color space values to RGB
   * @param {Object} xyz - XYZ color values
   * @param {number} xyz.X - X value
   * @param {number} xyz.Y - Y value
   * @param {number} xyz.Z - Z value
   * @returns {Object} sRGB values as {r, g, b} with values from 0 to 255
   */
  xyzToRGB(xyz) {
    // Normalize XYZ values
    const X = xyz.X / 100;
    const Y = xyz.Y / 100;
    const Z = xyz.Z / 100;
    
    // XYZ to linear RGB (sRGB primaries, D65 white point)
    let r = X * 3.2406 + Y * -1.5372 + Z * -0.4986;
    let g = X * -0.9689 + Y * 1.8758 + Z * 0.0415;
    let b = X * 0.0557 + Y * -0.2040 + Z * 1.0570;
    
    // Apply gamma correction (sRGB standard)
    const gammaCorrect = (linear) => {
      if (linear <= 0.0031308) {
        return 12.92 * linear;
      } else {
        return 1.055 * Math.pow(linear, 1/2.4) - 0.055;
      }
    };
    
    // Apply gamma and convert to 8-bit values
    r = Math.max(0, Math.min(255, Math.round(gammaCorrect(r) * 255)));
    g = Math.max(0, Math.min(255, Math.round(gammaCorrect(g) * 255)));
    b = Math.max(0, Math.min(255, Math.round(gammaCorrect(b) * 255)));
    
    return { r, g, b };
  }

  /**
   * Convert RGB to Hex color code
   * @param {Object} rgb - RGB values
   * @param {number} rgb.r - Red component (0-255)
   * @param {number} rgb.g - Green component (0-255)
   * @param {number} rgb.b - Blue component (0-255)
   * @returns {string} Hex color code
   */
  rgbToHex(rgb) {
    const toHex = (value) => {
      const hex = Math.max(0, Math.min(255, Math.round(value))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  /**
   * Convert reflectance curve directly to RGB
   * @param {number[]} reflectance - Reflectance values matching the instance wavelengths
   * @returns {Object} sRGB values as {r, g, b} with values from 0 to 255
   */
  reflectanceToRGB(reflectance) {
    const xyz = this.reflectanceToXYZ(reflectance);
    return this.xyzToRGB(xyz);
  }
  
  /**
   * Convert reflectance to CIELAB color space
   * @param {number[]} reflectance - Reflectance values
   * @returns {Object} CIELAB color values {L, a, b}
   */
  reflectanceToCIELAB(reflectance) {
    // First convert to XYZ
    const xyz = this.reflectanceToXYZ(reflectance);
    
    // Reference white (D65)
    const Xn = 95.047;
    const Yn = 100.000;
    const Zn = 108.883;
    
    // Calculate XYZ ratios
    const X = xyz.X / Xn;
    const Y = xyz.Y / Yn;
    const Z = xyz.Z / Zn;
    
    // Helper function for the XYZ to Lab transformation
    const f = (t) => {
      return t > 0.008856 ? Math.pow(t, 1/3) : (7.787 * t) + (16/116);
    };
    
    // Calculate L*a*b* values
    const L = Y > 0.008856 ? (116 * Math.pow(Y, 1/3) - 16) : (903.3 * Y);
    const a = 500 * (f(X) - f(Y));
    const b = 200 * (f(Y) - f(Z));
    
    return { L, a, b };
  }

  /**
   * Calculate color difference using CIEDE2000
   * @param {Object} lab1 - First color in CIELAB space {L, a, b}
   * @param {Object} lab2 - Second color in CIELAB space {L, a, b}
   * @returns {number} Color difference value
   */
  colorDifference(lab1, lab2, weights = { kL: 1, kC: 1, kH: 1 }) {
    // Extract CIELAB coordinates
    const L1 = lab1.L;
    const a1 = lab1.a;
    const b1 = lab1.b;
    const L2 = lab2.L;
    const a2 = lab2.a;
    const b2 = lab2.b;
    
    // Extract weights
    const kL = weights.kL;
    const kC = weights.kC;
    const kH = weights.kH;
    
    // Step 1: Calculate C1, C2, C̄ (mean C), G, a'1, a'2
    const C1 = Math.sqrt(a1 * a1 + b1 * b1);
    const C2 = Math.sqrt(a2 * a2 + b2 * b2);
    const Cab = (C1 + C2) / 2.0;
    
    // Calculate G using the mean C value
    const pow7 = Math.pow(Cab, 7);
    const G = 0.5 * (1 - Math.sqrt(pow7 / (pow7 + Math.pow(25, 7))));
    
    // Calculate a' values (a adjusted by G)
    const ap1 = (1 + G) * a1;
    const ap2 = (1 + G) * a2;
    
    // Step 2: Calculate C'1, C'2, h'1, h'2
    const Cp1 = Math.sqrt(ap1 * ap1 + b1 * b1);
    const Cp2 = Math.sqrt(ap2 * ap2 + b2 * b2);
    
    // Calculate h' values (hue angles in degrees)
    let hp1 = Math.atan2(b1, ap1) * 180 / Math.PI;
    if (hp1 < 0) hp1 += 360;
    
    let hp2 = Math.atan2(b2, ap2) * 180 / Math.PI;
    if (hp2 < 0) hp2 += 360;
    
    // Step 3: Calculate ΔL', ΔC', ΔH'
    const deltaL = L2 - L1;
    const deltaCp = Cp2 - Cp1;
    
    // Calculate ΔH'
    let deltaHp;
    const Cp1Cp2 = Cp1 * Cp2;
    
    if (Cp1Cp2 === 0) {
      deltaHp = 0;
    } else {
      let dhp = hp2 - hp1;
      if (dhp > 180) dhp -= 360;
      else if (dhp < -180) dhp += 360;
      
      // Adjustment to ΔH' calculation
      deltaHp = 2 * Math.sqrt(Cp1Cp2) * Math.sin(dhp * Math.PI / 360);
    }
    
    // Step 4: Calculate CIEDE2000 color difference
    // Calculate mean values for L', C', h'
    const Lp = (L1 + L2) / 2;
    const Cp = (Cp1 + Cp2) / 2;
    
    // Calculate mean hue value
    let hp;
    if (Cp1Cp2 === 0) {
      hp = hp1 + hp2;
    } else {
      hp = (hp1 + hp2) / 2;
      // Adjust mean hue when difference > 180°
      if (Math.abs(hp1 - hp2) > 180) {
        if (hp1 + hp2 < 360) {
          hp += 180;
        } else {
          hp -= 180;
        }
      }
    }
    
    // Calculate T for hue rotation term
    const T = 1 - 0.17 * Math.cos((hp - 30) * Math.PI / 180)
              + 0.24 * Math.cos((2 * hp) * Math.PI / 180)
              + 0.32 * Math.cos((3 * hp + 6) * Math.PI / 180)
              - 0.20 * Math.cos((4 * hp - 63) * Math.PI / 180);
    
    // Calculate RT for hue rotation factor
    const deg2rad = Math.PI / 180;
    const dhp_275 = hp - 275;
    const dCp7 = Math.pow(Cp, 7);
    const RT = -2 * Math.sqrt(dCp7 / (dCp7 + Math.pow(25, 7)))
              * Math.sin(60 * Math.exp(-1 * dhp_275 * dhp_275 / (25 * 25)) * deg2rad);
    
    // Calculate SL, SC, SH (the weighting functions)
    const SL = 1 + ((0.015 * Math.pow(Lp - 50, 2)) / Math.sqrt(20 + Math.pow(Lp - 50, 2)));
    const SC = 1 + 0.045 * Cp;
    const SH = 1 + 0.015 * Cp * T;
    
    // Final color difference
    const deltaL_term = deltaL / (kL * SL);
    const deltaC_term = deltaCp / (kC * SC);
    const deltaH_term = deltaHp / (kH * SH);
    const rotation_term = RT * deltaC_term * deltaH_term;
    
    const deltaE = Math.sqrt(
      deltaL_term * deltaL_term +
      deltaC_term * deltaC_term +
      deltaH_term * deltaH_term +
      rotation_term
    );
    
    return deltaE;
  }
}

// Make the class available globally
if (typeof window !== 'undefined') {
  window.KubelkaMunk = KubelkaMunk;
}