export function mapUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role?.toLowerCase(),
    avatar: user.avatar,
    company: user.companyName,
  };
}
