export type RegionalSocialLink = {
  label: "Instagram" | "Facebook" | "TikTok" | "LinkedIn";
  url: string;
};

export const regionalSocialLinks = {
  Egypt: [
    { label: "Instagram", url: "https://www.instagram.com/ldctravels.eg/" },
    { label: "Facebook", url: "https://www.facebook.com/profile.php?id=61591627376189" },
    { label: "TikTok", url: "https://www.tiktok.com/@ldc.travel.agency" },
    { label: "LinkedIn", url: "https://www.linkedin.com/company/ldctravel/" },
  ],
  "Saudi Arabia": [
    { label: "Instagram", url: "#" },
    { label: "Facebook", url: "#" },
    { label: "TikTok", url: "#" },
    { label: "LinkedIn", url: "#" },
  ],
} satisfies Record<string, RegionalSocialLink[]>;
