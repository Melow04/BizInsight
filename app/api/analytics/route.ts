import { getAnalytics } from '@/lib/data-store';

export async function GET() {
  return Response.json(getAnalytics());
}
