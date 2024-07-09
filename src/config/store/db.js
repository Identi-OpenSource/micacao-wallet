import { MMKV } from "react-native-mmkv";

export const storage = new MMKV({
  id: "mmkv.micacao",
  encryptionKey:
    "6dcd4ce23d88e2ee95838f7b014b6284f0f9e8f3b0c5da79a7064c9a7a2a80ae",
});
