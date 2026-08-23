import { getAnimeById } from "@/actions/anime";
import { notFound } from "next/navigation";
import { EditAnimeClient } from "./edit-anime-client";

export default async function EditAnimePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const anime = await getAnimeById(id);

  if (!anime) {
    return notFound();
  }

  return <EditAnimeClient anime={anime} />;
}
