import { Route, Routes } from "react-router";
import ReportHeader from "./ReportHeader";

export default function HeaderRoutes() {
  return (
    <Routes>
      <Route path="/:location" element={<ReportHeader />} />
    </Routes>
  );
}
