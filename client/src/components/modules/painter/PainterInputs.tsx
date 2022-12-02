import {
  Button,
  Image,
  Input,
  Paper,
  ScrollArea,
  SegmentedControl,
  Slider,
  Stack,
  Tabs,
} from "@mantine/core";
import { Dropzone, MIME_TYPES, FileWithPath } from "@mantine/dropzone";
import { Text, Group, useMantineTheme, NumberInput, Checkbox } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons";
import { Dimensions } from "../image/types";
import { SliderInput } from "../common/SliderInput";
import { publish } from "../../events";
import React, { useState } from "react";

type PainterInputsProps = {
  imageURL: string;
  imageData: Dimensions;
  setImageFile: (files: FileWithPath[]) => void;

  numStrokes: number;
  setNumStrokes: React.Dispatch<React.SetStateAction<number>>;
  strokeScale: number;
  setStrokeScale: React.Dispatch<React.SetStateAction<number>>;
  strokeScaleNoise: number;
  setStrokeScaleNoise: React.Dispatch<React.SetStateAction<number>>;
  strokeColorNoise: number;
  setStrokeColorNoise: React.Dispatch<React.SetStateAction<number>>;
  randomSeed: number;
  setRandomSeed: React.Dispatch<React.SetStateAction<number>>;

  displayBaseColor: boolean;
  setDisplayBaseColor: React.Dispatch<React.SetStateAction<boolean>>;
  displayDetailTexture: boolean;
  setDisplayDetailTexture: React.Dispatch<React.SetStateAction<boolean>>;
  displayOrientTexture: boolean;
  setDisplayOrientTexture: React.Dispatch<React.SetStateAction<boolean>>;

  numStrokesSmall: number;
  setNumStrokesSmall: React.Dispatch<React.SetStateAction<number>>;
  strokeScaleSmall: number;
  setStrokeScaleSmall: React.Dispatch<React.SetStateAction<number>>;
  strokeScaleNoiseSmall: number;
  setStrokeScaleNoiseSmall: React.Dispatch<React.SetStateAction<number>>;
  strokeColorNoiseSmall: number;
  setStrokeColorNoiseSmall: React.Dispatch<React.SetStateAction<number>>;
  randomSeedSmall: number;
  setRandomSeedSmall: React.Dispatch<React.SetStateAction<number>>;

  unsharpBlurIters: number;
  setUnsharpBlurIters: React.Dispatch<React.SetStateAction<number>>;
  unsharpBlurRadius: number;
  setUnsharpBlurRadius: React.Dispatch<React.SetStateAction<number>>;

  highFreqBlurIters: number;
  setHighFreqBlurIters: React.Dispatch<React.SetStateAction<number>>;
  highFreqBlurRadius: number;
  setHighFreqBlurRadius: React.Dispatch<React.SetStateAction<number>>;

  lumiBlurIters: number;
  setLumiBlurIters: React.Dispatch<React.SetStateAction<number>>;
  lumiBlurRadius: number;
  setLumiBlurRadius: React.Dispatch<React.SetStateAction<number>>;

  tensorBlurIters: number;
  setTensorBlurIters: React.Dispatch<React.SetStateAction<number>>;
  tensorBlurRadius: number;
  setTensorBlurRadius: React.Dispatch<React.SetStateAction<number>>;
};

type PainterInputsTabs = "base" | "detail" | "orient";
const PainterInputs = (props: PainterInputsProps) => {
  const theme = useMantineTheme();
  const [tab, setTab] = useState<PainterInputsTabs | string>("base");

  const onSaveButtonClicked = (e) => {
    publish("save", { resolution: props.imageData });
  };

  return (
    <Paper
      maxHeight={"calc(100% - 48px)"}
      style={{
        position: "fixed",
        right: "24px",
        top: "24px",
        width: "300px",
      }}
      shadow="sm"
      p="0"
      withBorder={true}
      component={ScrollArea.Autosize}
      offsetScrollbars={true}
    >
      <Stack p={"sm"}>
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
        <Button
          disabled={props.imageData === null || props.imageURL === null}
          onClick={onSaveButtonClicked}
        >
          {"Save"}
        </Button>
        {props.imageData === null || props.imageURL === null ? (
          <></>
        ) : (
          <>
            <SegmentedControl
              value={tab}
              onChange={setTab}
              data={[
                { label: "Base", value: "base" },
                { label: "Detail", value: "detail" },
                { label: "Orient", value: "orient" },
              ]}
            />

            <Tabs value={tab}>
              <Tabs.Panel value="base">
                <Stack>
                  <SliderInput
                    value={props.randomSeed}
                    setValue={props.setRandomSeed}
                    label={"Random Seed"}
                    min={0}
                    max={100}
                    step={1}
                    clamp={false}
                  />
                  <SliderInput
                    value={props.numStrokes}
                    setValue={props.setNumStrokes}
                    label={"Brush Stroke Count"}
                    min={0}
                    max={40000}
                    step={1}
                    clamp={false}
                  />
                  <SliderInput
                    value={props.strokeScale}
                    setValue={props.setStrokeScale}
                    label={"Stroke Scale"}
                    min={0}
                    max={50}
                    step={0.1}
                    precision={1}
                    clamp={false}
                  />
                  <SliderInput
                    value={props.strokeScaleNoise}
                    setValue={props.setStrokeScaleNoise}
                    label={"Stroke Scale Noise"}
                    min={0}
                    max={20}
                    step={0.01}
                    precision={2}
                    clamp={false}
                  />
                  <SliderInput
                    value={props.strokeColorNoise}
                    setValue={props.setStrokeColorNoise}
                    label={"Stroke Color Noise"}
                    min={0}
                    max={1}
                    step={0.01}
                    precision={2}
                    clamp={false}
                  />
                  <Checkbox
                    label={"Display Image Texture in Viewport"}
                    checked={props.displayBaseColor}
                    onChange={(event) => props.setDisplayBaseColor(event.currentTarget.checked)}
                  />
                </Stack>
              </Tabs.Panel>
              <Tabs.Panel value="detail">
                <Stack>
                  <SliderInput
                    value={props.randomSeedSmall}
                    setValue={props.setRandomSeedSmall}
                    label={"Detail Random Seed"}
                    min={0}
                    max={100}
                    step={1}
                    clamp={false}
                  />
                  <SliderInput
                    value={props.numStrokesSmall}
                    setValue={props.setNumStrokesSmall}
                    label={"Detail Brush Stroke Count"}
                    min={0}
                    max={40000}
                    step={1}
                    clamp={false}
                  />
                  <SliderInput
                    value={props.strokeScaleSmall}
                    setValue={props.setStrokeScaleSmall}
                    label={"Detail Stroke Scale"}
                    min={0}
                    max={50}
                    step={0.1}
                    precision={1}
                    clamp={false}
                  />
                  <SliderInput
                    value={props.strokeScaleNoiseSmall}
                    setValue={props.setStrokeScaleNoiseSmall}
                    label={"Detail Stroke Scale Noise"}
                    min={0}
                    max={20}
                    step={0.01}
                    precision={2}
                    clamp={false}
                  />
                  <SliderInput
                    value={props.strokeColorNoiseSmall}
                    setValue={props.setStrokeColorNoiseSmall}
                    label={"Detail Stroke Color Noise"}
                    min={0}
                    max={1}
                    step={0.01}
                    precision={2}
                    clamp={false}
                  />
                  <SliderInput
                    value={props.unsharpBlurIters}
                    setValue={props.setUnsharpBlurIters}
                    label={"Unsharp Blur Iterations"}
                    min={0}
                    max={20}
                    step={1}
                    clamp={true}
                  />
                  <SliderInput
                    value={props.unsharpBlurRadius}
                    setValue={props.setUnsharpBlurRadius}
                    label={"Unsharp Blur Radius"}
                    min={0.1}
                    max={20}
                    step={0.1}
                    clamp={false}
                  />
                  <SliderInput
                    value={props.highFreqBlurIters}
                    setValue={props.setHighFreqBlurIters}
                    label={"High Freq Blur Iterations"}
                    min={0}
                    max={20}
                    step={1}
                    clamp={true}
                  />
                  <SliderInput
                    value={props.highFreqBlurRadius}
                    setValue={props.setHighFreqBlurRadius}
                    label={"High Freq Blur Radius"}
                    min={0.1}
                    max={20}
                    step={0.1}
                    clamp={false}
                  />
                  <Checkbox
                    label={"Display Detail Texture in Viewport"}
                    checked={props.displayDetailTexture}
                    onChange={(event) => props.setDisplayDetailTexture(event.currentTarget.checked)}
                  />
                </Stack>
              </Tabs.Panel>
              <Tabs.Panel value="orient">
                <Stack>
                  <SliderInput
                    value={props.lumiBlurIters}
                    setValue={props.setLumiBlurIters}
                    label={"Lumi Blur Iterations"}
                    min={0}
                    max={20}
                    step={1}
                    clamp={true}
                  />
                  <SliderInput
                    value={props.lumiBlurRadius}
                    setValue={props.setLumiBlurRadius}
                    label={"Lumi Blur Radius"}
                    min={0.1}
                    max={20}
                    step={0.1}
                    clamp={false}
                  />
                  <SliderInput
                    value={props.tensorBlurIters}
                    setValue={props.setTensorBlurIters}
                    label={"Tensor Blur Iterations"}
                    min={0}
                    max={20}
                    step={1}
                    clamp={true}
                  />
                  <SliderInput
                    value={props.tensorBlurRadius}
                    setValue={props.setTensorBlurRadius}
                    label={"Tensor Blur Radius"}
                    min={0.1}
                    max={20}
                    step={0.1}
                    clamp={false}
                  />
                  <Checkbox
                    label={"Display Orient Texture in Viewport"}
                    checked={props.displayOrientTexture}
                    onChange={(event) => props.setDisplayOrientTexture(event.currentTarget.checked)}
                  />
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default PainterInputs;

/* <Input.Wrapper labelElement="div" label={"Stroke Scale"}>
    <Slider value={props.strokeScale} onChange={props.setStrokeScale} />
  </Input.Wrapper> */
