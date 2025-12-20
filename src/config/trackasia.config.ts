export const TRACKASIA_CONFIG = {
  API_KEY: '397e4be46eddc37caaba1766117133491b',
  BASE_API_URL: 'https://maps.track-asia.com/api/v1',
  STYLE_URL_FULL: `https://maps.track-asia.com/styles/v1/streets.json?key=397e4be46eddc37caaba1766117133491b`,
  DEFAULT_CENTER: [106.660172, 10.762622] as [number, number], // TP.HCM [lng, lat]
  DEFAULT_ZOOM: 14,
} as const;