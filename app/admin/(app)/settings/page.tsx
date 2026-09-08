import { getSettings } from '@/lib/store';
import SettingsManager from './SettingsManager';

export default function AdminSettings() {
  const settings = getSettings();
  return <SettingsManager settings={settings} />;
}