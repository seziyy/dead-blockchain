import type { ChainMetric } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export function SuspiciousWalletTable({ chain }: { chain: ChainMetric }) {
  return (
    <div className="glass overflow-hidden">
      <div className="border-b-[3px] border-app-line p-5">
        <h2 className="text-xl font-black uppercase text-app-text">Top Contracts by Automated Activity</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="border-b-[3px] border-app-line bg-app-elevated text-app-text">
            <tr>
              <th className="px-5 py-3 font-black uppercase">Contract</th>
              <th className="px-5 py-3 font-black uppercase">Category</th>
              <th className="px-5 py-3 font-black uppercase">Automated share</th>
              <th className="px-5 py-3 font-black uppercase">Interactions</th>
            </tr>
          </thead>
          <tbody className="divide-y-[3px] divide-app-line">
            {chain.automatedContracts.map((contract) => (
              <tr key={contract.contract} className="text-app-muted">
                <td className="px-5 py-4 font-mono font-black text-app-text">{contract.contract}</td>
                <td className="px-5 py-4">{contract.category}</td>
                <td className="px-5 py-4">
                  <span className="accent-stamp border-[3px] border-app-line px-2 py-1 text-xs font-black">
                    {contract.automatedShare}%
                  </span>
                </td>
                <td className="px-5 py-4">{formatNumber(contract.interactions)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
