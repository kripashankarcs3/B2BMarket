import { Badge } from '@/components/ui';
import type { Specification } from '@/types';

interface ProductSpecsProps {
  specifications: Specification[];
  certifications: string[];
}

export function ProductSpecs({ specifications, certifications }: ProductSpecsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-ink-900 mb-4">Specifications</h3>
        <div className="bg-ink-50 rounded-[16px] overflow-hidden divide-y divide-ink-100">
          {specifications.map((spec, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-ink-500">{spec.label}</span>
              <span className="text-sm font-medium text-ink-900 text-right ml-4">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

      {certifications.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-ink-900 mb-3">Certifications</h3>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <Badge key={cert} variant="info" size="md">{cert}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
