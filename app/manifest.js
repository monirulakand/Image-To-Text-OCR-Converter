/**
 * Web App Manifest — generated at /manifest.webmanifest
 * (replaces the static public/manifest.json used by Create React App).
 */
export default function manifest() {
    return {
        name: 'Optical Character Recognition',
        short_name: 'OCR',
        description:
            'Optical Character Recognition (OCR) converts an image of text into a machine-readable text format.',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/favicon.ico',
                sizes: '64x64 32x32 24x24 16x16',
                type: 'image/x-icon',
            },
            {
                src: '/logo192.png',
                type: 'image/png',
                sizes: '192x192',
            },
            {
                src: '/logo512.png',
                type: 'image/png',
                sizes: '512x512',
            },
        ],
    };
}
