import { getInquiries } from '@/lib/store';
import InquiriesList from './InquiriesList';

export default function AdminInquiries() {
  const inquiries = getInquiries();
  return <InquiriesList inquiries={inquiries} />;
}