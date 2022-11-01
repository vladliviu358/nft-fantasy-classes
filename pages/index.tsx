import React from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { abi } from "../contract-abi";
import { BigNumber, ethers } from "ethers";
import blacksmith from "../public/blacksmith.jpg";
import lumberjack from "../public/lumberjack.jpg";
import herbalist from "../public/herbalist.jpg";
import lblacksmith from "../public/lblacksmith.jpg";
import llumberjack from "../public/llumberjack.jpg";
import lherbalist from "../public/lherbalist.jpg";

const contractConfig = {
  address: "0xfC3Bc10D0254136CC5EA6283e6E54c0aE3C5612A",
  abi,
};

const Home: NextPage = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [totalMinted, setTotalMinted] = React.useState(0);
  const [tokenId, setTokenId] = React.useState(0);
  const [ipfs, setIpfs] = React.useState("");
  const [mintedClasses, setMintedClasses] = React.useState([]);
  const { address, isConnected } = useAccount();
  const trimmedAddress = address?.slice(2);

  const { config: contractWriteConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "safeMint",
    args: [`0x${trimmedAddress}`, ipfs],
    overrides: {
      value: ethers.utils.parseEther("0.001"),
    },
  });

  const { config: contractWriteConfigEvolve } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "evolveClass",
    args: [BigNumber.from(tokenId), ipfs],
    overrides: {
      value: ethers.utils.parseEther("0.0005"),
    },
  });

  function handleMint(classType: string) {
    switch (classType) {
      case "blacksmith":
        setIpfs("QmXbEkzQgPvqk5muWyDMMfqtbQZrrNrRkpzJRdQvQ2SvAp");
        break;
      case "lumberjack":
        setIpfs("QmajUCWG1W77ZCRDofrzJXQKW2fkBEUA6cmNudZodPdK9B");
        break;
      case "herbalist":
        setIpfs("QmXMcZqfJpg1EkwHTW251NtUchFRWxz4x6uWiMjK4nnJJu");
        break;
    }
    safeMint?.();
  }

  function handleEvolve(tokenId: number, oldUri: string) {
    let newUri = "";
    switch (oldUri) {
      case "QmXbEkzQgPvqk5muWyDMMfqtbQZrrNrRkpzJRdQvQ2SvAp":
        newUri = "QmYAn6CAbSxH6X7wxiTZ1zbu4Zpn9ne2texkwShXNCmNLz";
      case "QmajUCWG1W77ZCRDofrzJXQKW2fkBEUA6cmNudZodPdK9B":
        newUri = "QmUVWh1BFgwugTLTXxYE11k2F6w3PQ1BiXMEiy4vHxZW62";
      case "QmXMcZqfJpg1EkwHTW251NtUchFRWxz4x6uWiMjK4nnJJu":
        newUri = "QmP89EPKdk3vpsBPxHJESBZ97uRdqkbVHs6dnDeCqacSZd";
    }
    setIpfs(newUri);
    setTokenId(tokenId);
    evolveClass?.();
  }

  const {
    data: evolveClassData,
    write: evolveClass,
    isLoading: isEvolveLoading,
    isSuccess: isEvolveStarted,
    error: evolveError,
  } = useContractWrite(contractWriteConfigEvolve);

  const {
    data: mintData,
    write: safeMint,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useContractWrite(contractWriteConfig);

  const { data: totalSupplyData } = useContractRead({
    ...contractConfig,
    functionName: "fetchTotalMints",
    watch: true,
  });

  const { data: currentMintedClasses } = useContractRead({
    ...contractConfig,
    functionName: "fetchClassesByAddress",
    args: [`0x${trimmedAddress}`],
    watch: true,
  });

  function handleImageDisplay(uri: string) {
    switch (uri) {
      case "QmXbEkzQgPvqk5muWyDMMfqtbQZrrNrRkpzJRdQvQ2SvAp":
        return blacksmith;
      case "QmajUCWG1W77ZCRDofrzJXQKW2fkBEUA6cmNudZodPdK9B":
        return lumberjack;
      case "QmXMcZqfJpg1EkwHTW251NtUchFRWxz4x6uWiMjK4nnJJu":
        return herbalist;
      case "QmPgVDzosMLfEbvy7ThMeVYq6yVp1xH5FUC8oB7qwBypS9":
        return lherbalist;
      case "Qmcx6GYJ2ZgVfPA45EhA9sFFwWzNqwzsAtf1KRtnamQzek":
        return llumberjack;
      case "QmacHgk1XYP2r3m6Hnx5G39eefaKeiQLyG7ua5BgG79SbW":
        return lblacksmith;
    }
  }

  const {
    data: txData,
    isSuccess: txSuccess,
    error: txError,
  } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  const {
    data: txDataEvolve,
    isSuccess: txSuccessEvolve,
    error: txErrorEvolve,
  } = useWaitForTransaction({
    hash: evolveClassData?.hash,
  });

  React.useEffect(() => {
    if (totalSupplyData) {
      setTotalMinted(totalSupplyData.toNumber());
    }

    if (currentMintedClasses) {
      let classesArray: any[] = [];
      currentMintedClasses.forEach((element) => {
        let newId = element.tokenId.toNumber();
        let owner = element.tokenOwner;
        let uri = element.uri;
        classesArray.push({ tokenId: newId, tokenOwner: owner, uri: uri });
      });
      setMintedClasses(classesArray);
    }
  }, [totalSupplyData, currentMintedClasses]);

  const transactionData = txData;

  return (
    <div className="page">
      <div className="container">
        <div style={{ flex: "1 1 auto" }}>
          <div style={{ padding: "50px 50px 24px 0" }}>
            <h1>Digital Strategy Task </h1>
            <ConnectButton />
            {mintError && (
              <p style={{ marginTop: 24, color: "#FF6257" }}>
                Error: {mintError.message}
              </p>
            )}
            {txError && (
              <p style={{ marginTop: 24, color: "#FF6257" }}>
                Error: {txError.message}
              </p>
            )}
          </div>
        </div>
        <h2>Choose a class to mint </h2>
        <div className="classSelectionContainer">
          <div className="classCardContainer">
            <div className="classImageContainer">
              <Image
                src={blacksmith}
                alt="Picture of the author"
                width={200}
                height={200}
              />
            </div>
            <div className="classButtonContainer">
              {mounted && isConnected && (
                <button
                  style={{ marginTop: 24 }}
                  disabled={isMintLoading || isMintStarted}
                  className="button"
                  data-mint-loading={isMintLoading}
                  data-mint-started={isMintStarted}
                  onClick={() => handleMint("blacksmith")}
                >
                  {isMintLoading && "Waiting for approval"}
                  {isMintStarted && "Minting..."}
                  {!isMintLoading && !isMintStarted && "Mint"}
                </button>
              )}
            </div>
          </div>
          <div className="classCardContainer">
            <div className="classImageContainer">
              <Image
                src={lumberjack}
                alt="Picture of the author"
                width={200}
                height={200}
              />
            </div>
            <div className="classButtonContainer">
              {mounted && isConnected && (
                <button
                  style={{ marginTop: 24 }}
                  disabled={isMintLoading || isMintStarted}
                  className="button"
                  data-mint-loading={isMintLoading}
                  data-mint-started={isMintStarted}
                  onClick={() => handleMint?.("lumberjack")}
                >
                  {isMintLoading && "Waiting for approval"}
                  {isMintStarted && "Minting..."}
                  {!isMintLoading && !isMintStarted && "Mint"}
                </button>
              )}
            </div>
          </div>
          <div className="classCardContainer">
            <div className="classImageContainer">
              <Image
                src={herbalist}
                alt="Picture of the author"
                width={200}
                height={200}
              />
            </div>
            <div className="classButtonContainer">
              {mounted && isConnected && (
                <button
                  style={{ marginTop: 24 }}
                  disabled={isMintLoading || isMintStarted}
                  className="button"
                  data-mint-loading={isMintLoading}
                  data-mint-started={isMintStarted}
                  onClick={() => handleMint?.("herbalist")}
                >
                  {isMintLoading && "Waiting for approval"}
                  {isMintStarted && "Minting..."}
                  {!isMintLoading && !isMintStarted && "Mint"}
                </button>
              )}
            </div>
          </div>
        </div>
        <div>
          <h2>Your minted classes</h2>
          <p style={{ margin: "12px 0 24px" }}>
            There have been {totalMinted} classes created so far!
          </p>
          <h3>My NFTS - those are only your NFTs</h3>
          {mintedClasses.map(({ tokenId, tokenOwner, uri }) => (
            <div className="classOwnedContainer" key={tokenId}>
              <div className="classOwnedCardContainer">
                Owner: {tokenOwner}
                <div className="classImageContainer">
                  <Image
                    src={handleImageDisplay(uri)}
                    alt="ifps not loading"
                    width={200}
                    height={200}
                  />
                </div>
                <div className="classButtonContainer">
                  {mounted && isConnected && (
                    <button
                      style={{
                        marginTop: 10,
                        marginLeft: 30,
                        marginBottom: 10,
                      }}
                      disabled={isEvolveLoading || isEvolveStarted}
                      className="button"
                      data-mint-loading={isEvolveLoading}
                      data-mint-started={isEvolveStarted}
                      onClick={() => handleEvolve(tokenId, uri)}
                    >
                      {isEvolveLoading && "Waiting for approval"}
                      {isEvolveStarted && "Evolving..."}
                      {!isEvolveLoading && !isEvolveStarted && "Evolve"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
