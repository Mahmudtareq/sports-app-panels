import Link from "next/link";

const IconsWithLabel = ({
  href = "#",
  icon: Icon,
  label,
  layout = "horizontal",
  iconSize = "w-[20px] h-[20px]",
  bgColor = "bg-gray-800",
  iconColor = "text-white",
}: any) => {
  const content = (
    <div
      className={`flex ${
        layout === "vertical"
          ? "flex-col items-center"
          : "flex-row items-center gap-3"
      }`}
    >
      <div
        className={`${iconSize} ${bgColor} rounded-full flex items-center justify-center`}
      >
        <Icon className={`${iconColor} w-4 h-4`} />
      </div>
      {label && (
        <span className="text-white p-text-14 font-medium">{label}</span>
      )}
    </div>
  );

  return href ? (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label || "icon-link"}
    >
      {content}
    </Link>
  ) : (
    content
  );
};

export default IconsWithLabel;
