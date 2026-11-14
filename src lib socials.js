import { AtSign, Facebook, Instagram, Linkedin } from "lucide-react";

export const SOCIAL_NETWORKS = [
  {
    key: "linkedin",
    label: "LinkedIn",
    placeholder: "linkedin.com/in/yourname",
    color: "#0A66C2",
    icon: Linkedin,
    base: "https://www.linkedin.com/in/",
  },
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "instagram.com/yourhandle",
    color: "#E1306C",
    icon: Instagram,
    base: "https://www.instagram.com/",
  },
  {
    key: "facebook",
    label: "Facebook",
    placeholder: "facebook.com/yourname",
    color: "#1877F2",
    icon: Facebook,
    base: "https://www.facebook.com/",
  },
  {
    key: "threads",
    label: "Threads",
    placeholder: "threads.net/@yourhandle",
    color: "#171522",
    icon: AtSign,
    base: "https://www.threads.net/@",
  },
];
