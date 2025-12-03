
export const BRAND_COLORS = {
  // Original Brand Colors (Keep for accents)
  primary: {
    beSua: '#FAEDC0',      // Cream - For backgrounds, highlights
    xanhBo: '#D4DF9A',     // Light Green - For secondary elements
    xanhReu: '#606A37',    // Moss Green - For primary buttons, emphasis
  },
  
  secondary: {
    xanhChanh: '#BADA55',  // Xanh chanh
    xanhNeon: '#D5E100',   // Xanh neon
    nauEspresso: '#5B4537', // Nâu Espresso
    hongSua: '#F1A5A1',    // Hồng sữa
    reuDam: '#444E27',     // Rêu đậm
    nauCaramel: '#BC9E70', // Nâu Caramel
    vangNhat: '#F9E5A0',   // Light Yellow - For promotions
    camNhat: '#FFB380',    // Light Orange - For special offers
  },
  
  text: {
    primary: '#1A1A1A',      // Near black - Main text
    secondary: '#4A4A4A',    // Dark gray - Supporting text
    tertiary: '#8A8A8A',     // Medium gray - Hints, placeholders
    disabled: '#BDBDBD',     // Light gray - Disabled state
    inverse: '#FFFFFF',      // White - Text on dark backgrounds
    accent: '#606A37',       // Moss green - Links, emphasis
  },
  
  background: {
    primary: '#FFFFFF',      // Pure white - Main surfaces
    secondary: '#F8F8F8',    // Off white - Card backgrounds
    tertiary: '#F0F0F0',     // Light gray - Input fields
    paper: '#FFFFFF',        // White - Modal, sheets
    default: '#F5F5F5',      // Very light gray - App background
    black: '#000000',        // Black - Dark mode backgrounds
  },
  
  border: {
    light: '#E8E8E8',        // Very light gray - Subtle dividers
    medium: '#D0D0D0',       // Light gray - Standard borders
    dark: '#A0A0A0',         // Medium gray - Emphasized borders
    focus: '#606A37',        // Moss green - Focus state
  },
  
  semantic: {
    success: '#4CAF50',      // Green - Success states
    error: '#E74C3C',        // Red - Errors, destructive actions
    warning: '#FF9800',      // Orange - Warnings, alerts
    info: '#2196F3',         // Blue - Information, tips
  },
  
  // OVERLAY (NEW)
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',   // Light modal overlay
    medium: 'rgba(0, 0, 0, 0.5)',  // Standard overlay
    dark: 'rgba(0, 0, 0, 0.7)',    // Heavy overlay
  },
  
  // SHADOWS (NEW)
  shadow: {
    light: 'rgba(0, 0, 0, 0.08)',  // Subtle shadow
    medium: 'rgba(0, 0, 0, 0.15)',  // Standard shadow
    heavy: 'rgba(0, 0, 0, 0.25)',   // Strong shadow
  },
};

// Legacy aliases for backward compatibility
export const COLORS = BRAND_COLORS;