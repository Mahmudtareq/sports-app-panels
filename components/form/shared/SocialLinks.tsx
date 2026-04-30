import Link from "next/link";
import { Icons } from "../custom/icons";

// Social links configuration
const defaultSocialLinks = [
  {
    name: "Facebook",
    href: "#",
    icon: Icons.facebook,
  },
  {
    name: "Instagram",
    href: "#",
    icon: Icons.instagram,
  },
  {
    name: "Pinst",
    href: "#",
    icon: Icons.pinst,
  },
  {
    name: "YouTube",
    href: "#",
    icon: Icons.youTube,
  },
  {
    name: "whatsapp",
    href: "#",
    icon: Icons.whatsApp,
  },
];

const SocialLinks = ({
  links = defaultSocialLinks,
  iconSize = "w-[40px] h-[40px]",
  bgColor = "bg-[#111]",
  iconColor = "text-white",
  gap = "gap-x-[12px]",
  className = "",
}) => {
  return (
    <div className={`flex items-center ${gap} ${className}`}>
      {links.map((social) => {
        const Icon = social.icon;
        return (
          <Link
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${iconSize} ${bgColor} rounded-full flex items-center justify-center`}
            aria-label={social.name}
          >
            <Icon className={`${iconColor}`} />
          </Link>
        );
      })}
    </div>
  );
};

export default SocialLinks;

// Alternative export for custom usage
export { defaultSocialLinks };
