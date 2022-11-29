import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { Text, Image, SimpleGrid, Group, useMantineTheme } from "@mantine/core";
import { Dropzone, MIME_TYPES, FileWithPath } from "@mantine/dropzone";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons";

/**
 * Main painter app
 */
const Painter = () => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const theme = useMantineTheme();
  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    console.log(imageUrl);
    return (
      <Image
        key={index}
        src={imageUrl}
        // imageProps={{
        //   onLoad: () => {
        //     URL.revokeObjectURL(imageUrl);
        //     console.log("Released");
        //   },
        // }}
      />
    );
  });

  return (
    <>
      <div>
        <Dropzone accept={[MIME_TYPES.png, MIME_TYPES.jpeg]} onDrop={setFiles} multiple={false}>
          <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: "none" }}>
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
              <Text size="xl" inline>
                Click to select file or drag image here
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                Accepts JPEG or PNG
              </Text>
            </div>
          </Group>
        </Dropzone>

        <SimpleGrid
          cols={4}
          breakpoints={[{ maxWidth: "sm", cols: 1 }]}
          mt={previews.length > 0 ? "xl" : 0}
        >
          {previews}
        </SimpleGrid>
      </div>
      <Canvas>
        <mesh>
          <torusKnotGeometry />
          <meshNormalMaterial />
        </mesh>
      </Canvas>
    </>
  );
};

export default Painter;
