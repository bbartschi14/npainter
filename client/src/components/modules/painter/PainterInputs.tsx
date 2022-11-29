import { Image, Paper, Stack } from "@mantine/core";
import { Dropzone, MIME_TYPES, FileWithPath } from "@mantine/dropzone";
import { Text, Group, useMantineTheme } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons";
import { Dimensions } from "../image/types";

type PainterInputsProps = {
  imageURL: string;
  imageData: Dimensions;
  setImageFile: (files: FileWithPath[]) => void;
};

const PainterInputs = (props: PainterInputsProps) => {
  const theme = useMantineTheme();

  return (
    <Paper
      style={{ position: "fixed", right: "24px", top: "24px", width: "300px" }}
      shadow="sm"
      p="md"
      withBorder={true}
    >
      <Stack>
        <Dropzone
          accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
          onDrop={props.setImageFile}
          multiple={false}
        >
          <Group position="center" spacing="xl" style={{ pointerEvents: "none" }} noWrap={true}>
            <Dropzone.Accept>
              <IconUpload
                size={50}
                stroke={1.5}
                color={theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size={50}
                stroke={1.5}
                color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size={50} stroke={1.5} />
            </Dropzone.Idle>

            <div>
              <Text size="md" inline>
                Upload Image
              </Text>
            </div>
          </Group>
        </Dropzone>
        {props.imageURL !== null ? <Image src={props.imageURL} /> : <></>}
        {props.imageData !== null ? (
          <Text align="center">{`${props.imageData.width} x ${props.imageData.height}`}</Text>
        ) : (
          <></>
        )}
      </Stack>
    </Paper>
  );
};

export default PainterInputs;
