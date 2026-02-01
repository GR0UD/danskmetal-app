import { BiSolidBowlRice } from "react-icons/bi";
import { GiKetchup } from "react-icons/gi";
import { TbBread, TbBreadFilled, TbX } from "react-icons/tb";
import type { Sandwich, BreadOption, DressingOption } from "@/types";

// Icons
export const BreadIcon = () => <TbBread size={32} />;
export const DarkBreadIcon = () => <TbBreadFilled size={32} />;
export const DressingIcon = () => <GiKetchup size={32} />;
export const NoIcon = () => <TbX size={32} />;
export const PastaIcon = ({ className }: { className?: string }) => (
  <BiSolidBowlRice className={className} />
);

export const sandwiches: Sandwich[] = [
  {
    id: 1,
    name: "Frikadelle",
    description: "Frikadelle, rødkål og syltet agurker",
    image: "/images/frikadelle.webp",
    hasImage: true,
    url: "https://seestbageri.dk/vare/sandwich-med-frikadelle-roedkaal-og-syltede-agurker/",
  },
  {
    id: 2,
    name: "Kylling & Bacon",
    description: "Kylling og bacon",
    image: "/images/kylling-bacon.webp",
    hasImage: true,
    url: "https://seestbageri.dk/vare/sandwich-m-kylling-og-bacon/",
  },
  {
    id: 3,
    name: "Kylling & Salsa",
    description: "Kylling, salsa og nachos",
    image: "/images/kylling-salsa.webp",
    hasImage: true,
    url: "https://seestbageri.dk/vare/sandwich-m-kylling-og-nachos/",
  },
  {
    id: 4,
    name: "Tun",
    description: "Tun, æg og rødløg",
    image: "/images/tun.webp",
    hasImage: true,
    url: "https://seestbageri.dk/vare/sandwich-m-tun-og-aeg/",
  },
  {
    id: 5,
    name: "Kalkun & Ost",
    description: "Kalkun og ost",
    image: "/images/kalkun.webp",
    hasImage: true,
    url: "https://seestbageri.dk/vare/sandwich-med-kalkun-og-ost/",
  },
  {
    id: 6,
    name: "Spegepølse",
    description: "Spegepølse, remoulade og ristet løg",
    image: "",
    hasImage: false,
    url: "https://seestbageri.dk/vare/sandwich-m-spegepoelse-remoulade-og-ristet-loeg/",
  },
  {
    id: 7,
    name: "Falafel",
    description: "Falafel og revet gulerødder",
    image: "",
    hasImage: false,
    url: "https://seestbageri.dk/vare/sandwich-m-humus-falafel-og-revet-guleroedder/",
  },
  {
    id: 8,
    name: "Pastasalat",
    description: "Pastasalat m. krydret kylling",
    image: "",
    hasImage: false,
    noBreadDressing: true,
    url: "https://seestbageri.dk/vare/pastasalat-m-krydret-kylling/",
  },
];

export const breads: BreadOption[] = [
  { id: "lyst", name: "Lyst brød", icon: <BreadIcon /> },
  { id: "groft", name: "Groft brød", icon: <DarkBreadIcon /> },
  { id: "rugbrød", name: "Rugbrød", icon: <DarkBreadIcon /> },
  { id: "glutenfri", name: "Glutenfri", icon: <BreadIcon /> },
];

export const dressings: DressingOption[] = [
  { id: "ingen", name: "Ingen", icon: <NoIcon /> },
  { id: "ketchup", name: "Ketchup", icon: <DressingIcon /> },
  { id: "mayo", name: "Mayonnaise", icon: <DressingIcon /> },
  { id: "remoulade", name: "Remoulade", icon: <DressingIcon /> },
  { id: "sennep", name: "Sennep", icon: <DressingIcon /> },
  { id: "chili", name: "Chili Mayo", icon: <DressingIcon /> },
];
