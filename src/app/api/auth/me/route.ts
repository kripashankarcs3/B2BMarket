import { getAuthenticatedUser, success, unauthorized } from '@/lib/auth-helpers';
import { mapUser } from '@/lib/mappers/user.mapper';

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return unauthorized();
  }

  return success(mapUser(user));
}
