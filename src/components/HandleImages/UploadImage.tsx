import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { Button, Header, Image } from "semantic-ui-react";

type UploadImageProps = {
  setFileToUpload: Dispatch<SetStateAction<File | undefined>>;
};

const UploadImage: FC<UploadImageProps> = ({ setFileToUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState(
    "https://react.semantic-ui.com/images/wireframe/image.png"
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileToUpload = e.target.files?.[0];
    if (!fileToUpload) return;
    const fileSampleUrl = URL.createObjectURL(fileToUpload);
    setImage(fileSampleUrl);
    setFileToUpload(fileToUpload);
  };

  return (
    <>
      <Header as="h4">Upload Image</Header>
      <Image size="large" src={image} />
      <input
        ref={inputRef}
        type="file"
        className="hide"
        onChange={handleInputChange}
      />
      <Button className="mt-1" onClick={() => inputRef.current?.click()}>
        Upload Image
      </Button>
    </>
  );
};

export default UploadImage;
