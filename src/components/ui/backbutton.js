import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate(-1)}>
      <ChevronLeftIcon className="h-6 w-6" />
    </Button>
  );
};

export default BackButton;