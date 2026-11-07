import { Container, Skeleton } from '@/components/ui';

export default function Loading() {
  return (
    <Container className="pt-28 pb-16">
      <Skeleton className="h-9 w-72 mb-3" />
      <Skeleton className="h-4 w-96 max-w-full mb-10" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
        ))}
      </div>
    </Container>
  );
}
