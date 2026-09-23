import DepartmentsPage from "@/components/questions/departments/DepartmentsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Departments - Question System",
};

export default function Page() {
  return <DepartmentsPage />;
}
