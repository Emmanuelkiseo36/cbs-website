import { getAdminPosts } from '@/lib/store';
import PostsList from './PostsList';

export default function AdminPosts() {
  const posts = getAdminPosts();
  return <PostsList posts={posts} />;
}