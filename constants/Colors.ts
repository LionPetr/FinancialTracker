const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

// Fixed brand colors: intentionally the SAME in light and dark mode.
const brand = '#2f95dc';
const onBrand = '#fff'; // text/icons that sit ON TOP of a brand-colored surface
const danger = '#e3342f';

export default {
  light: {
    text: '#000',
    textMuted: '#666',
    background: '#fff',
    card: '#fff',
    border: '#ccc',
    separator: '#eee',
    placeholder: '#888',
    tint: tintColorLight,
    brand,
    onBrand,
    danger,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    textMuted: '#888',
    background: '#000',
    card: '#1c1c1e',
    border: '#444',
    separator: 'rgba(255,255,255,0.1)',
    placeholder: '#888',
    tint: tintColorDark,
    brand,
    onBrand,
    danger,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
