export interface Tab {
  value: string;
  label: string;
}

export const TABS: Tab[] = [
  { value: "Upcoming", label: "Upcoming" },
  { value: "Ongoing", label: "Ongoing" },
  { value: "Premium", label: "Premium" },
  { value: "Completed", label: "Completed" },
];

export const TAB_MAPPING: Record<string, string> = {
  Upcoming: "Upcoming Launches",
  Ongoing: "New Launches",
  Premium: "Premium Properties",
  Completed: "Featured Properties",
};