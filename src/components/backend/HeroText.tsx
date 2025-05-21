import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Loader2Icon } from "lucide-react";

const HeroText = () => {
  const details = useQuery(api.header.getHeader);
  if (!details || details.length === 0) return <Loader2Icon />;
  return (
    <div>
      Hola, soy <span className="text-[#915EFF]">{details[0].name}</span>
    </div>
  );
};

export default HeroText;
