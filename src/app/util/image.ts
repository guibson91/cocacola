export const getBackgroundImage = async (imageUrl?: string, placeholderType: "default" | "profile-user" | "profile-default" = "default"): Promise<string> => {
  const placeholderMap = {
    default: "assets/images/placeholders/placeholder-horizontal.png",
    "profile-user": "assets/images/placeholders/placeholder-user.png",
    "profile-default": "assets/images/placeholders/placeholder.png",
  };
  const placeholder = placeholderMap[placeholderType];
  if (!imageUrl) {
    return placeholder;
  }
  return new Promise((resolve) => {
    const testImage = new Image();
    testImage.src = imageUrl;
    testImage.onload = () => resolve(imageUrl);
    testImage.onerror = () => {
      resolve(placeholder);
    };
  });
};

export const b64toBlob = (b64Data: any, customSliceSize?: number) => {
  const base64: any = b64Data;
  const block = base64.split(";");
  const contentType = block && block[0] ? block[0].split(":")[1] : "image/jpeg";
  const realData = block && block[1] ? block[1].split(",")[1] : b64Data;
  const sliceSize = customSliceSize || 900;
  const byteCharacters = atob(realData);
  const byteArrays: any[] = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};
