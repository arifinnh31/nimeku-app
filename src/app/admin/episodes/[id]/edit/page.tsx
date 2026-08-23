import { getEpisodeById } from "@/actions/episode";
import { notFound } from "next/navigation";
import { EditEpisodeClient } from "./edit-episode-client";

export default async function EditEpisodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const episode = await getEpisodeById(id);

  if (!episode) {
    return notFound();
  }

  return <EditEpisodeClient episode={episode} />;
}
