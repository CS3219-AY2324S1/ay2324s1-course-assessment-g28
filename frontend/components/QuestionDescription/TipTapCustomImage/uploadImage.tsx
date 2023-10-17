import { Plugin } from "prosemirror-state";
import Resizer from "react-image-file-resizer";

/**
 * function for image drag n drop(for tiptap)
 * @see https://gist.github.com/slava-vishnyakov/16076dff1a77ddaca93c4bccd4ec4521#gistcomment-3744392
 */

const resizeFile = (file: File) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64",
    );
  });

export const uploadImagePlugin = new Plugin({
  props: {
    handleDOMEvents: {
      paste(view, event) {
        const items = Array.from(event.clipboardData?.items || []);
        const { schema } = view.state;
  
        items.forEach(async (item) => {
          const image = item.getAsFile();
  
          if (item.type.indexOf("image") === 0) {
            event.preventDefault();
  
            // process image and save base 64
            const adjustedImage = await resizeFile(image!);
            if (image) {
              const node = schema.nodes.image.create({
                src: adjustedImage,
              });
              const transaction = view.state.tr.replaceSelectionWith(node);
             
              view.dispatch(transaction);
            }
          } else {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
              const node = schema.nodes.image.create({
                src: readerEvent.target?.result,
              });
              const transaction = view.state.tr.replaceSelectionWith(node);
              view.dispatch(transaction);
            };
            if (!image) return;
            reader.readAsDataURL(image);
          }
        });
  
        return false;
      },
      drop(view, event) {
        const hasFiles = event.dataTransfer?.files?.length;

        if (!hasFiles) {
          return false;
        }

        const images = Array.from(event!.dataTransfer!.files).filter((file) =>
          /image/i.test(file.type),
        );

        if (images.length === 0) {
          return false;
        }

        event.preventDefault();

        const { schema } = view.state;
        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });

         images.forEach(async (image) => {
          // save base64 and data url
          const adjustedImage = await resizeFile(image!);
          if (image) {
            const node = schema.nodes.image.create({
              src: adjustedImage
            });
            const transaction = view.state.tr.insert(coordinates!.pos, node);
            view.dispatch(transaction);
          }
        });
        
        return false;
      },
    },
  },
});
