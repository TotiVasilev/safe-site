import ServicesExperience from "@/components/ui/services/ServicesExperience";
import { getEnglishJson } from "@/data/english";
import services from "@/content/services.json";
export default function Page() { return <ServicesExperience englishContent={getEnglishJson("services.json", services)} />; }
