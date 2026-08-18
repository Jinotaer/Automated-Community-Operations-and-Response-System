import logo from "@/assets/App-Icon.png";

export default function ApplicationLogo({ className = "h-15 w-auto text-gray-500", size = 48, ...props }) {
  return (
    <img
      src={logo}
      alt="Complete in Jesus Christ Mission Church"
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
}
