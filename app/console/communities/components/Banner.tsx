import {
  Button,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useFormControlContext,
} from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import BannerIcon from "assets/icons/gallery.svg?react";
import "cropperjs/dist/cropper.css";
import { FC, createRef, useState } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";
import Dropzone from "react-dropzone";
import { createFilePath } from "utils/files";
import "./style.css";

export type BannerProps = {
  selectedBanner: string | File | null;
  setBanner: (banner: File | null) => void;
};

function dataURLtoFile(dataUrl: string, filename: string) {
  var arr = dataUrl.split(","),
    mime = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export const BannerInput: FC<BannerProps> = ({ setBanner, selectedBanner }) => {
  const { isInvalid } = useFormControlContext();
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<null | string>(null);
  const color = isInvalid ? "#E53E3E" : "brand.gray.1";
  const cropperRef = createRef<ReactCropperElement>();
  const handleCrop = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setBanner(
        dataURLtoFile(
          cropperRef.current?.cropper.getCroppedCanvas().toDataURL(),
          "banner"
        )
      );
      setIsOpen(false);
    }
  };

  return (
    <>
      {selectedBanner && (
        <Image w="full" rounded="12px" src={createFilePath(selectedBanner)} />
      )}
      <Dropzone
        accept={{
          "image/*": [],
        }}
        multiple={false}
        onDropAccepted={([file]) => {
          var reader = new FileReader();
          reader.onloadend = function () {
            setImage(String(reader.result));
            setIsOpen(true);
          };
          reader.readAsDataURL(file);
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <>
            <input {...getInputProps()} />
            {!selectedBanner ? (
              <Button
                {...getRootProps()}
                aria-invalid={isInvalid}
                variant="unstyled"
                display="flex"
                w="full"
                color={color}
                borderColor={color}
                borderWidth={"2px"}
                borderStyle="solid"
                _focus={{
                  borderColor: isInvalid ? "red.500" : "primary.500",
                }}
                _groupHover={{
                  borderColor: "primary.500",
                  _invalid: {
                    borderColor: color,
                  },
                }}
                px={{
                  base: "3",
                  md: "4",
                }}
                py={{
                  base: "2",
                  md: "6",
                }}
                h="auto"
                fontWeight="normal"
                borderRadius="12px"
                bg="white"
              >
                <HStack flexGrow={1} color="gray.600">
                  <BannerIcon width="24px" />
                  <Text
                    color="gray.600"
                    fontSize={{
                      base: "16px",
                      md: "18px",
                    }}
                  >
                    Choose a picture
                  </Text>
                </HStack>
                <Text color="gray.600">
                  <PlusIcon width="24px" />
                </Text>
              </Button>
            ) : (
              <HStack justifyContent="end" pt="2">
                <Button
                  {...getRootProps()}
                  variant="link"
                  fontWeight="normal"
                  color="brand.black.3"
                  fontSize={{ base: "10px", md: "14px" }}
                >
                  Update banner
                </Button>
                <Button
                  onClick={setBanner.bind(null, null)}
                  variant="link"
                  fontWeight="normal"
                  colorScheme="black"
                  fontSize={{ base: "10px", md: "14px" }}
                  color="red"
                >
                  Remove banner
                </Button>
              </HStack>
            )}
          </>
        )}
      </Dropzone>
      <Modal
        isOpen={isOpen}
        onClose={setIsOpen.bind(null, false)}
        size={{ md: "lg", base: "md" }}
      >
        <ModalOverlay />
        <ModalContent
          rounded="2xl"
          p={{ base: 0, md: 3 }}
          boxShadow={{ base: "none" }}
          w={{ base: "calc(100% - 100px)", md: "full" }}
        >
          <ModalHeader
            fontSize="18px"
            color="brand.black.4"
            fontWeight="normal"
            display={{ base: "none", md: "block" }}
          >
            Upload Banner
          </ModalHeader>
          <ModalCloseButton
            color="brand.black.4"
            top={4}
            right={5}
            display={{ base: "none", md: "block" }}
          />
          <ModalBody
            as={VStack}
            gap={6}
            pb={{ base: 3, md: 6 }}
            p={{ base: 3, md: 3 }}
            w={{ base: "100%", md: "full" }}
            display="flex"
            justify="space-between"
          >
            <VStack gap="4">
              <Cropper
                ref={cropperRef}
                style={{ height: 400, width: "100%" }}
                initialAspectRatio={1}
                src={image!}
                viewMode={1}
                background={false}
                responsive={true}
                autoCropArea={1}
                aspectRatio={2.34}
                checkOrientation={false}
                guides={false}
              />
              <Text fontWeight="bold" fontSize={{ base: "16px", md: "20px" }}>
                Pinch to zoom, Move to crop
              </Text>
            </VStack>
            <Button
              onClick={handleCrop}
              color="primary.500"
              colorScheme="primary-glass"
              variant="solid"
              w="full"
              size="lg"
            >
              Upload banner
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
