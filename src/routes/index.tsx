import { createFileRoute } from "@tanstack/react-router";
import MainnetPage from "../components/pages/MainnetPage";

export const Route = createFileRoute("/")({
	component: MainnetPage,
});
