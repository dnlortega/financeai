"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface TimeSelectClientProps {
  availableMonths: {
    month: string;
    year: string;
    label: string;
  }[];
}

const TimeSelectClient = ({ availableMonths }: TimeSelectClientProps) => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const defaultValue = month && year ? `${month}/${year}` : "";

  const handleValueChange = (value: string) => {
    const [selectedMonth, selectedYear] = value.split("/");
    push(`/?month=${selectedMonth}&year=${selectedYear}`);
  };

  return (
    <Select
      onValueChange={handleValueChange}
      defaultValue={defaultValue}
    >
      <SelectTrigger className="w-[180px] rounded-full">
        <SelectValue placeholder="Selecione o período" />
      </SelectTrigger>
      <SelectContent>
        {availableMonths.map((option) => (
          <SelectItem key={`${option.month}/${option.year}`} value={`${option.month}/${option.year}`}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeSelectClient;
