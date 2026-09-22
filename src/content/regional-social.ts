export type RegionalSocialLink = {
  label: "Instagram" | "Facebook";
  url: string;
};

export const regionalSocialLinks = {
  Egypt: [
    { label: "Instagram", url: "https://www.instagram.com/ldctravels.eg/" },
    { label: "Facebook", url: "https://www.facebook.com/profile.php?id=61591627376189" },
  ],
  "Saudi Arabia": [
    { label: "Instagram", url: "https://www.instagram.com/elwajha_elraeda_travels/" },
    { label: "Facebook", url: "https://www.facebook.com/profile.php?id=61575912646557#" },
  ],
} satisfies Record<string, RegionalSocialLink[]>;
