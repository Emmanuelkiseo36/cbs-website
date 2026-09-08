import { getMedia } from '@/lib/store';
import PostEditor from '../PostEditor';

export default function NewPostPage() {
  const media = getMedia().map((m) => ({ id: m.id, url: m.url, filename: m.filename }));
  return <PostEditor post={null} media={media} />;
}