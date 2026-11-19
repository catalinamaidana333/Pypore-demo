import { ExternalLink } from 'lucide-react';
import { truncateHash } from '@/lib/format';

interface HederaTransactionLinkProps {
  transactionId: string;
  hashscanUrl: string;
  className?: string;
}

export function HederaTransactionLink({
  transactionId,
  hashscanUrl,
  className = '',
}: HederaTransactionLinkProps) {
  return (
    <a
      href={hashscanUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={transactionId}
      className={`inline-flex items-center gap-1.5 font-mono text-[#1E6B4F] underline decoration-[#9DB9AB] underline-offset-2 transition hover:text-[#10201A] ${className}`}
    >
      <ExternalLink size={11} className="shrink-0" />
      {truncateHash(transactionId)}
    </a>
  );
}
