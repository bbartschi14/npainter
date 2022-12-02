import { useState } from "react";
import { createStyles, NumberInput, Slider } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
  },

  input: {
    height: "auto",
    paddingTop: 0, //22,
    paddingBottom: 6,
  },

  label: {
    position: "absolute",
    pointerEvents: "none",
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    zIndex: 1,
  },

  slider: {
    position: "absolute",
    width: "100%",
    bottom: -1,
  },

  thumb: {
    width: 16,
    height: 16,
  },

  track: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4],
  },
}));

type SliderInputProps = {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  label: string;
  placeholder?: string;
  precision?: number;
  step: number;
  min: number;
  max: number;
  clamp?: boolean;
};

export function SliderInput(props: SliderInputProps) {
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <NumberInput
        value={props.value}
        onChange={props.setValue}
        label={props.label}
        placeholder={props.placeholder}
        precision={props.precision}
        step={props.step}
        min={props.min}
        max={props.max}
        hideControls
        noClampOnBlur={!props.clamp}
        classNames={{ input: classes.input }}
      />
      <Slider
        step={props.step}
        min={props.min}
        max={props.max}
        label={null}
        value={props.value}
        onChange={props.setValue}
        size={3}
        radius={0}
        className={classes.slider}
        classNames={{ thumb: classes.thumb, track: classes.track }}
      />
    </div>
  );
}
