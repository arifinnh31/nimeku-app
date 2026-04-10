"use client";

import { Button } from "@/components/ui/button";
import { Monitor } from "lucide-react";
import type { StreamServer } from "@prisma/client";

interface ServerSelectorProps {
  servers: StreamServer[];
  activeId?: string;
  onSelect?: (server: StreamServer) => void;
}

export function ServerSelector({ servers, activeId, onSelect }: ServerSelectorProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground flex items-center gap-1.5">
        <Monitor className="w-4 h-4" />
        Server:
      </span>
      {servers.map((server) => (
        <Button
          key={server.id}
          variant={server.id === activeId ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect?.(server)}
          className="text-xs"
        >
          {server.name}
        </Button>
      ))}
    </div>
  );
}
