import { getMedia } from '@/lib/store';
import MediaManager from './MediaManager';

export default function AdminMedia() {
  const media = getMedia();
  return <MediaManager media={media} />;
}