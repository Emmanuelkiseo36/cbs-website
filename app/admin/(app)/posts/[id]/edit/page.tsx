import { notFound } from 'next/navigation';
import { getPostById, getMedia } from '@/lib/store';
import PostEditor from '../../PostEditor';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = getPostById(id);
  if (!post) notFound();
  const media = getMedia().map((m) => ({ id: m.id, url: m.url, filename: m.filename }));
  return <PostEditor post={post} media={media} />;
}