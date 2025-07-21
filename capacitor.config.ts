import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.iamsupreme.xox',
  appName: 'xox',
  webDir: 'dist/sos/browser',
  plugins: {
  BackgroundRunner: {
    label: 'com.iamsupreme.xox.listener',
    src: 'runners/runner.js',
    event: 'volumeEvent',
    repeat: true,
    interval: 1, // Check every minute
    autoStart: true
  }
}
};

export default config;
