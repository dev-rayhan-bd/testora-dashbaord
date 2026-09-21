import { cn } from "@/lib/utils";
import { Ban, UserRoundCheck, UserRoundMinus, Users } from "lucide-react";

type UserStats = {
  total: number;
  active: number;
  suspended: number;
  inactive: number;
};

type StatsCardsProps = {
  stats: UserStats;
};

const statItems = [
  {
    key: "total" as const,
    label: "Total Users",
    icon: Users,
    iconWrap: "border-[#d7e6f4] bg-[#eff5fc] text-[#2f86d8]",
  },
  {
    key: "active" as const,
    label: "Active",
    icon: UserRoundCheck,
    iconWrap: "border-[#d4ecde] bg-[#eaf7f0] text-[#3ea666]",
  },
  {
    key: "suspended" as const,
    label: "Suspended",
    icon: Ban,
    iconWrap: "border-[#f3dddd] bg-[#feefef] text-[#db6f6f]",
  },
  {
    key: "inactive" as const,
    label: "Inactive",
    icon: UserRoundMinus,
    iconWrap: "border-[#f0dfb9] bg-[#fff6e3] text-[#c48a2e]",
  },
];

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        const value = stats[item.key];

        return (
          <div key={item.key} className="rounded-lg border border-[#dce7f2] bg-white p-3.5">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md border",
                  item.iconWrap
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[22px] leading-6 font-semibold text-[#3f5f7a]">{value}</p>
                <p className="text-[11px] text-[#90a3b6]">{item.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
