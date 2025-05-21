import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const HeaderText = () => {
  const tasks = useQuery(api.tasks.get);
  return (
    <div>
      Hola, soy <span className="text-[#915EFF]">Alonso</span>
    </div>
  );
};

export default HeaderText;
