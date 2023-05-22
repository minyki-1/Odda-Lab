export async function cropImage(file: File, size: number): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const { width, height } = img;

        // 이미지의 중앙 부분을 계산합니다.
        let x, y, cropSize;
        if (width > height) {
          cropSize = height;
          x = (width - cropSize) / 2;
          y = 0;
        } else {
          cropSize = width;
          x = 0;
          y = (height - cropSize) / 2;
        }

        // 캔버스에 이미지를 그리고 1:1 크기로 리사이즈합니다.
        canvas.width = cropSize;
        canvas.height = cropSize;
        ctx?.drawImage(img, x, y, cropSize, cropSize, 0, 0, cropSize, cropSize);

        const canvas2 = document.createElement("canvas");
        canvas2.width = size;
        canvas2.height = size;
        const ctx2 = canvas2.getContext("2d");
        ctx2?.drawImage(canvas, 0, 0, cropSize, cropSize, 0, 0, size, size);

        // 리사이즈된 이미지를 Blob으로 변환합니다.
        const imageType = file.type.split("/")[1];
        canvas2.toBlob((blob) => {
          if (blob) resolve(blob);
        }, `image/${imageType}`, 0.8);
      };
    };
  });
}

export async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = async () => {
        const canvas = document.createElement("canvas");

        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const imageType = file.type.split("/")[1];
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, `image/${imageType}`, 0.8);
      };
    };
  });
}

export function checkImageURL(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
  });
}