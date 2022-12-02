import { Kbd, Stack, Group, Text, ThemeIcon, Paper, HoverCard, ActionIcon } from "@mantine/core";
import React from "react";
import { IconMouse, IconPointer } from "@tabler/icons";

const ControlsDisplay = () => {
  return (
    <HoverCard position="top-start" shadow={"md"}>
      <HoverCard.Target>
        <ActionIcon
          size="lg"
          radius="lg"
          variant="filled"
          style={{ position: "fixed", left: "24px", bottom: "24px" }}
          color={"gray.5"}
        >
          <IconMouse size={20} />
        </ActionIcon>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Stack>
          <Group spacing={"xs"}>
            <Kbd>Move</Kbd>:<Kbd>Right Click</Kbd>+<Kbd>Drag</Kbd>
          </Group>
          <Group spacing={"xs"}>
            <Kbd>Zoom</Kbd>:<Kbd>Mouse Wheel</Kbd>
          </Group>
        </Stack>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default ControlsDisplay;
