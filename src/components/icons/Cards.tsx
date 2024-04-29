type CardsProps = {
  color: string;
  size: number;
};

export default function Cards({ color = "#000000", size = 50 }: CardsProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      version="1.1"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    >
      <rect height="11.5" width="8.25" y="2.75" x="1.75" />
      <path d="m10 3.75 4.25 2-4.25 7.5" />
    </svg>
  );
}
