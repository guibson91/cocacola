import { ElementState } from "@maskito/core/lib/types";

export const patternCardMask = {
  mask: [...Array(4).fill(/\d/), " ", ...Array(4).fill(/\d/), " ", ...Array(4).fill(/\d/), " ", ...Array(4).fill(/\d/), " ", ...Array(3).fill(/\d/)],
};

export const patternDateMask = {
  mask: [...Array(2).fill(/\d/), "/", ...Array(4).fill(/\d/)],
};

export const patternCepMask = {
  mask: (elementState: ElementState) => {
    const value = elementState.value;
    return [...Array(2).fill(/\d/), ".", ...Array(3).fill(/\d/), "-", ...Array(3).fill(/\d/)];
    // return value && value.length <= 10
    //   ? [
    //     ...Array(2).fill(/\d/),
    //     '.',
    //     ...Array(3).fill(/\d/),
    //     '-',
    //     ...Array(3).fill(/\d/)
    //   ]
    //   : [];
  },
};

export const patternCpfCnpjMask = {
  mask: (elementState: ElementState) => {
    const value = elementState.value;
    return value.length <= 14
      ? [...Array(3).fill(/\d/), ".", ...Array(3).fill(/\d/), ".", ...Array(3).fill(/\d/), "-", ...Array(2).fill(/\d/)]
      : [...Array(2).fill(/\d/), ".", ...Array(3).fill(/\d/), ".", ...Array(3).fill(/\d/), "/", ...Array(4).fill(/\d/), "-", ...Array(2).fill(/\d/)];
  },
};

export const patternFullDateMask = {
  mask: (elementState: ElementState) => {
    return [...Array(2).fill(/\d/), "/", ...Array(2).fill(/\d/), "/", ...Array(4).fill(/\d/)];
  },
};

export const patternPhoneMask = {
  mask: (elementState: ElementState) => {
    const value = elementState.value;

    return value && value.length <= 10
      ? ["(", ...Array(2).fill(/\d/), ")", " ", ...Array(4).fill(/\d/), "-", ...Array(4).fill(/\d/)]
      : ["(", ...Array(2).fill(/\d/), ")", " ", ...Array(5).fill(/\d/), "-", ...Array(4).fill(/\d/)];
  },
};
