import { useState } from "react";
import {
  Drawer,
  ActionIcon,
  Group,
  Title,
  Text,
  Space,
  Code,
  Paper,
  ThemeIcon,
  List,
  Stack,
  ScrollArea,
  Button,
  Image,
  Avatar,
} from "@mantine/core";
import { IconBrandGithub, IconInfoCircle, IconBug, IconGeometry } from "@tabler/icons";
import minipainting from "./mini-painting.png";
const Info = () => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Drawer opened={opened} onClose={() => setOpened(false)} padding="xl" size="xl">
        <ScrollArea sx={(theme) => ({ height: "calc(100% - 48px - 48px)" })}>
          <Stack>
            <Group>
              <Avatar src={minipainting} radius="xl" size={"lg"} style={{ opacity: 0.75 }} />
              <Title underline>npainter</Title>
            </Group>
            <Text>
              A non-photorealistic rendering (NPR → <b>np</b>ainte<b>r</b>) tool that creates
              realtime painterly renderings of user-inputted images. Utilizes WebGL through{" "}
              <Code color="blue">three.js</Code>
              {" and "}
              <Code color="blue">react-three-fiber</Code>
              {"."}
            </Text>
            <Text>
              To get started, upload an image using the right-hand panel. Then, use the input
              sliders to adjust the filtered output. Once finished, click the save button to
              download the current rendering.
            </Text>
            <Paper
              sx={(theme) => ({
                borderColor: theme.colors.red[8],
              })}
              withBorder={true}
              p={"sm"}
            >
              <Stack spacing={"xs"}>
                <Group spacing={"xs"}>
                  <ThemeIcon color={"red.8"} variant={"light"} size={"lg"}>
                    <IconBug />
                  </ThemeIcon>
                  <Title size={"xs"} color={"red.8"}>
                    Current Bugs
                  </Title>
                </Group>
                <List sx={(theme) => ({ padding: "0px 24px 0px 12px" })}>
                  <List.Item>
                    "Orient" texture shader producing suboptimal rotations compared to C++ version.
                    Try lower resolution input images for smoother results.
                  </List.Item>
                  <List.Item>
                    Large input images (~4k) may crash website on mobile devices. Try scaling down
                    the image before uploading, then save out painting with a larger output scale if
                    needed.
                  </List.Item>
                  <List.Item>
                    <s>
                      When changing "base" layer properties, the base strokes get rendered on top of
                      the "detail" strokes. Updating a "detail" layer property will re-render it
                      correctly.
                    </s>
                    <b>{`(Fixed 12/12/2022)`}</b>
                  </List.Item>
                </List>
              </Stack>
            </Paper>
          </Stack>
        </ScrollArea>
        <Group
          style={{
            position: "absolute",
            left: "24px",
            bottom: "24px",
            height: "36px",
          }}
          spacing={"sm"}
        >
          <Button
            component="a"
            href="https://github.com/bbartschi14/npainter"
            target="_blank"
            rel="noopener noreferrer"
            leftIcon={<IconBrandGithub size={16} />}
            color={"dark.3"}
          >
            Github
          </Button>
          <Button
            component="a"
            href="https://benbartschi.me/"
            target="_blank"
            rel="noopener noreferrer"
            leftIcon={<IconGeometry size={16} />}
            color={"dark.3"}
            variant={"outline"}
          >
            Made by Ben
          </Button>
        </Group>
      </Drawer>

      <Group
        position="center"
        style={{
          position: "fixed",
          left: "24px",
          top: "24px",
        }}
      >
        <ActionIcon size="lg" radius="lg" variant="filled" onClick={() => setOpened(true)}>
          <IconInfoCircle size={28} />
        </ActionIcon>
      </Group>
    </>
  );
};

export default Info;
