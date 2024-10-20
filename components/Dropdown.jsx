import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dropdown = ({ trigger }) => {
  return (
    <Select>
      <SelectTrigger className="p-6 rounded-lg w-full border-2 border-gray-300 ">
        <SelectValue placeholder={trigger} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default Dropdown;
