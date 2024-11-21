"use client";
import { createDecipheriv } from "crypto";
import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [decryptValue, setDecryptValue] = useState("");

  const algorithm = "aes-256-gcm";
  const ivLength = 12;
  const key: any = Buffer.from(
    "91b36c1b6cce8a1c35f4d1e9d3e1b1ff9c23b7d3b4e4e5d6f7e8a1b2c3d4e5f6",
    "hex"
  );

  const decrypt = (base64Data: string): string => {
    const combinedBuffer = Buffer.from(base64Data, "base64");

    const iv: any = combinedBuffer.subarray(0, ivLength);
    const authTag: any = combinedBuffer.subarray(ivLength, ivLength + 16);
    const encryptedData = combinedBuffer
      .subarray(ivLength + 16)
      .toString("hex");

    const decipher = createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    try {
      const decryptInputValue = decrypt(inputValue);
      const parsedValue = JSON.parse(decryptInputValue);
      setDecryptValue(parsedValue);
    } catch (error) {
      console.error("Decryption or parsing error:", error);
      setDecryptValue("Error decrypting or parsing the input.");
    }
  };
  const handleClear = () => {
    setDecryptValue("");
    setInputValue("");
  };

  return (
    <>
      <div className="container">
        <div className="main-content">
          <h1>Enter Text To Decrypt</h1>
          <input
            type={"text"}
            id={"input-text"}
            name={"input-text"}
            value={inputValue}
            placeholder={"Enter Text To Decrypt"}
            onChange={handleChange}
          />
          <div className="btns">
            <button onClick={handleSubmit} className="btn btn-green">
              Decrypt
            </button>
            <button onClick={handleClear} className="btn btn-grey">
              Clear
            </button>
          </div>
          <h4>Decrypted Data</h4>
          <div className="content">
          {decryptValue ?  <pre>{JSON.stringify(decryptValue, null, 2)}</pre> : <pre>Response will be shown here...!!</pre>}
          </div>
        </div>
      </div>
    </>
  );
}
