import { generateRecommendations } from '@/lib/data-store';

export async function GET() {
  return Response.json(generateRecommendations());
}
