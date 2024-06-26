import { Route, Routes } from "react-router";
import ReportHeader from "./ReportHeader";
import HomeHeader from "./HomeHeader";

export default function HeaderRoutes() {
  return (
    <Routes>
      <Route path="/:location" element={<ReportHeader />} />
      <Route path="/" element={<HomeHeader />} />
    </Routes>
  );
}
